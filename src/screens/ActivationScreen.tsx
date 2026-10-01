import { ActivityIndicator, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/colors';

type ActivationScreenProps = {
  installationId: string;
  busy: boolean;
  error: string;
  onCheck: () => void;
};

export function ActivationScreen({ installationId, busy, error, onCheck }: ActivationScreenProps) {
  async function shareCode() {
    try {
      await Share.share({ message: `Solicitação de ativação — Granja Bonini\n\nCódigo da instalação:\n${installationId}` });
    } catch {
      // O código também pode ser selecionado e copiado na tela.
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}><Text style={styles.initial}>B</Text></View>
        <Text style={styles.brandName}>Granja Bonini</Text>
        <Text style={styles.title}>Ativar este aparelho</Text>
        <Text style={styles.description}>
          Para acessar os dados da granja, envie o código abaixo ao responsável pela ativação.
          Depois da liberação, você poderá entrar sem e-mail ou senha.
        </Text>
        {installationId ? (
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Código da instalação</Text>
            <Text selectable style={styles.code}>{installationId}</Text>
            <Text style={styles.hint}>Toque e segure o código para copiar.</Text>
          </View>
        ) : null}
        {busy ? <ActivityIndicator color={colors.primary} accessibilityLabel="Verificando ativação" /> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          {installationId ? <PrimaryButton label="Compartilhar código" onPress={shareCode} /> : null}
          <PrimaryButton label={busy ? 'Verificando...' : 'Verificar ativação'} onPress={onCheck} disabled={busy} />
        </View>
        <Text style={styles.hint}>
          É necessário estar conectado à internet. Se trocar de aparelho ou limpar os dados do aplicativo,
          poderá ser necessária uma nova ativação.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 28, gap: 20 },
  brand: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.white, fontSize: 36, fontWeight: '700' },
  brandName: { color: colors.primary, fontSize: 26, fontWeight: '700' },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  description: { color: colors.textMuted, fontSize: 15, lineHeight: 23, textAlign: 'center' },
  codeCard: { width: '100%', padding: 20, gap: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.white },
  codeLabel: { color: colors.text, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  code: { color: colors.primary, fontSize: 18, lineHeight: 28, fontWeight: '700', textAlign: 'center' },
  hint: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  actions: { width: '100%', gap: 12 },
  error: { color: colors.text, fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
