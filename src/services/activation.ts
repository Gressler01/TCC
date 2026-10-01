import { supabase } from './supabase';

let pendingSession: Promise<string> | null = null;

export function getInstallationId(): Promise<string> {
  // Evita criar duas sessões durante remontagens ou verificações simultâneas.
  if (!pendingSession) {
    pendingSession = loadInstallationId().finally(() => { pendingSession = null; });
  }
  return pendingSession;
}

async function loadInstallationId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (data.session) return data.session.user.id;

  const result = await supabase.auth.signInAnonymously();
  if (result.error) throw result.error;
  if (!result.data.session) throw new Error('Não foi possível criar a sessão.');
  return result.data.session.user.id;
}

export async function isInstallationAuthorized(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('authorized_devices')
    .select('active')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.active === true;
}
