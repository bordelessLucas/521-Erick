import { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loginSchema } from '@/domain/schemas/auth.schema';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { AuthError } from '@/infrastructure/auth/auth.utils';
import { container } from '@/infrastructure/di/container';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { colors, spacing, borderRadius } from '@/core/theme';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export function LoginScreen({ onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleIdentifierChange = (value: string) => {
    const digits = normalizeCnpj(value);
    if (digits.length > 0 && !value.includes('@')) {
      setIdentifier(formatCnpj(digits));
      return;
    }
    setIdentifier(value);
  };

  const handleSubmit = async () => {
    const result = loginSchema.safeParse({ identifier, password });

    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      await container.getAuthService().login(result.data);
      onLoginSuccess();
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : 'Credenciais inválidas ou serviço indisponível. Tente novamente.';
      Alert.alert('Erro ao entrar', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <AppText variant="label" color={colors.primary.DEFAULT} style={styles.brand}>
            Cordas Industriais
          </AppText>

          <View style={styles.card}>
            <AppText variant="h2" style={styles.title}>
              Portal do Cliente
            </AppText>
            <AppText variant="bodySmall" color={colors.text.secondary} style={styles.subtitle}>
              Inicie sessão para acompanhar pedidos e produção em tempo real.
            </AppText>

            <View style={styles.form}>
              <Input
                label="CNPJ ou E-mail"
                placeholder="00.000.000/0000-00 ou empresa@email.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={identifier}
                onChangeText={handleIdentifierChange}
                error={fieldErrors.identifier}
              />

              <Input
                label="Palavra-passe"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                error={fieldErrors.password}
              />

              <Button
                title="Entrar"
                variant="secondary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
              />

              <Pressable
                onPress={onNavigateToRegister}
                accessibilityRole="button"
                accessibilityLabel="Ainda não tem conta? Criar conta"
              >
                <AppText variant="bodySmall" color={colors.text.secondary} style={styles.footer}>
                  Ainda não tem conta?{' '}
                  <AppText variant="bodySmall" color={colors.primary.DEFAULT} style={styles.link}>
                    Criar conta
                  </AppText>
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  brand: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '700',
    fontSize: 18,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    color: colors.primary.DEFAULT,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  link: {
    fontWeight: '600',
  },
});
