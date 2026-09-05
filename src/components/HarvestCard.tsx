import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import type { Harvest } from '../types/harvest';
import { formatDate } from '../utils/dates';
import { formatHarvestQuantity } from '../utils/harvests';

export function HarvestCard({ date, quantityInGrams, notes }: Harvest) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.details}>
          <Text style={styles.title}>Morangos</Text>
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>
        <Text style={styles.quantity}>{formatHarvestQuantity(quantityInGrams)}</Text>
      </View>
      {notes ? <Text style={styles.notes}>{notes}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  details: { gap: 8 },
  title: { color: colors.text, fontSize: 14, fontWeight: '700' },
  date: { color: colors.textMuted, fontSize: 12 },
  quantity: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  notes: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
});
