import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '../constants/colors';

type FormFieldProps = TextInputProps & {
  label: string;
};

export function FormField({ label, style, ...inputProps }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...inputProps}
      />
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
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: colors.text,
    fontSize: 13,
    height: 52,
    paddingHorizontal: 13,
  },
});
