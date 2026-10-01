import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { SaleType, SaleTypeSelector } from '../components/SaleTypeSelector';
import { colors } from '../constants/colors';
import { createSale, updateSale } from '../services/records';
import type { Sale } from '../types/sale';
import { formatDate, parseDate, maskDate, toLocalDateString } from '../utils/dates';

type NewSaleScreenProps = {
  initialValue?: Sale;
  onSaved?: (sale: Sale) => void;
  onBack: () => void;
  onGoHome: () => void;
};

export function NewSaleScreen({ onBack, onGoHome, initialValue, onSaved }: NewSaleScreenProps) {
  const [client, setClient] = useState(initialValue?.client ?? '');
  const [saleType, setSaleType] = useState<SaleType>(initialValue?.saleType ?? 'tray');
  const [quantity, setQuantity] = useState(initialValue ? String(initialValue.quantity).replace('.', ',') : '');
  const [totalValue, setTotalValue] = useState(initialValue ? (initialValue.totalInCents / 100).toFixed(2).replace('.', ',') : '');
  const [date, setDate] = useState(() => formatDate(initialValue?.date ?? toLocalDateString(new Date())));
  const [saving, setSaving] = useState(false);
  const submitted = useRef(false);
  const [error, setError] = useState('');

  const quantityLabel = saleType === 'tray' ? 'Quantidade de bandejas' : 'Quantidade vendida (kg)';
  const quantityPlaceholder = saleType === 'tray' ? 'Ex.: 20' : 'Ex.: 12,5';

  function handleSaleTypeChange(value: SaleType) {
    setSaleType(value);
    setQuantity('');
  }

  async function handleSubmit() {
    if (submitted.current) return;
    const parsedDate = parseDate(date);
    if (!parsedDate || parsedDate > toLocalDateString(new Date())) {
      setError('Informe uma data válida que não seja futura.');
      return;
    }
    if (!client.trim() || !quantity.trim() || !totalValue.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha cliente, quantidade e valor da venda.');
      return;
    }

    const normalizedQuantity = quantity.trim().replace(',', '.');
    const validQuantity = saleType === 'tray'
      ? /^\d+$/.test(normalizedQuantity)
      : /^\d+(?:\.\d{1,3})?$/.test(normalizedQuantity);
    const parsedQuantity = Number(normalizedQuantity);
    const normalizedValue = totalValue.trim().replace(/^R\$\s?/, '');
    const validValue = /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(normalizedValue);
    const [whole, fraction = ''] = normalizedValue.replace(/\./g, '').split(',');
    const totalInCents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
    if (client.trim().length > 120) {
      Alert.alert('Cliente inválido', 'Informe um nome de cliente com até 120 caracteres.');
      return;
    }
    if (!validQuantity || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0 || parsedQuantity > 999999999.999) {
      Alert.alert('Quantidade inválida', saleType === 'tray'
        ? 'Informe um número inteiro de bandejas maior que zero.'
        : 'Informe uma quantidade em kg maior que zero, com até três casas decimais.');
      return;
    }
    if (!validValue || !Number.isSafeInteger(totalInCents) || totalInCents <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor de venda maior que zero.');
      return;
    }

    submitted.current = true;
    setSaving(true);
    setError('');
    try {
      const values = {
        client: client.trim(),
        date: parsedDate,
        saleType,
        quantity: parsedQuantity,
        totalInCents,
      };
      const record = initialValue ? await updateSale(initialValue.id, values) : await createSale(values);
      if (onSaved) onSaved(record);
      else onBack();
    } catch {
      setError('Não foi possível salvar a venda. Tente novamente.');
    } finally {
      submitted.current = false;
      setSaving(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              hitSlop={12}
              disabled={saving} onPress={onBack}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <Text style={styles.title}>{initialValue ? 'Editar venda' : 'Nova venda'}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.form}>
            <FormField
              autoCapitalize="words"
              label="Cliente"
              onChangeText={setClient}
              placeholder="Digite o nome do cliente"
              returnKeyType="next"
              value={client}
            />

            <FormField label="Data da venda" value={date} onChangeText={(value) => setDate(maskDate(value))}
              keyboardType="number-pad" placeholder="DD/MM/AAAA" maxLength={10} />
            <SaleTypeSelector onChange={handleSaleTypeChange} value={saleType} />

            <FormField
              keyboardType={saleType === 'tray' ? 'number-pad' : 'decimal-pad'}
              label={quantityLabel}
              onChangeText={setQuantity}
              placeholder={quantityPlaceholder}
              returnKeyType="next"
              value={quantity}
            />

            <FormField
              keyboardType="decimal-pad"
              label="Valor total da venda"
              onChangeText={setTotalValue}
              onSubmitEditing={handleSubmit}
              placeholder="R$ 0,00"
              returnKeyType="done"
              value={totalValue}
            />

            {error ? <Text accessibilityRole="alert" style={{ color: colors.text }}>{error}</Text> : null}
            <View style={styles.submitButton}>
              <PrimaryButton disabled={saving} label={saving ? 'Salvando...' : initialValue ? 'Salvar alterações' : 'Salvar venda'} onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {!initialValue && <BottomNavigation activeItem="sales" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.dashboardBackground,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-between',
  },
  backIcon: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 38,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 14,
  },
  form: {
    gap: 26,
    paddingTop: 22,
  },
  submitButton: {
    marginTop: 8,
  },
  pressed: {
    opacity: 0.6,
  },
});
