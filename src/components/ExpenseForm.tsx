import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { NewExpense } from '../types/expense';
import { parseExpenseAmount, parseExpenseDate } from '../utils/expenses';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';

type ExpenseFormProps = { onSave: (expense: NewExpense) => void };

export function ExpenseForm({ onSave }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  });
  const [error, setError] = useState('');

  function handleSubmit() {
    const amountInCents = parseExpenseAmount(amount);
    const parsedDate = parseExpenseDate(date);
    if (!description.trim()) {
      setError('Informe a descrição do gasto.');
      return;
    }
    if (amountInCents === null) {
      setError('Informe um valor maior que zero, como 150,00 ou 1.200,50.');
      return;
    }
    if (!parsedDate) {
      setError('Informe uma data válida no formato DD/MM/AAAA.');
      return;
    }
    onSave({ description: description.trim(), date: parsedDate, amountInCents });
  }

  return (
    <View style={styles.form}>
      <FormField
        accessibilityLabel="Descrição do gasto"
        label="Descrição do gasto"
        placeholder="Ex.: Fertilizantes"
        value={description}
        onChangeText={setDescription}
        maxLength={100}
        autoCapitalize="sentences"
      />
      <FormField
        accessibilityLabel="Valor do gasto em reais"
        label="Valor (R$)"
        placeholder="Ex.: 150,00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        maxLength={16}
      />
      <FormField
        accessibilityLabel="Data do gasto, dia, mês e ano"
        label="Data do gasto"
        placeholder="DD/MM/AAAA"
        keyboardType="number-pad"
        value={date}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, '').slice(0, 8);
          setDate(digits.replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2'));
        }}
        maxLength={10}
      />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <PrimaryButton label="Salvar gasto" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 26, paddingTop: 22 },
  error: { color: colors.text, fontSize: 13, lineHeight: 20 },
});
