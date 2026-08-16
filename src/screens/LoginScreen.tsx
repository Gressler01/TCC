import { useState } from 'react';
import {
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

import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/colors';

type LoginScreenProps = {
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
  onSubmit?: (email: string, password: string) => void;
};

export function LoginScreen({
  onCreateAccount,
  onForgotPassword,
  onSubmit,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    onSubmit?.(email.trim(), password);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <Text style={styles.brand}>Bonini</Text>

          <View style={styles.heading}>
            <Text style={styles.title}>Bem-vindo(a)!</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>

          <View style={styles.form}>
            <FormField
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              label="E-mail"
              onChangeText={setEmail}
              placeholder="Digite seu e-mail"
              returnKeyType="next"
              value={email}
            />

            <View style={styles.passwordGroup}>
              <FormField
                autoCapitalize="none"
                autoComplete="current-password"
                label="Senha"
                onChangeText={setPassword}
                onSubmitEditing={handleSubmit}
                placeholder="Digite sua senha"
                returnKeyType="done"
                secureTextEntry
                value={password}
              />

              <Pressable
                accessibilityRole="button"
                hitSlop={10}
                onPress={onForgotPassword}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
              </Pressable>
            </View>

            <View style={styles.loginButton}>
              <PrimaryButton label="Entrar" onPress={handleSubmit} />
            </View>

            <Pressable
              accessibilityRole="button"
              hitSlop={10}
              onPress={onCreateAccount}
              style={({ pressed }) => [
                styles.createAccountButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.createAccount}>
                Não tem conta? Fale com Administrador para criar uma.
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  brand: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29,
    marginTop: 4,
  },
  heading: {
    gap: 5,
    marginTop: 104,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 16,
  },
  form: {
    marginTop: 46,
  },
  passwordGroup: {
    gap: 7,
    marginTop: 23,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
  },
  createAccount: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 40,
  },
  createAccountButton: {
    marginTop: 28,
  },
  pressed: {
    opacity: 0.6,
  },
});
