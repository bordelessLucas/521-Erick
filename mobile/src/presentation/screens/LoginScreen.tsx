import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ADMIN_DEFAULT_EMAIL,
  ADMIN_DEFAULT_PASSWORD,
} from '@/core/config/firebaseConstants';
import { loginSchema } from '@/domain/schemas/auth.schema';
import { isAdminGateCnpj } from '@/domain/utils/adminGate';
import { formatCnpj, isValidCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
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
  const [cnpjOrEmail, setCnpjOrEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState(ADMIN_DEFAULT_EMAIL);
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const isEmailLogin = cnpjOrEmail.includes('@');
  const isAdminGate = !isEmailLogin && isAdminGateCnpj(cnpjOrEmail);
  const isClientCnpjLogin = !isEmailLogin && !isAdminGate && isValidCnpj(cnpjOrEmail);
  const showPasswordField = isEmailLogin || isAdminGate;

  useEffect(() => {
    if (!isAdminGate) {
      return;
    }

    setAdminEmail(ADMIN_DEFAULT_EMAIL);
    setPassword(ADMIN_DEFAULT_PASSWORD);
  }, [isAdminGate]);

  const handleIdentifierChange = (value: string) => {
    const digits = normalizeCnpj(value);
    if (digits.length > 0 && !value.includes('@')) {
      setCnpjOrEmail(formatCnpj(digits));
      return;
    }
    setCnpjOrEmail(value);
  };

  const handleSubmit = async () => {
    const loginPayload = isAdminGate
      ? { identifier: adminEmail.trim(), password }
      : {
          identifier: cnpjOrEmail,
          password: isEmailLogin ? password : undefined,
        };

    const result = loginSchema.safeParse(loginPayload);

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
      subtitle="Clientes entram só com o CNPJ para acompanhar a timeline dos pedidos."
    >
      <StatusBar style="dark" />
      <View style={styles.form}>
        <Input
          label={isEmailLogin ? 'E-mail' : 'CNPJ'}
          placeholder="00.000.000/0000-00"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={isEmailLogin ? 'email-address' : 'number-pad'}
          value={cnpjOrEmail}
          onChangeText={handleIdentifierChange}
          error={fieldErrors.identifier}
        />

        {isAdminGate && (
          <>
            <View style={styles.adminBanner}>
              <AppText variant="bodySmall" color={colors.pine}>
                CNPJ do Erick reconhecido. Informe as credenciais de administrador para acessar o
                painel.
              </AppText>
            </View>

            <Input
              label="E-mail admin"
              autoCapitalize="none"
              keyboardType="email-address"
              value={adminEmail}
              onChangeText={setAdminEmail}
              error={fieldErrors.identifier}
            />
          </>
        )}

        {showPasswordField && (
          <Input
            label="Palavra-passe"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
          />
        )}

        {isClientCnpjLogin && (
          <AppText variant="bodySmall" color={colors.muted}>
            Clientes acessam o app apenas com o CNPJ para acompanhar a timeline dos pedidos.
          </AppText>
        )}

        <Button
          title="Entrar"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          onPress={() => void handleSubmit()}
        />

        {!isAdminGate && (
          <AppText variant="bodySmall" color={colors.muted} style={styles.footer}>
            Acesso administrativo? Informe o CNPJ do Erick ou digite o e-mail admin.
          </AppText>
        )}

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
  adminBanner: {
    borderWidth: 1,
    borderColor: 'rgba(27, 61, 47, 0.2)',
    backgroundColor: 'rgba(27, 61, 47, 0.05)',
    padding: spacing.sm + 4,
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  link: {
    fontWeight: '600',
  },
});
