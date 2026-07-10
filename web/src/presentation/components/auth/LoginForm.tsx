'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ADMIN_DEFAULT_EMAIL,
  ADMIN_DEFAULT_PASSWORD,
} from '@/core/config/firebaseConstants';
import { loginSchema } from '@/domain/schemas/auth.schema';
import { isAdminGateCnpj } from '@/domain/utils/adminGate';
import { formatCnpj, isValidCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { useLogin } from '@/presentation/hooks/useLogin';

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export function LoginForm() {
  const { login, isLoading, error, clearError } = useLogin();
  const [cnpjOrEmail, setCnpjOrEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState(ADMIN_DEFAULT_EMAIL);
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
    clearError();
    const digits = normalizeCnpj(value);
    if (digits.length > 0 && !value.includes('@')) {
      setCnpjOrEmail(formatCnpj(digits));
      return;
    }
    setCnpjOrEmail(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

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
    await login(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        name="identifier"
        label={isEmailLogin ? 'E-mail' : 'CNPJ'}
        placeholder="00.000.000/0000-00"
        autoComplete="username"
        value={cnpjOrEmail}
        onChange={(e) => handleIdentifierChange(e.target.value)}
        error={fieldErrors.identifier}
      />

      {isAdminGate && (
        <>
          <div className="rounded-none border border-[#1b3d2f]/20 bg-[#1b3d2f]/5 px-4 py-3 text-sm text-[#1b3d2f]">
            CNPJ do Erick reconhecido. Informe as credenciais de administrador para acessar o
            painel.
          </div>

          <Input
            name="adminEmail"
            label="E-mail admin"
            type="email"
            autoComplete="username"
            value={adminEmail}
            onChange={(e) => {
              clearError();
              setAdminEmail(e.target.value);
            }}
            error={fieldErrors.identifier}
          />
        </>
      )}

      {showPasswordField && (
        <Input
          name="password"
          type="password"
          label="Palavra-passe"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            clearError();
            setPassword(e.target.value);
          }}
          error={fieldErrors.password}
        />
      )}

      {isClientCnpjLogin && (
        <p className="text-sm text-neutral-500">
          Clientes acessam o portal apenas com o CNPJ para acompanhar a timeline dos pedidos.
        </p>
      )}

      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full !rounded-none !bg-[#1b3d2f] hover:!bg-[#0f2b23] focus-visible:!ring-[#1b3d2f]/30"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Entrar
      </Button>

      {!isAdminGate && (
        <p className="text-center text-sm text-neutral-500">
          Acesso administrativo? Informe o CNPJ do Erick ou digite o e-mail admin.
        </p>
      )}

      <p className="text-center text-sm text-neutral-500">
        Ainda não tem conta?{' '}
        <Link href="/register" className="font-medium hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
