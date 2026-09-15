import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { MetricCard } from '../components/MetricCard';
import { ProductionChart } from '../components/ProductionChart';
import { QuickAction } from '../components/QuickAction';
import { colors } from '../constants/colors';
import { listExpenses, listHarvests, listSales } from '../services/records';

const quickActions = ['Colheita', 'Custos', 'Vendas', 'Mais'];

type DashboardScreenProps = {
  onNewSale?: () => void;
  onSales?: () => void;
  onExpenses?: () => void;
  onHarvest?: () => void;
};

export function DashboardScreen({ onNewSale, onSales, onExpenses, onHarvest }: DashboardScreenProps) {
  const [summary, setSummary] = useState({ harvestGrams: 0, salesCents: 0, expensesCents: 0 });
  const [chartData, setChartData] = useState<{ month: string; value: number }[]>([]);
  const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  useEffect(() => {
    Promise.all([listHarvests(), listExpenses(), listSales()]).then(([harvests, expenses, sales]) => {
      const currentPeriod = new Date().toISOString().slice(0, 7);
      const harvestGrams = harvests.filter((item) => item.date.startsWith(currentPeriod)).reduce((sum, item) => sum + item.quantityInGrams, 0);
      const expensesCents = expenses.filter((item) => item.date.startsWith(currentPeriod)).reduce((sum, item) => sum + item.amountInCents, 0);
      const salesCents = sales.filter((item) => item.date.startsWith(currentPeriod)).reduce((sum, item) => sum + item.totalInCents, 0);
      setSummary({ harvestGrams, salesCents, expensesCents });

      const months = Array.from({ length: 6 }, (_, index) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - (5 - index));
        const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return {
          month: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
          value: harvests.filter((item) => item.date.startsWith(period)).reduce((sum, item) => sum + item.quantityInGrams / 1000, 0),
        };
      });
      setChartData(months);
    });
  }, []);

  const metrics = [
    { title: 'Produção (mês)', value: `${(summary.harvestGrams / 1000).toLocaleString('pt-BR')} kg`, change: 'Dados do banco' },
    { title: 'Vendas (mês)', value: money(summary.salesCents), change: 'Dados do banco' },
    { title: 'Custos (mês)', value: money(summary.expensesCents), change: 'Dados do banco' },
    { title: 'Lucro (mês)', value: money(summary.salesCents - summary.expensesCents), change: 'Vendas menos custos' },
  ];
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

        <ProductionChart data={chartData} />

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

      <BottomNavigation activeItem="home" />
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
