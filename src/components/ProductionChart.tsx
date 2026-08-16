import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

const productionData = [
  { month: 'Jan', value: 35 },
  { month: 'Fev', value: 75 },
  { month: 'Mar', value: 62 },
  { month: 'Abr', value: 92 },
  { month: 'Mai', value: 58 },
  { month: 'Jun', value: 110 },
];

export function ProductionChart() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Produção dos últimos 6 meses (kg)</Text>

      <View style={styles.chart}>
        {productionData.map((item) => (
          <View key={item.month} style={styles.column}>
            <View style={styles.barArea}>
              <View style={[styles.bar, { height: item.value }]} />
            </View>
            <Text style={styles.month}>{item.month}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 205,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  title: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  column: {
    alignItems: 'center',
    flex: 1,
  },
  barArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    width: 7,
  },
  month: {
    color: colors.textMuted,
    fontSize: 9,
    marginBottom: 12,
    marginTop: 18,
  },
});
