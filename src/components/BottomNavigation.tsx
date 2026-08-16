import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';

type NavigationItem = 'home' | 'production' | 'sales' | 'menu';

type BottomNavigationProps = {
  activeItem: NavigationItem;
  onAdd?: () => void;
  onNavigate?: (item: NavigationItem) => void;
};

const items: { key: NavigationItem; label: string }[] = [
  { key: 'home', label: 'Início' },
  { key: 'production', label: 'Produção' },
  { key: 'sales', label: 'Vendas' },
  { key: 'menu', label: 'Menu' },
];

export function BottomNavigation({
  activeItem,
  onAdd,
  onNavigate,
}: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {items.slice(0, 2).map((item) => (
        <NavigationButton
          active={activeItem === item.key}
          key={item.key}
          label={item.label}
          onPress={() => onNavigate?.(item.key)}
        />
      ))}

      <Pressable
        accessibilityLabel="Adicionar registro"
        accessibilityRole="button"
        onPress={onAdd}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <Text style={styles.addLabel}>+</Text>
      </Pressable>

      {items.slice(2).map((item) => (
        <NavigationButton
          active={activeItem === item.key}
          key={item.key}
          label={item.label}
          onPress={() => onNavigate?.(item.key)}
        />
      ))}
    </View>
  );
}

type NavigationButtonProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

function NavigationButton({ active, label, onPress }: NavigationButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.navigationButton}>
      <View style={[styles.navigationDot, active && styles.navigationDotActive]} />
      <Text style={[styles.navigationLabel, active && styles.navigationLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 70,
    paddingTop: 8,
  },
  navigationButton: {
    alignItems: 'center',
    flex: 1,
    gap: 9,
    paddingTop: 4,
  },
  navigationDot: {
    borderColor: colors.textMuted,
    borderRadius: 5,
    borderWidth: 1,
    height: 10,
    width: 10,
  },
  navigationDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  navigationLabel: {
    color: colors.textMuted,
    fontSize: 9,
  },
  navigationLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  addLabel: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 32,
  },
  pressed: {
    opacity: 0.8,
  },
});
