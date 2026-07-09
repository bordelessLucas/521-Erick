import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuth } from '@/core/config/firebase';

export class AuthSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthSessionError';
  }
}

export function waitForFirebaseAuthSession(maxWaitMs = 8000): Promise<User | null> {
  const auth = getFirebaseAuth();

  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  return new Promise((resolve) => {
    let unsubscribe: (() => void) | undefined;

    const finish = (user: User | null) => {
      clearTimeout(timeoutId);
      unsubscribe?.();
      resolve(user);
    };

    const timeoutId = setTimeout(() => {
      finish(auth.currentUser);
    }, maxWaitMs);

    unsubscribe = onAuthStateChanged(auth, (user) => {
      finish(user);
    });
  });
}

export async function requireFirebaseAuthSession() {
  const user = await waitForFirebaseAuthSession();

  if (!user) {
    throw new AuthSessionError('Sessão não encontrada. Faça login novamente.');
  }

  return user;
}
