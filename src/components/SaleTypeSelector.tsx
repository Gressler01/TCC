import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

export type SaleType = 'tray' | 'kilogram';

type SaleTypeSelectorProps = {
  onChange: (value: SaleType) => void;
  value: SaleType;
};

const options: { label: string; value: SaleType }[] = [
  { label: 'Bandeja', value: 'tray' },
  { label: 'Quilograma (kg)', value: 'kilogram' },
];

export function SaleTypeSelector({ onChange, value }: SaleTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Forma de venda</Text>

      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              key={option.value}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected ? <View style={styles.radioCenter} /> : null}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    paddingHorizontal: 12,
  },
  optionSelected: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },
  optionPressed: {
    opacity: 0.75,
  },
  radio: {
    alignItems: 'center',
    borderColor: colors.textMuted,
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioCenter: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
