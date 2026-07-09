import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/core/config/firebase';
import { FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';
import { resolveInitialUserRole } from '@/infrastructure/firebase/adminAccess';
import { User } from '@/domain/entities/User';
import {
  IAuthRepository,
  SignInCredentials,
  SignUpCredentials,
} from '@/domain/repositories/IAuthRepository';
import {
  mapFirebaseAuthError,
  resolveAuthEmail,
} from '@/infrastructure/auth/auth.utils';

function mapFirebaseUser(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
  metadata: { creationTime?: string };
}): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    displayName: firebaseUser.displayName,
    createdAt: new Date(firebaseUser.metadata.creationTime ?? Date.now()),
  };
}

export class FirebaseAuthRepository implements IAuthRepository {
  async signIn(credentials: SignInCredentials): Promise<User> {
    try {
      const email = resolveAuthEmail(credentials.identifier);
      const { user } = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        credentials.password,
      );
      return mapFirebaseUser(user);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        credentials.email,
        credentials.password,
      );

      await updateProfile(user, { displayName: credentials.companyName });

      await setDoc(doc(getFirestoreDb(), FIRESTORE_COLLECTIONS.users, user.uid), {
        email: credentials.email,
        companyName: credentials.companyName,
        clientCnpj: credentials.cnpj,
        createdAt: new Date().toISOString(),
        role: resolveInitialUserRole(credentials.email),
      });

      return mapFirebaseUser({
        ...user,
        displayName: credentials.companyName,
      });
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(getFirebaseAuth());
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
        unsubscribe();
        resolve(user ? mapFirebaseUser(user) : null);
      });
    });
  }
}
