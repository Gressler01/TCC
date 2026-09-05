import { useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { ExpenseCard } from '../components/ExpenseCard';
import { ExpenseForm } from '../components/ExpenseForm';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { mockExpenses } from '../constants/mockExpenses';
import { NewExpense } from '../types/expense';
import { formatExpenseAmount } from '../utils/expenses';

type ExpensesScreenProps = {
  onGoHome: () => void;
  onSales: () => void;
};

export function ExpensesScreen({ onGoHome, onSales }: ExpensesScreenProps) {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [period, setPeriod] = useState('2025-05');
  const [formVisible, setFormVisible] = useState(false);
  const [year, month] = period.split('-').map(Number);
  const periodLabel = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long', year: 'numeric',
  });
  const visibleExpenses = expenses.filter((expense) => expense.date.startsWith(period));
  const total = visibleExpenses.reduce((sum, expense) => sum + expense.amountInCents, 0);

  function changeMonth(offset: number) {
    const next = new Date(year, month - 1 + offset, 1);
    setPeriod(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
  }

  function saveExpense(expense: NewExpense) {
    setExpenses((current) => [{ ...expense, id: `expense-${Date.now()}` }, ...current]);
    setPeriod(expense.date.slice(0, 7));
    setFormVisible(false);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable accessibilityLabel="Voltar ao início" accessibilityRole="button" onPress={onGoHome} style={styles.headerButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Gastos</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterRow}>
          <View style={styles.periodFilter}>
            <Pressable accessibilityLabel="Mês anterior" accessibilityRole="button" onPress={() => changeMonth(-1)} style={styles.monthButton}>
              <Text style={styles.chevron}>‹</Text>
            </Pressable>
            <Text accessibilityLiveRegion="polite" style={styles.periodText}>{periodLabel}</Text>
            <Pressable accessibilityLabel="Próximo mês" accessibilityRole="button" onPress={() => changeMonth(1)} style={styles.monthButton}>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.list}>
          {visibleExpenses.map((expense) => <ExpenseCard key={expense.id} {...expense} />)}
          {visibleExpenses.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhum gasto neste período</Text>
              <Text style={styles.emptyText}>Cadastre um novo gasto para começar.</Text>
            </View>
          )}
        </View>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total do período</Text>
          <Text style={styles.totalValue}>{formatExpenseAmount(total)}</Text>
        </View>
        <PrimaryButton label="+ Novo gasto" onPress={() => setFormVisible(true)} />
      </ScrollView>

      <BottomNavigation
        activeItem="menu"
        onAdd={() => setFormVisible(true)}
        onNavigate={(item) => {
          if (item === 'home') onGoHome();
          if (item === 'sales') onSales();
        }}
      />

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.header}>
              <Pressable accessibilityLabel="Cancelar novo gasto" accessibilityRole="button" onPress={() => setFormVisible(false)} style={styles.headerButton}>
                <Text style={styles.backIcon}>‹</Text>
              </Pressable>
              <Text style={styles.title}>Novo gasto</Text>
              <View style={styles.headerButton} />
            </View>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              {formVisible && <ExpenseForm onSave={saveExpense} />}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.dashboardBackground, flex: 1 },
  keyboardView: { flex: 1 },
  header: { alignItems: 'center', flexDirection: 'row', minHeight: 72, justifyContent: 'space-between', paddingHorizontal: 12 },
  headerButton: { alignItems: 'center', justifyContent: 'center', width: 44, height: 44 },
  backIcon: { color: colors.text, fontSize: 34, lineHeight: 38 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  filterRow: { alignItems: 'flex-end', marginBottom: 28 },
  periodFilter: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 9, borderWidth: 1, flexDirection: 'row' },
  monthButton: { alignItems: 'center', justifyContent: 'center', width: 44, height: 44 },
  chevron: { color: colors.textMuted, fontSize: 24 },
  periodText: { color: colors.textMuted, fontSize: 11, textTransform: 'capitalize' },
  list: { gap: 14 },
  totalCard: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 12, minHeight: 64, justifyContent: 'space-between', marginVertical: 24, padding: 12 },
  totalLabel: { color: colors.textMuted, fontSize: 11 },
  totalValue: { color: colors.text, fontSize: 14, fontWeight: '700' },
  emptyState: { paddingVertical: 48, gap: 10, alignItems: 'center' },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  emptyText: { color: colors.textMuted, fontSize: 12 },
});
