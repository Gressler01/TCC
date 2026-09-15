import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { SaleCard } from '../components/SaleCard';
import { colors } from '../constants/colors';
import { listSales } from '../services/records';
import type { Sale } from '../types/sale';

type SalesScreenProps = {
  onGoHome: () => void;
};

export function SalesScreen({ onGoHome }: SalesScreenProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listSales()
      .then(setSales)
      .catch(() => setError('Não foi possível carregar as vendas.'))
      .finally(() => setLoading(false));
  }, []);

  const total = sales.reduce((sum, sale) => sum + sale.totalInCents, 0);
  const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (date: string) => date.split('-').reverse().join('/');
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Abrir menu"
          accessibilityRole="button"
          hitSlop={12}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={styles.title}>Vendas</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filterRow}>
          <Pressable
            accessibilityLabel="Selecionar período"
            accessibilityRole="button"
            style={({ pressed }) => [styles.periodFilter, pressed && styles.pressed]}
          >
            <Text style={styles.periodText}>Maio/2025</Text>
            <Text style={styles.chevron}>⌄</Text>
          </Pressable>
        </View>

        <View style={styles.salesList}>
          {loading ? <Text style={styles.feedback}>Carregando vendas...</Text> : null}
          {error ? <Text accessibilityRole="alert" style={styles.feedback}>{error}</Text> : null}
          {sales.map((sale) => (
            <SaleCard
              key={sale.id}
              client={sale.client}
              date={formatDate(sale.date)}
              quantity={sale.saleType === 'tray' ? `${sale.quantity} bandejas` : `${sale.quantity} kg`}
              value={formatMoney(sale.totalInCents)}
            />
          ))}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total do período</Text>
          <Text style={styles.totalValue}>{formatMoney(total)}</Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  menuIcon: {
    color: colors.text,
    fontSize: 18,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 18,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  filterRow: {
    alignItems: 'flex-end',
    marginBottom: 22,
  },
  periodFilter: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    height: 42,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    width: 128,
  },
  periodText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 12,
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
  pressed: {
    opacity: 0.65,
  },
  feedback: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});
