import type { UserRole } from '@/infrastructure/firebase/FirebaseUserProfileRepository';

export function resolveAdminAllowlist(): string[] {
  return (process.env.EXPO_PUBLIC_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email: string) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function resolveInitialUserRole(email: string): UserRole {
  const normalizedEmail = email.trim().toLowerCase();

  if (resolveAdminAllowlist().includes(normalizedEmail)) {
    return 'admin';
  }

  return 'client';
}

export function isAdminEmail(email: string): boolean {
  return resolveAdminAllowlist().includes(email.trim().toLowerCase());
}
