import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { registerSchema } from '@/domain/schemas/auth.schema';
import { formatCnpj } from '@/domain/utils/cnpj';
import { AuthError } from '@/infrastructure/auth/auth.utils';
import { container } from '@/infrastructure/di/container';
import { colors, spacing } from '@/core/theme';
import { TrancattoAuthLayout } from '@/presentation/components/layout/TrancattoAuthLayout';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { useAuth } from '@/presentation/context/AuthContext';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

interface FieldErrors {
  companyName?: string;
  cnpj?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const { refreshRole } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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
      await refreshRole();
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : 'Ocorreu um erro ao criar a conta. Tente novamente.';
      Alert.alert('Erro ao registar', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TrancattoAuthLayout
      title="Criar conta"
      subtitle="Registe a sua empresa para acompanhar pedidos e produção em tempo real."
    >
      <StatusBar style="dark" />
      <View style={styles.form}>
        <Input
          label="Nome da empresa"
          placeholder="Empresa Lda."
          value={companyName}
          onChangeText={setCompanyName}
          error={fieldErrors.companyName}
        />

        <Input
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChangeText={(value) => setCnpj(formatCnpj(value))}
          error={fieldErrors.cnpj}
        />

        <Input
          label="E-mail"
          placeholder="empresa@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
        />

        <Input
          label="Palavra-passe"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
        />

        <Input
          label="Confirmar palavra-passe"
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={fieldErrors.confirmPassword}
        />

        <Button
          title="Criar conta"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          onPress={() => void handleSubmit()}
        />

        <Pressable onPress={onNavigateToLogin} accessibilityRole="button">
          <AppText variant="bodySmall" color={colors.muted} style={styles.footer}>
            Já tem conta?{' '}
            <AppText variant="bodySmall" color={colors.pine} style={styles.link}>
              Entrar
            </AppText>
          </AppText>
        </Pressable>
      </View>
    </TrancattoAuthLayout>
  );
}

const styles = StyleSheet.create({
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
