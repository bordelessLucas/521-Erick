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
import { registerSchema } from '@/domain/schemas/auth.schema';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { AuthError } from '@/infrastructure/auth/auth.utils';
import { container } from '@/infrastructure/di/container';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { colors, spacing, borderRadius } from '@/core/theme';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

interface FieldErrors {
  companyName?: string;
  cnpj?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }: RegisterScreenProps) {
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCnpjChange = (value: string) => {
    setCnpj(formatCnpj(normalizeCnpj(value)));
  };

  const handleSubmit = async () => {
    const result = registerSchema.safeParse({
      companyName,
      cnpj,
      email,
      password,
      confirmPassword,
    });

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
      await container.getAuthService().register(result.data);
      onRegisterSuccess();
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : 'Ocorreu um erro ao criar a conta. Tente novamente.';
      Alert.alert('Erro ao criar conta', message);
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
              Criar conta
            </AppText>
            <AppText variant="bodySmall" color={colors.text.secondary} style={styles.subtitle}>
              Registe a sua empresa para aceder ao portal B2B.
            </AppText>

            <View style={styles.form}>
              <Input
                label="Nome da empresa"
                placeholder="Cordas Industriais Lda."
                autoCapitalize="words"
                value={companyName}
                onChangeText={(value) => {
                  setCompanyName(value);
                  setFieldErrors((prev) => ({ ...prev, companyName: undefined }));
                }}
                error={fieldErrors.companyName}
              />

              <Input
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                keyboardType="numeric"
                value={cnpj}
                onChangeText={handleCnpjChange}
                error={fieldErrors.cnpj}
              />

              <Input
                label="E-mail corporativo"
                placeholder="empresa@email.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                error={fieldErrors.email}
              />

              <Input
                label="Palavra-passe"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={fieldErrors.password}
              />

              <Input
                label="Confirmar palavra-passe"
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                error={fieldErrors.confirmPassword}
              />

              <Button
                title="Criar conta"
                variant="secondary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
              />

              <Pressable
                onPress={onNavigateToLogin}
                accessibilityRole="button"
                accessibilityLabel="Já tem conta? Iniciar sessão"
              >
                <AppText variant="bodySmall" color={colors.text.secondary} style={styles.footer}>
                  Já tem conta?{' '}
                  <AppText variant="bodySmall" color={colors.primary.DEFAULT} style={styles.link}>
                    Iniciar sessão
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
