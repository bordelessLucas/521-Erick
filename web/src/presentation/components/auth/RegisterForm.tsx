'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { registerSchema } from '@/domain/schemas/auth.schema';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { useRegister } from '@/presentation/hooks/useRegister';

interface FieldErrors {
  companyName?: string;
  cnpj?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const { register, isLoading, error, clearError } = useRegister();
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleCnpjChange = (value: string) => {
    clearError();
    setCnpj(formatCnpj(normalizeCnpj(value)));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

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
    await register(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        name="companyName"
        label="Nome da empresa"
        placeholder="Cordas Industriais Lda."
        autoComplete="organization"
        value={companyName}
        onChange={(e) => {
          clearError();
          setCompanyName(e.target.value);
        }}
        error={fieldErrors.companyName}
      />

      <Input
        name="cnpj"
        label="CNPJ"
        placeholder="00.000.000/0000-00"
        autoComplete="off"
        value={cnpj}
        onChange={(e) => handleCnpjChange(e.target.value)}
        error={fieldErrors.cnpj}
      />

      <Input
        name="email"
        label="E-mail corporativo"
        placeholder="empresa@email.com"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          clearError();
          setEmail(e.target.value);
        }}
        error={fieldErrors.email}
      />

      <Input
        name="password"
        type="password"
        label="Palavra-passe"
        placeholder="••••••••"
        autoComplete="new-password"
        value={password}
        onChange={(e) => {
          clearError();
          setPassword(e.target.value);
        }}
        error={fieldErrors.password}
      />

      <Input
        name="confirmPassword"
        type="password"
        label="Confirmar palavra-passe"
        placeholder="••••••••"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => {
          clearError();
          setConfirmPassword(e.target.value);
        }}
        error={fieldErrors.confirmPassword}
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
        Criar conta
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Já tem conta?{' '}
        <Link href="/login" className="font-medium text-primary-800 hover:underline">
          Iniciar sessão
        </Link>
      </p>
    </form>
  );
}
