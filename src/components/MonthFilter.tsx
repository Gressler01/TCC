import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { shiftMonth } from '../utils/dates';

type MonthFilterProps = {
  value: string;
  onChange: (period: string) => void;
};

export function MonthFilter({ value, onChange }: MonthFilterProps) {
  const [year, month] = value.split('-').map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Mês anterior"
        accessibilityRole="button"
        onPress={() => onChange(shiftMonth(value, -1))}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.chevron}>‹</Text>
      </Pressable>
      <Text accessibilityLiveRegion="polite" style={styles.label}>{label}</Text>
      <Pressable
        accessibilityLabel="Próximo mês"
        accessibilityRole="button"
        onPress={() => onChange(shiftMonth(value, 1))}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  chevron: { color: colors.textMuted, fontSize: 24 },
  label: { color: colors.textMuted, fontSize: 12, textTransform: 'capitalize' },
  pressed: { opacity: 0.6 },
});
