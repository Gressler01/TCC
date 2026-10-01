import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import type { NewHarvest } from '../types/harvest';
import { formatDate, maskDate, parseDate, toLocalDateString } from '../utils/dates';
import { parseHarvestQuantity } from '../utils/harvests';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';

type HarvestFormProps = { initialValue?: NewHarvest; onSave: (harvest: NewHarvest) => Promise<void> };

export function HarvestForm({ onSave, initialValue }: HarvestFormProps) {
  const [date, setDate] = useState(() => formatDate(initialValue?.date ?? toLocalDateString(new Date())));
  const [quantity, setQuantity] = useState(initialValue ? String(initialValue.quantityInGrams / 1000).replace('.', ',') : '');
  const [notes, setNotes] = useState(initialValue?.notes ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submitted = useRef(false);

  async function handleSubmit() {
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
    setSaving(true);
    try {
      setError('');
      await onSave({ date: parsedDate, quantityInGrams, notes: notes.trim() });
    } catch {
      setError('Não foi possível salvar a colheita. Tente novamente.');
    } finally {
      submitted.current = false;
      setSaving(false);
    }
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
      <PrimaryButton disabled={saving} label={saving ? 'Salvando...' : initialValue ? 'Salvar alterações' : 'Salvar colheita'} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 26, paddingTop: 16 },
  product: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  notes: { height: 96, paddingTop: 14, paddingBottom: 14 },
  error: { color: colors.text, fontSize: 13, lineHeight: 20 },
});
