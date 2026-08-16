import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/colors';

type WelcomeScreenProps = {
  onLogin?: () => void;
  onStart?: () => void;
};

export function WelcomeScreen({ onLogin, onStart }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.introduction}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandInitial}>B</Text>
          </View>

          <Text style={styles.brandName}>Granja Bonini</Text>
          <Text style={styles.brandSubtitle}>Sistema Mobile de auxílio à Gestão da Produção e Vendas</Text>

          <Text style={styles.description}>
            Organize sua produção.{`\n`}Acompanhe seus resultados!
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Começar" onPress={onStart} />

          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={onLogin}
            style={({ pressed }) => pressed && styles.loginPressed}
          >
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  introduction: {
    alignItems: 'center',
    paddingTop: 142,
  },
  brandIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  brandInitial: {
    color: colors.white,
    fontSize: 46,
    fontWeight: '700',
    lineHeight: 56,
  },
  brandName: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 46,
    marginTop: 20,
  },
  brandSubtitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 42,
    textAlign: 'center',
  },
  actions: {
    alignItems: 'center',
    gap: 22,
    marginTop: 'auto',
    paddingBottom: 52,
  },
  loginPressed: {
    opacity: 0.6,
  },
  loginText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
  },
});
