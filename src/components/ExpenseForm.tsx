import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { NewExpense } from '../types/expense';
import { parseExpenseAmount, parseExpenseDate } from '../utils/expenses';
import { formatDate } from '../utils/dates';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';

type ExpenseFormProps = { initialValue?: NewExpense; onSave: (expense: NewExpense) => Promise<void> };

export function ExpenseForm({ onSave, initialValue }: ExpenseFormProps) {
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [amount, setAmount] = useState(initialValue ? (initialValue.amountInCents / 100).toFixed(2).replace('.', ',') : '');
  const [date, setDate] = useState(() => {
    if (initialValue) return formatDate(initialValue.date);
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  });
  const [error, setError] = useState('');

  const submitted = useRef(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (submitted.current) return;
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
    submitted.current = true;
    setSaving(true);
    setError('');
    try {
      await onSave({ description: description.trim(), date: parsedDate, amountInCents });
    } catch {
      setError('Não foi possível salvar o gasto. Tente novamente.');
    } finally {
      submitted.current = false;
      setSaving(false);
    }
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
      <PrimaryButton disabled={saving} label={saving ? 'Salvando...' : initialValue ? 'Salvar alterações' : 'Salvar gasto'} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 26, paddingTop: 22 },
  error: { color: colors.text, fontSize: 13, lineHeight: 20 },
});
