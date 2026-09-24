import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { colors } from '../constants/colors';

const screens = [
  {
    title: 'Início',
    description: 'Veja o resumo mensal da produção, vendas, custos e resultado, além dos destaques do período.',
    path: '/dashboard',
  },
  {
    title: 'Colheita',
    description: 'Registre colheitas e consulte a quantidade total e os registros de cada mês.',
    path: '/harvest',
  },
  {
    title: 'Vendas',
    description: 'Registre vendas por bandeja ou quilo e acompanhe o total vendido no mês.',
    path: '/sales',
  },
  {
    title: 'Custos',
    description: 'Cadastre os gastos da produção e confira o total de custos por mês.',
    path: '/expenses',
  },
  {
    title: 'Indicadores',
    description: 'Compare receita, custos, resultado e produção dos últimos seis meses.',
    path: '/indicators',
  },
] as const;

export function MenuScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.aboutCard}>
          <Text style={styles.cardEyebrow}>SOBRE O APLICATIVO</Text>
          <Text style={styles.appName}>Granja Bonini</Text>
          <Text style={styles.bodyText}>
            Um aplicativo para acompanhar a produção de morangos e organizar colheitas, vendas e gastos da granja.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que você encontra aqui</Text>
          <Text style={styles.sectionSubtitle}>Toque em uma tela para acessá-la.</Text>
          <View style={styles.screenList}>
            {screens.map((screen) => (
              <Pressable
                key={screen.path}
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${screen.title}`}
                accessibilityHint={screen.description}
                onPress={() => router.navigate(screen.path)}
                style={({ pressed }) => [styles.screenCard, pressed && styles.pressed]}
              >
                <View style={styles.screenText}>
                  <Text style={styles.screenTitle}>{screen.title}</Text>
                  <Text style={styles.bodyText}>{screen.description}</Text>
                </View>
                <Text style={styles.chevron} accessibilityElementsHidden>›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation activeItem="menu" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.dashboardBackground, flex: 1 },
  header: { alignItems: 'center', height: 72, justifyContent: 'center', paddingHorizontal: 24 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  content: { gap: 28, paddingBottom: 32, paddingHorizontal: 24 },
  aboutCard: { backgroundColor: colors.background, borderRadius: 14, gap: 12, padding: 20 },
  cardEyebrow: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  appName: { color: colors.primary, fontSize: 22, fontWeight: '700' },
  bodyText: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  section: { gap: 8 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sectionSubtitle: { color: colors.textMuted, fontSize: 12 },
  screenList: { gap: 12, marginTop: 8 },
  screenCard: {
    alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border,
    borderRadius: 12, borderWidth: 1, flexDirection: 'row', minHeight: 86, padding: 16,
  },
  screenText: { flex: 1, gap: 6 },
  screenTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  chevron: { color: colors.primary, fontSize: 26, marginLeft: 12 },
  pressed: { opacity: 0.7 },
});
