'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { loginSchema } from '@/domain/schemas/auth.schema';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { useLogin } from '@/presentation/hooks/useLogin';

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export function LoginForm() {
  const { login, isLoading, error, clearError } = useLogin();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleIdentifierChange = (value: string) => {
    clearError();
    const digits = normalizeCnpj(value);
    if (digits.length > 0 && !value.includes('@')) {
      setIdentifier(formatCnpj(digits));
      return;
    }
    setIdentifier(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

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
    await login(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        name="identifier"
        label="CNPJ ou E-mail"
        placeholder="00.000.000/0000-00 ou empresa@email.com"
        autoComplete="username"
        value={identifier}
        onChange={(e) => handleIdentifierChange(e.target.value)}
        error={fieldErrors.identifier}
      />

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
        variant="secondary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Entrar
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Ainda não tem conta?{' '}
        <Link href="/register" className="font-medium text-primary-800 hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
