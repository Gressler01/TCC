import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type ProductionChartProps = {
  data: { month: string; value: number }[];
};

export function ProductionChart({ data }: ProductionChartProps) {
  const largestValue = Math.max(...data.map((item) => item.value), 1);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Produção dos últimos 6 meses (kg)</Text>

      <View style={styles.chart}>
        {data.map((item) => (
          <View key={item.month} style={styles.column}>
            <View style={styles.barArea}>
              <View style={[styles.bar, { height: Math.max((item.value / largestValue) * 105, 2) }]} />
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
