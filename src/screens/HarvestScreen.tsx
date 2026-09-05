import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
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
import { HarvestCard } from '../components/HarvestCard';
import { HarvestForm } from '../components/HarvestForm';
import { MonthFilter } from '../components/MonthFilter';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { useHarvests } from '../contexts/HarvestContext';
import type { NewHarvest } from '../types/harvest';
import { formatHarvestQuantity, getMonthlyHarvests } from '../utils/harvests';

type HarvestScreenProps = {
  onGoHome: () => void;
  onSales: () => void;
};

export function HarvestScreen({ onGoHome, onSales }: HarvestScreenProps) {
  const { harvests, period, setPeriod, addHarvest } = useHarvests();
  const [formVisible, setFormVisible] = useState(false);
  const { records, totalInGrams } = getMonthlyHarvests(harvests, period);

  function saveHarvest(harvest: NewHarvest) {
    addHarvest(harvest);
    setFormVisible(false);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar ao início"
          accessibilityRole="button"
          onPress={onGoHome}
          style={styles.headerButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Colheita</Text>
        <View style={styles.headerButton} />
      </View>

      <FlatList
        data={records}
        keyExtractor={(harvest) => harvest.id}
        renderItem={({ item }) => <HarvestCard {...item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <MonthFilter value={period} onChange={setPeriod} />
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total colhido no mês</Text>
              <Text accessibilityLiveRegion="polite" style={styles.totalValue}>
                {formatHarvestQuantity(totalInGrams)}
              </Text>
              <Text style={styles.recordCount}>
                {records.length} {records.length === 1 ? 'colheita registrada' : 'colheitas registradas'}
              </Text>
            </View>
            <PrimaryButton label="+ Nova colheita" onPress={() => setFormVisible(true)} />
            <Text style={styles.sectionTitle}>Colheitas do mês</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma colheita neste mês</Text>
            <Text style={styles.emptyText}>Toque em Nova colheita para registrar.</Text>
          </View>
        }
      />

      <BottomNavigation
        activeItem="harvest"
        onAdd={() => setFormVisible(true)}
        onNavigate={(item) => {
          if (item === 'home') onGoHome();
          if (item === 'sales') onSales();
        }}
      />

      <Modal
        visible={formVisible}
        animationType="slide"
        onRequestClose={() => setFormVisible(false)}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="dark" />
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.header}>
              <Pressable
                accessibilityLabel="Cancelar nova colheita"
                accessibilityRole="button"
                onPress={() => setFormVisible(false)}
                style={styles.headerButton}
              >
                <Text style={styles.backIcon}>‹</Text>
              </Pressable>
              <Text style={styles.title}>Nova colheita</Text>
              <View style={styles.headerButton} />
            </View>
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {formVisible && <HarvestForm onSave={saveHarvest} />}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.dashboardBackground, flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 72,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerButton: { alignItems: 'center', justifyContent: 'center', width: 44, height: 44 },
  backIcon: { color: colors.text, fontSize: 34, lineHeight: 38 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  listHeader: { gap: 24, marginBottom: 14 },
  totalCard: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 20,
    gap: 10,
  },
  totalLabel: { color: colors.text, fontSize: 13 },
  totalValue: { color: colors.primary, fontSize: 28, fontWeight: '700' },
  recordCount: { color: colors.textMuted, fontSize: 12 },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  separator: { height: 14 },
  emptyState: { paddingVertical: 40, gap: 10, alignItems: 'center' },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});
