import { FirebaseError } from 'firebase/app';
import { isValidCnpj } from '@/domain/utils/cnpj';
import { buildClientAuthEmail } from '@/domain/utils/clientAuthIdentity';

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'CNPJ_NOT_SUPPORTED'
  | 'EMAIL_ALREADY_IN_USE'
  | 'WEAK_PASSWORD'
  | 'UNKNOWN';

export class AuthError extends Error {
  constructor(
    message: string,
    readonly code: AuthErrorCode,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function resolveAuthEmail(identifier: string): string {
  const trimmed = identifier.trim();

  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }

  if (!isValidCnpj(trimmed)) {
    throw new AuthError('Introduza um CNPJ ou e-mail válido.', 'UNKNOWN');
  }

  return buildClientAuthEmail(trimmed);
}

export function mapFirebaseAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  const code = (error as FirebaseError)?.code;

  switch (code) {
    case 'auth/email-already-in-use':
      return new AuthError('Este e-mail já está registado.', 'EMAIL_ALREADY_IN_USE');
    case 'auth/weak-password':
      return new AuthError('A palavra-passe é demasiado fraca.', 'WEAK_PASSWORD');
    case 'auth/invalid-email':
      return new AuthError('E-mail inválido.', 'UNKNOWN');
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return new AuthError(
        'Credenciais inválidas. Verifique o CNPJ ou o e-mail e a palavra-passe.',
        'INVALID_CREDENTIALS',
      );
    default:
      return new AuthError(
        'Ocorreu um erro na autenticação. Tente novamente.',
        'UNKNOWN',
      );
  }
}
