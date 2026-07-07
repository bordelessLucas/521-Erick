'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterInput } from '@/domain/schemas/auth.schema';

interface UseRegisterReturn {
  register: (input: RegisterInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (input: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const { container } = await import('@/infrastructure/di/container');
      const { AuthError } = await import('@/infrastructure/auth/auth.utils');
      await container.getAuthService().register(input);
      router.push('/dashboard');
    } catch (err) {
      const { AuthError } = await import('@/infrastructure/auth/auth.utils');
      if (err instanceof AuthError) {
        setError(err.message);
        return;
      }
      setError('Ocorreu um erro ao criar a conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
