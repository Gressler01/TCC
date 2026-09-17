import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { MetricCard } from '../components/MetricCard';
import { ProductionChart } from '../components/ProductionChart';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { listExpenses, listHarvests, listSales } from '../services/records';
import type { Expense } from '../types/expense';
import type { Harvest } from '../types/harvest';
import type { Sale } from '../types/sale';

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

function comparison(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 'Sem registros nos dois meses' : 'Primeiro registro após um mês sem dados';
  const percentage = Math.round(Math.abs((current - previous) / previous) * 100);
  if (current === previous) return 'Mesmo valor do mês anterior';
  return `${current > previous ? 'Subiu' : 'Caiu'} ${percentage}% em relação ao mês anterior`;
}

export function DashboardScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState(() => monthKey(new Date()));
  const [records, setRecords] = useState<{ harvests: Harvest[]; expenses: Expense[]; sales: Sale[] }>({
    harvests: [], expenses: [], sales: [],
  });
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ month: string; value: number }[]>([]);
  const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const [year, month] = period.split('-').map(Number);
  const periodLabel = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const previousPeriod = monthKey(new Date(year, month - 2, 1));
  const previousLabel = new Date(year, month - 2, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const canGoForward = period < monthKey(new Date());

  function changeMonth(offset: number) {
    setPeriod(monthKey(new Date(year, month - 1 + offset, 1)));
  }

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoadError('');
    setLoading(true);
    Promise.all([listHarvests(), listExpenses(), listSales()]).then(([harvests, expenses, sales]) => {
      if (!active) return;
      setRecords({ harvests, expenses, sales });
      const months = Array.from({ length: 6 }, (_, index) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - (5 - index));
        const chartPeriod = monthKey(date);
        return {
          month: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
          value: harvests.filter((item) => item.date.startsWith(chartPeriod)).reduce((sum, item) => sum + item.quantityInGrams / 1000, 0),
        };
      });
      setChartData(months);
    }).catch(() => { if (active) setLoadError('Não foi possível carregar os indicadores.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []));

  const summary = {
    harvestGrams: records.harvests.filter((item) => item.date.startsWith(period)).reduce((sum, item) => sum + item.quantityInGrams, 0),
    salesCents: records.sales.filter((item) => item.date.startsWith(period)).reduce((sum, item) => sum + item.totalInCents, 0),
    expensesCents: records.expenses.filter((item) => item.date.startsWith(period)).reduce((sum, item) => sum + item.amountInCents, 0),
  };
  const previousSummary = {
    harvestGrams: records.harvests.filter((item) => item.date.startsWith(previousPeriod)).reduce((sum, item) => sum + item.quantityInGrams, 0),
    salesCents: records.sales.filter((item) => item.date.startsWith(previousPeriod)).reduce((sum, item) => sum + item.totalInCents, 0),
    expensesCents: records.expenses.filter((item) => item.date.startsWith(previousPeriod)).reduce((sum, item) => sum + item.amountInCents, 0),
  };

  const metrics = [
    { title: 'Produção (mês)', value: `${(summary.harvestGrams / 1000).toLocaleString('pt-BR')} kg`, change: 'Produto colhido no período' },
    { title: 'Vendas (mês)', value: money(summary.salesCents), change: 'Total vendido no período' },
    { title: 'Custos (mês)', value: money(summary.expensesCents), change: 'Total de custos no período' },
    { title: 'Lucro (mês)', value: money(summary.salesCents - summary.expensesCents), change: 'Vendas menos custos do período' },
  ];
  const insights = [
    { label: 'Produção', detail: comparison(summary.harvestGrams, previousSummary.harvestGrams) },
    { label: 'Vendas', detail: comparison(summary.salesCents, previousSummary.salesCents) },
    { label: 'Custos', detail: comparison(summary.expensesCents, previousSummary.expensesCents) },
  ];
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.greeting}></Text>
          <Text style={styles.subtitle}>Aqui está um resumo da sua produção</Text>
        </View>

        <View style={styles.periodSelector}>
          <Pressable accessibilityLabel="Mês anterior" accessibilityRole="button" onPress={() => changeMonth(-1)} style={styles.monthButton}>
            <Text style={styles.chevron}>‹</Text>
          </Pressable>
          <Text accessibilityLiveRegion="polite" style={styles.periodLabel}>{periodLabel}</Text>
          <Pressable accessibilityLabel="Próximo mês" accessibilityRole="button" accessibilityState={{ disabled: !canGoForward }} disabled={!canGoForward} onPress={() => changeMonth(1)} style={styles.monthButton}>
            <Text style={[styles.chevron, !canGoForward && styles.disabledChevron]}>›</Text>
          </Pressable>
        </View>

        {loadError ? <Text accessibilityRole="alert" style={styles.loadError}>{loadError}</Text> : null}

        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </View>

        <ProductionChart data={chartData} />

        <View style={styles.insightsCard}>
          <Text style={styles.sectionTitle}>Destaques do período</Text>
          <Text style={styles.insightsSubtitle}>Comparação com {previousLabel}</Text>
          {loading ? <Text style={styles.insightDetail}>Carregando dados...</Text> : null}
          {!loading && !loadError ? insights.map((insight) => (
            <View key={insight.label} style={styles.insightRow}>
              <Text style={styles.insightLabel}>{insight.label}</Text>
              <Text style={styles.insightDetail}>{insight.detail}</Text>
            </View>
          )) : null}
          {!loading && !loadError && summary.salesCents > 0 ? (
            <Text style={styles.costShare}>
              Os custos representaram {Math.round(summary.expensesCents / summary.salesCents * 100)}% das vendas neste mês.
            </Text>
          ) : null}
        </View>
        <PrimaryButton
          label="Ver indicadores"
          onPress={() => router.push({ pathname: '/indicators', params: { period } })}
        />
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
  periodSelector: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  chevron: { color: colors.primary, fontSize: 28 },
  disabledChevron: { opacity: 0.3 },
  periodLabel: { color: colors.text, fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  loadError: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  metricsGrid: {
    columnGap: 13,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  insightsCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  insightsSubtitle: { color: colors.textMuted, fontSize: 11, textTransform: 'capitalize' },
  insightRow: { borderTopColor: colors.border, borderTopWidth: 1, gap: 4, paddingTop: 12 },
  insightLabel: { color: colors.text, fontSize: 12, fontWeight: '700' },
  insightDetail: { color: colors.textMuted, fontSize: 12 },
  costShare: { color: colors.primary, fontSize: 12, fontWeight: '600', lineHeight: 18 },
});
