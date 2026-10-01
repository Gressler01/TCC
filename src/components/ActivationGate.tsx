import { useEffect, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { ActivationScreen } from '../screens/ActivationScreen';
import { getInstallationId, isInstallationAuthorized } from '../services/activation';
import { supabase } from '../services/supabase';

export function ActivationGate({ children }: { children: ReactNode }) {
  const [installationId, setInstallationId] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let disposed = false;
    let checking = false;

    async function check() {
      if (checking || disposed) return;
      checking = true;
      setBusy(true);
      try {
        const id = await getInstallationId();
        if (disposed) return;
        setInstallationId(id);
        const allowed = await isInstallationAuthorized(id);
        if (disposed) return;
        setAuthorized(allowed);
        setError(allowed ? '' : 'Este aparelho ainda não está autorizado. Após a liberação, toque em Verificar ativação.');
      } catch {
        if (disposed) return;
        setAuthorized(false);
        setError('Não foi possível verificar a ativação. Confira a internet e tente novamente. Se continuar, fale com o responsável pelo aplicativo.');
      } finally {
        checking = false;
        if (!disposed) setBusy(false);
      }
    }

    if (AppState.currentState === 'active') supabase.auth.startAutoRefresh();
    void check();
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
        void check();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setAuthorized(false);
        setInstallationId('');
        setError('A sessão deste aparelho terminou. Toque em Verificar ativação para continuar.');
      }
    });
    // RLS bloqueia novas operações imediatamente; a tela também é atualizada.
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') void check();
    }, 30_000);

    return () => {
      disposed = true;
      clearInterval(interval);
      appState.remove();
      subscription.unsubscribe();
      supabase.auth.stopAutoRefresh();
    };
  }, [retry]);

  if (authorized) return children;
  return <ActivationScreen installationId={installationId} busy={busy} error={error} onCheck={() => setRetry((value) => value + 1)} />;
}
