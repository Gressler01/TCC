import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import type { NewHarvest } from '../types/harvest';
import { formatDate, maskDate, parseDate, toLocalDateString } from '../utils/dates';
import { parseHarvestQuantity } from '../utils/harvests';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';

type HarvestFormProps = { onSave: (harvest: NewHarvest) => void };

export function HarvestForm({ onSave }: HarvestFormProps) {
  const [date, setDate] = useState(() => formatDate(toLocalDateString(new Date())));
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const submitted = useRef(false);

  function handleSubmit() {
    if (submitted.current) return;
    const parsedDate = parseDate(date);
    const quantityInGrams = parseHarvestQuantity(quantity);

    if (!parsedDate) {
      setError('Informe uma data válida no formato DD/MM/AAAA.');
      return;
    }
    if (parsedDate > toLocalDateString(new Date())) {
      setError('A data da colheita não pode ser futura.');
      return;
    }
    if (quantityInGrams === null) {
      setError('Informe uma quantidade maior que zero, com até três casas decimais. Ex.: 25,4.');
      return;
    }

    submitted.current = true;
    onSave({ date: parsedDate, quantityInGrams, notes: notes.trim() });
  }

  return (
    <View style={styles.form}>
      <Text style={styles.product}>Colheita de morangos</Text>
      <FormField
        label="Data da colheita"
        accessibilityLabel="Data da colheita"
        placeholder="DD/MM/AAAA"
        keyboardType="number-pad"
        value={date}
        onChangeText={(value) => setDate(maskDate(value))}
        maxLength={10}
      />
      <FormField
        label="Quantidade colhida (kg)"
        accessibilityLabel="Quantidade colhida em kg"
        placeholder="Ex.: 25,4"
        keyboardType="decimal-pad"
        value={quantity}
        onChangeText={setQuantity}
        maxLength={12}
      />
      <FormField
        label="Observações (opcional)"
        accessibilityLabel="Observações da colheita"
        placeholder="Ex.: Morangos maduros, colheita pela manhã..."
        value={notes}
        onChangeText={setNotes}
        maxLength={300}
        multiline
        textAlignVertical="top"
        style={styles.notes}
      />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <PrimaryButton label="Salvar colheita" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 26, paddingTop: 16 },
  product: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  notes: { height: 96, paddingTop: 14, paddingBottom: 14 },
  error: { color: colors.text, fontSize: 13, lineHeight: 20 },
});
