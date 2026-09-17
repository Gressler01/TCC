import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { MonthFilter } from '../components/MonthFilter';
import { PrimaryButton } from '../components/PrimaryButton';
import { SaleCard } from '../components/SaleCard';
import { colors } from '../constants/colors';
import { listSales } from '../services/records';
import type { Sale } from '../types/sale';
import { toLocalDateString } from '../utils/dates';

type SalesScreenProps = {
  onNewSale: () => void;
};

export function SalesScreen({ onNewSale }: SalesScreenProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [period, setPeriod] = useState(() => toLocalDateString(new Date()).slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    setError('');
    listSales()
      .then((records) => { if (active) setSales(records); })
      .catch(() => { if (active) setError('Não foi possível carregar as vendas.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []));

  const visibleSales = sales.filter((sale) => sale.date.startsWith(period));
  const total = visibleSales.reduce((sum, sale) => sum + sale.totalInCents, 0);
  const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (date: string) => date.split('-').reverse().join('/');
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Vendas</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filterRow}>
          <MonthFilter value={period} onChange={setPeriod} />
        </View>

        <View style={styles.salesList}>
          {loading ? <Text style={styles.feedback}>Carregando vendas...</Text> : null}
          {error ? <Text accessibilityRole="alert" style={styles.feedback}>{error}</Text> : null}
          {!loading && !error && visibleSales.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhuma venda neste período</Text>
              <Text style={styles.feedback}>Toque em Adicionar venda para registrar uma nova venda.</Text>
            </View>
          ) : null}
          {!loading && !error && visibleSales.map((sale) => (
            <SaleCard
              key={sale.id}
              client={sale.client}
              date={formatDate(sale.date)}
              quantity={sale.saleType === 'tray' ? `${sale.quantity} bandejas` : `${sale.quantity} kg`}
              value={formatMoney(sale.totalInCents)}
            />
          ))}
        </View>

        {!loading && !error ? (
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total do período</Text>
            <Text style={styles.totalValue}>{formatMoney(total)}</Text>
          </View>
        ) : null}
        <PrimaryButton label="+ Adicionar venda" onPress={onNewSale} />
      </ScrollView>

      <BottomNavigation activeItem="sales" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.dashboardBackground,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 72,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  filterRow: {
    alignItems: 'flex-end',
    marginBottom: 22,
  },
  salesList: {
    gap: 16,
  },
  totalCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 36,
    paddingHorizontal: 14,
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  totalValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: { alignItems: 'center', gap: 8, paddingVertical: 36 },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  feedback: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});
