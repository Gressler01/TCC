import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type MetricCardProps = {
  change: string;
  title: string;
  value: string;
};

export function MetricCard({ change, title, value }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.change}>{change}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    height: 96,
    justifyContent: 'center',
    paddingHorizontal: 11,
  },
  title: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 11,
  },
  change: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '500',
    marginTop: 10,
  },
});
