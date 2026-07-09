import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loginSchema } from '@/domain/schemas/auth.schema';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { AuthError } from '@/infrastructure/auth/auth.utils';
import { container } from '@/infrastructure/di/container';
import { resolvePostAuthRoute } from '@/infrastructure/firebase/FirebaseUserProfileRepository';
import { colors, spacing } from '@/core/theme';
import { TrancattoAuthLayout } from '@/presentation/components/layout/TrancattoAuthLayout';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { useAuth } from '@/presentation/context/AuthContext';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
  const { refreshRole } = useAuth();
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
      await refreshRole();
      await resolvePostAuthRoute();
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
    <TrancattoAuthLayout
      title="Acessar minha conta"
      subtitle="Entre com CNPJ ou e-mail para acompanhar pedidos e produção em tempo real."
    >
      <StatusBar style="dark" />
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
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          onPress={() => void handleSubmit()}
        />

        <Pressable onPress={onNavigateToRegister} accessibilityRole="button">
          <AppText variant="bodySmall" color={colors.muted} style={styles.footer}>
            Ainda não tem conta?{' '}
            <AppText variant="bodySmall" color={colors.pine} style={styles.link}>
              Criar conta
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
