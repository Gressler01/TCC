import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type QuickActionProps = {
  label: string;
  onPress?: () => void;
};

export function QuickAction({ label, onPress }: QuickActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.indicator} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    height: 78,
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 11,
    width: 11,
  },
  label: {
    color: colors.text,
    fontSize: 9,
    fontWeight: '500',
    marginTop: 13,
  },
  pressed: {
    opacity: 0.7,
  },
});
