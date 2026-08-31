import { useState } from 'react';
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

type NewSaleScreenProps = {
  onBack: () => void;
  onGoHome: () => void;
};

export function NewSaleScreen({ onBack, onGoHome }: NewSaleScreenProps) {
  const [client, setClient] = useState('');
  const [saleType, setSaleType] = useState<SaleType>('tray');
  const [quantity, setQuantity] = useState('');
  const [totalValue, setTotalValue] = useState('');

  const quantityLabel = saleType === 'tray' ? 'Quantidade de bandejas' : 'Quantidade vendida (kg)';
  const quantityPlaceholder = saleType === 'tray' ? 'Ex.: 20' : 'Ex.: 12,5';

  function handleSaleTypeChange(value: SaleType) {
    setSaleType(value);
    setQuantity('');
  }

  function handleSubmit() {
    if (!client.trim() || !quantity.trim() || !totalValue.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha cliente, quantidade e valor da venda.');
      return;
    }

    Alert.alert('Venda registrada', 'Os dados foram salvos apenas como demonstração.', [
      { text: 'OK', onPress: onBack },
    ]);
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
              onPress={onBack}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <Text style={styles.title}>Nova venda</Text>
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

            <View style={styles.submitButton}>
              <PrimaryButton label="Salvar venda" onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNavigation
        activeItem="sales"
        onNavigate={(item) => item === 'home' && onGoHome()}
      />
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
