import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';

export type NavigationItem = 'home' | 'harvest' | 'sales' | 'expenses' | 'menu';

type BottomNavigationProps = { activeItem: NavigationItem };

const items: { key: NavigationItem; label: string; path: '/dashboard' | '/harvest' | '/sales' | '/expenses' | '/menu' }[] = [
  { key: 'home', label: 'Início', path: '/dashboard' },
  { key: 'harvest', label: 'Colheita', path: '/harvest' },
  { key: 'sales', label: 'Vendas', path: '/sales' },
  { key: 'expenses', label: 'Custos', path: '/expenses' },
  { key: 'menu', label: 'Menu', path: '/menu' },
];

export function BottomNavigation({ activeItem }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {items.map((item) => {
        const active = activeItem === item.key;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={item.key}
            onPress={() => !active && router.replace(item.path)}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <View style={[styles.dot, active && styles.dotActive]} />
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start', backgroundColor: colors.white, borderTopColor: colors.border,
    borderTopWidth: 1, borderTopLeftRadius: 34, borderTopRightRadius: 34,
    flexDirection: 'row', minHeight: 88, paddingHorizontal: 12, paddingTop: 16,
  },
  button: { alignItems: 'center', flex: 1, gap: 10, minHeight: 48 },
  dot: { borderColor: colors.textMuted, borderRadius: 6, borderWidth: 1.2, height: 12, width: 12 },
  dotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { color: colors.textMuted, fontSize: 11 },
  labelActive: { color: colors.primary, fontWeight: '700' },
  pressed: { opacity: 0.65 },
});
