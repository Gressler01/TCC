import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { colors } from '../constants/colors';
import { listExpenses, listHarvests, listSales } from '../services/records';
import type { Expense } from '../types/expense';
import type { Harvest } from '../types/harvest';
import type { Sale } from '../types/sale';

type Tab = 'Geral' | 'Produção' | 'Vendas' | 'Custos';
type MonthlyData = { key: string; label: string; harvestGrams: number; revenue: number; costs: number };
type IndicatorCardProps = { label: string; value: string };

const tabs: Tab[] = ['Geral', 'Produção', 'Vendas', 'Custos'];
const chartColors = { revenue: colors.primary, costs: '#E03B33', result: '#D45C3D', production: colors.primary };
const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const kg = (grams: number) => `${(grams / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`;

function IndicatorCard({ label, value }: IndicatorCardProps) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text numberOfLines={2} adjustsFontSizeToFit style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function IndicatorsScreen({ initialPeriod, onBack }: { initialPeriod?: string; onBack: () => void }) {
  const [period, setPeriod] = useState(() =>
    initialPeriod && /^\d{4}-(0[1-9]|1[0-2])$/.test(initialPeriod) && initialPeriod <= monthKey(new Date())
      ? initialPeriod : monthKey(new Date()),
  );
  const [tab, setTab] = useState<Tab>('Geral');
  const [records, setRecords] = useState<{ harvests: Harvest[]; expenses: Expense[]; sales: Sale[] }>({
    harvests: [], expenses: [], sales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [year, month] = period.split('-').map(Number);
  const periodLabel = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const canGoForward = period < monthKey(new Date());

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([listHarvests(), listExpenses(), listSales()])
      .then(([harvests, expenses, sales]) => {
        if (active) setRecords({ harvests, expenses, sales });
      })
      .catch(() => { if (active) setError('Não foi possível carregar os indicadores.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []));

  function changeMonth(offset: number) {
    setPeriod(monthKey(new Date(year, month - 1 + offset, 1)));
  }

  const months: MonthlyData[] = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(year, month - 1 - (5 - index), 1);
    const key = monthKey(date);
    return {
      key,
      label: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
      harvestGrams: records.harvests.filter((item) => item.date.startsWith(key)).reduce((sum, item) => sum + item.quantityInGrams, 0),
      revenue: records.sales.filter((item) => item.date.startsWith(key)).reduce((sum, item) => sum + item.totalInCents, 0),
      costs: records.expenses.filter((item) => item.date.startsWith(key)).reduce((sum, item) => sum + item.amountInCents, 0),
    };
  });
  const current = months[5];
  const harvestCount = records.harvests.filter((item) => item.date.startsWith(period)).length;
  const salesCount = records.sales.filter((item) => item.date.startsWith(period)).length;
  const expenseCount = records.expenses.filter((item) => item.date.startsWith(period)).length;
  const result = current.revenue - current.costs;
  const cards: IndicatorCardProps[] = tab === 'Geral' ? [
    { label: 'Receita (mês)', value: money(current.revenue) },
    { label: 'Custo (mês)', value: money(current.costs) },
    { label: 'Lucro estimado', value: money(result) },
  ] : tab === 'Produção' ? [
    { label: 'Colhido (mês)', value: kg(current.harvestGrams) },
    { label: 'Colheitas', value: String(harvestCount) },
    { label: 'Média por colheita', value: kg(harvestCount ? current.harvestGrams / harvestCount : 0) },
  ] : tab === 'Vendas' ? [
    { label: 'Receita (mês)', value: money(current.revenue) },
    { label: 'Vendas', value: String(salesCount) },
    { label: 'Média por venda', value: money(salesCount ? current.revenue / salesCount : 0) },
  ] : [
    { label: 'Custos (mês)', value: money(current.costs) },
    { label: 'Gastos', value: String(expenseCount) },
    { label: 'Média por gasto', value: money(expenseCount ? current.costs / expenseCount : 0) },
  ];
  const series = tab === 'Geral' ? [
    { label: 'Receita', color: chartColors.revenue, value: (item: MonthlyData) => item.revenue },
    { label: 'Custos', color: chartColors.costs, value: (item: MonthlyData) => item.costs },
    { label: 'Resultado', color: chartColors.result, value: (item: MonthlyData) => item.revenue - item.costs },
  ] : tab === 'Produção' ? [
    { label: 'Produção', color: chartColors.production, value: (item: MonthlyData) => item.harvestGrams / 1000 },
  ] : tab === 'Vendas' ? [
    { label: 'Receita', color: chartColors.revenue, value: (item: MonthlyData) => item.revenue },
  ] : [
    { label: 'Custos', color: chartColors.costs, value: (item: MonthlyData) => item.costs },
  ];
  const largestValue = Math.max(1, ...months.flatMap((item) => series.map((entry) => entry.value(item))));
  const hasChartData = months.some((item) => series.some((entry) => entry.value(item) !== 0));
  const hasNegativeResult = tab === 'Geral' && months.some((item) => item.revenue - item.costs < 0);
  const margin = current.revenue > 0 ? Math.round(result / current.revenue * 100) : null;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable accessibilityLabel="Voltar ao dashboard" accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Indicadores</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View accessibilityRole="tablist" style={styles.tabs}>
          {tabs.map((item) => (
            <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.activeTab]}>
              <Text style={[styles.tabText, tab === item && styles.activeTabText]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.periodSelector}>
          <Pressable accessibilityLabel="Mês anterior" accessibilityRole="button" onPress={() => changeMonth(-1)} style={styles.monthButton}>
            <Text style={styles.chevron}>‹</Text>
          </Pressable>
          <Text accessibilityLiveRegion="polite" style={styles.periodText}>{periodLabel}</Text>
          <Pressable accessibilityLabel="Próximo mês" accessibilityRole="button" accessibilityState={{ disabled: !canGoForward }} disabled={!canGoForward} onPress={() => changeMonth(1)} style={styles.monthButton}>
            <Text style={[styles.chevron, !canGoForward && styles.disabledChevron]}>›</Text>
          </Pressable>
        </View>

        {loading ? <Text style={styles.feedback}>Carregando indicadores...</Text> : null}
        {error ? <Text accessibilityRole="alert" style={styles.feedback}>{error}</Text> : null}
        {!loading && !error ? <>
          <View style={styles.metricsRow}>
            {cards.map((card) => <IndicatorCard key={card.label} {...card} />)}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Comparativo 6 meses{tab === 'Produção' ? ' (kg)' : ''}</Text>
            <View style={styles.legend}>
              {series.map((entry) => (
                <View key={entry.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: entry.color }]} />
                  <Text style={styles.legendText}>{entry.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chart}>
              {months.map((item) => (
                <View key={item.key} accessible accessibilityLabel={`${item.label}: ${series.map((entry) => `${entry.label} ${tab === 'Produção' ? kg(entry.value(item) * 1000) : money(entry.value(item))}`).join(', ')}`} style={styles.chartGroup}>
                  <View style={styles.barArea}>
                    {series.map((entry) => (
                      <View key={entry.label} style={[styles.bar, { backgroundColor: entry.color, height: entry.value(item) > 0 ? Math.max(2, entry.value(item) / largestValue * 150) : 0 }]} />
                    ))}
                  </View>
                  <Text style={styles.monthLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
            {!hasChartData ? <Text style={styles.chartNote}>Sem registros nos últimos seis meses.</Text> : null}
            {hasNegativeResult ? <Text style={styles.chartNote}>Barras de resultado negativo são omitidas.</Text> : null}
          </View>

          {tab === 'Geral' ? (
            <Text style={styles.marginText}>Margem estimada: {margin === null ? 'sem vendas no período' : `${margin}%`}</Text>
          ) : null}
        </> : null}
      </ScrollView>
      <BottomNavigation activeItem="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.dashboardBackground, flex: 1 },
  header: { alignItems: 'center', flexDirection: 'row', height: 72, justifyContent: 'space-between', paddingHorizontal: 12 },
  headerButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backIcon: { color: colors.text, fontSize: 34, lineHeight: 38 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  content: { gap: 24, paddingBottom: 32, paddingHorizontal: 24 },
  tabs: { flexDirection: 'row', justifyContent: 'space-between' },
  tab: { alignItems: 'center', borderBottomColor: 'transparent', borderBottomWidth: 3, flex: 1, minHeight: 42, justifyContent: 'center' },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 11, fontWeight: '500' },
  activeTabText: { color: colors.primary, fontWeight: '700' },
  periodSelector: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 10, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between' },
  monthButton: { alignItems: 'center', height: 42, justifyContent: 'center', width: 44 },
  chevron: { color: colors.primary, fontSize: 24 },
  disabledChevron: { opacity: 0.3 },
  periodText: { color: colors.text, fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  feedback: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  metricsRow: { flexDirection: 'row', gap: 8 },
  metricCard: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 11, borderWidth: 1, flex: 1, height: 96, justifyContent: 'center', minWidth: 0, paddingHorizontal: 8 },
  metricLabel: { color: colors.textMuted, fontSize: 9 },
  metricValue: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 14 },
  chartCard: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 13, borderWidth: 1, height: 335, paddingHorizontal: 14, paddingTop: 14 },
  chartTitle: { color: colors.text, fontSize: 12, fontWeight: '700' },
  legend: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 24 },
  legendItem: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  legendDot: { borderRadius: 4, height: 7, width: 7 },
  legendText: { color: colors.textMuted, fontSize: 9 },
  chart: { flex: 1, flexDirection: 'row', gap: 4, marginTop: 24 },
  chartGroup: { alignItems: 'center', flex: 1 },
  barArea: { alignItems: 'flex-end', flex: 1, flexDirection: 'row', gap: 2, justifyContent: 'center' },
  bar: { borderRadius: 2, width: 8 },
  monthLabel: { color: colors.textMuted, fontSize: 9, marginBottom: 26, marginTop: 14 },
  chartNote: { color: colors.textMuted, fontSize: 9, textAlign: 'center' },
  marginText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});
