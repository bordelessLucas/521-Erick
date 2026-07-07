import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/core/config/firebase';
import { DEMO_CLIENT_CNPJ, FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';

export interface UserProfile {
  email: string;
  companyName: string;
  clientCnpj: string;
  createdAt: string;
}

function waitForAuthUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const currentUser = getFirebaseAuth().currentUser ?? (await waitForAuthUser());

  if (!currentUser) {
    return null;
  }

  const snapshot = await getDoc(
    doc(getFirestoreDb(), FIRESTORE_COLLECTIONS.users, currentUser.uid),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function getCurrentUserClientCnpj(): Promise<string> {
  const profile = await getCurrentUserProfile();
  return profile?.clientCnpj ?? DEMO_CLIENT_CNPJ;
}
