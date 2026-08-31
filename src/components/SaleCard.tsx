import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type SaleCardProps = {
  client: string;
  date: string;
  quantity: string;
  value: string;
};

export function SaleCard({ client, date, quantity, value }: SaleCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <View style={styles.iconDot} />
      </View>

      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.client}>
          {client}
        </Text>
        <Text style={styles.secondaryText}>{date}</Text>
      </View>

      <View style={styles.saleValues}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.secondaryText}>{quantity}</Text>
      </View>
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
    height: 88,
    paddingHorizontal: 12,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  iconDot: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  details: {
    flex: 1,
    gap: 10,
    marginLeft: 12,
    minWidth: 0,
  },
  client: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  saleValues: {
    alignItems: 'flex-end',
    gap: 10,
    marginLeft: 8,
  },
  value: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.textMuted,
    fontSize: 9,
  },
});
