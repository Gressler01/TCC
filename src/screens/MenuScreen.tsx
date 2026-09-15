import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '../components/BottomNavigation';
import { colors } from '../constants/colors';

export function MenuScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.description}>Outras funcionalidades serão reunidas aqui.</Text>
      </View>
      <BottomNavigation activeItem="menu" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.dashboardBackground, flex: 1 },
  content: { flex: 1, gap: 10, padding: 24 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700' },
  description: { color: colors.textMuted, fontSize: 13 },
});
