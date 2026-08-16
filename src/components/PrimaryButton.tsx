import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
};

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    width: '100%',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  label: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
