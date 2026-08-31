import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { SaleCard } from '../components/SaleCard';
import { colors } from '../constants/colors';

const sales = [
  { client: 'Comércio Local', date: '05/05/2025', quantity: '45 kg', value: 'R$ 2.150,00' },
  { client: 'Mercado Central', date: '10/05/2025', quantity: '80 kg', value: 'R$ 3.800,00' },
  {
    client: 'Supermercado Bom Preço',
    date: '15/05/2025',
    quantity: '60 kg',
    value: 'R$ 2.900,00',
  },
  { client: 'Feira Municipal', date: '20/05/2025', quantity: '28 kg', value: 'R$ 1.600,00' },
];

type SalesScreenProps = {
  onGoHome: () => void;
};

export function SalesScreen({ onGoHome }: SalesScreenProps) {
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
          {sales.map((sale) => (
            <SaleCard key={`${sale.client}-${sale.date}`} {...sale} />
          ))}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total do período</Text>
          <Text style={styles.totalValue}>R$ 10.450,00</Text>
        </View>
      </ScrollView>

      <BottomNavigation
        activeItem="sales"
        onNavigate={(item) => item === 'home' && onGoHome()}
      />
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
});
