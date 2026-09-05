import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { Expense } from '../types/expense';
import { formatExpenseAmount, formatExpenseDate } from '../utils/expenses';

export function ExpenseCard({ description, date, amountInCents }: Expense) {
  return (
    <View style={styles.card}>
      <View style={styles.icon} accessible={false}>
        <View style={styles.dot} />
      </View>
      <View style={styles.details}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{formatExpenseDate(date)}</Text>
      </View>
      <Text style={styles.amount}>{formatExpenseAmount(amountInCents)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 72,
    padding: 12,
    gap: 12,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  dot: { backgroundColor: colors.primary, borderRadius: 5, height: 10, width: 10 },
  details: { flex: 1, gap: 8, minWidth: 0 },
  description: { color: colors.text, fontSize: 12, fontWeight: '700' },
  date: { color: colors.textMuted, fontSize: 10 },
  amount: { color: colors.text, fontSize: 12, fontWeight: '700', flexShrink: 1 },
});
