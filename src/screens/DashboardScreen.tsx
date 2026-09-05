import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { MetricCard } from '../components/MetricCard';
import { ProductionChart } from '../components/ProductionChart';
import { QuickAction } from '../components/QuickAction';
import { colors } from '../constants/colors';

const metrics = [
  { title: 'Produção (mês)', value: '1.250 kg', change: '+12% vs mês anterior' },
  { title: 'Vendas (mês)', value: 'R$ 12.450,00', change: '+8% vs mês anterior' },
  { title: 'Custos (mês)', value: 'R$ 4.230,00', change: '-5% vs mês anterior' },
  { title: 'Lucro (mês)', value: 'R$ 8.220,00', change: '+15% vs mês anterior' },
];

const quickActions = ['Colheita', 'Custos', 'Vendas', 'Mais'];

type DashboardScreenProps = {
  onNewSale?: () => void;
  onSales?: () => void;
  onExpenses?: () => void;
  onHarvest?: () => void;
};

export function DashboardScreen({ onNewSale, onSales, onExpenses, onHarvest }: DashboardScreenProps) {
  const actionHandlers: Record<string, (() => void) | undefined> = {
    Colheita: onHarvest,
    Custos: onExpenses,
    Vendas: onSales,
  };
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.greeting}>Olá, João!</Text>
          <Text style={styles.subtitle}>Aqui está um resumo da sua produção</Text>
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </View>

        <ProductionChart />

        <View>
          <Text style={styles.sectionTitle}>Atividades rápidas</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <QuickAction
                key={action}
                label={action}
                onPress={actionHandlers[action]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        activeItem="home"
        onAdd={onNewSale}
        onNavigate={(item) => item === 'sales' && onSales?.()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.dashboardBackground,
    flex: 1,
  },
  content: {
    gap: 28,
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  greeting: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 13,
    marginTop: 4,
  },
  metricsGrid: {
    columnGap: 13,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
});
