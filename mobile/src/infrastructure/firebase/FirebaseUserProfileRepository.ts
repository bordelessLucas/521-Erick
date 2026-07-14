import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/core/config/firebase';
import { DEMO_CLIENT_CNPJ, FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { isAdminEmail } from '@/infrastructure/firebase/adminAccess';
import { requireFirebaseAuthSession } from './firebaseAuthSession';

export type UserRole = 'client' | 'admin' | 'collaborator';

export interface UserProfile {
  email: string;
  companyName: string;
  clientCnpj: string;
  createdAt: string;
  role?: UserRole;
}

function resolveClientCnpj(rawCnpj: string | undefined): string {
  if (!rawCnpj?.trim()) {
    return DEMO_CLIENT_CNPJ;
  }

  return formatCnpj(normalizeCnpj(rawCnpj));
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const currentUser = await requireFirebaseAuthSession();

  const snapshot = await getDoc(
    doc(getFirestoreDb(), FIRESTORE_COLLECTIONS.users, currentUser.uid),
  );

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as UserProfile;

  return {
    ...data,
    clientCnpj: resolveClientCnpj(data.clientCnpj),
  };
}

export async function getCurrentUserClientCnpj(): Promise<string> {
  const profile = await getCurrentUserProfile();
  return profile?.clientCnpj ?? DEMO_CLIENT_CNPJ;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const currentUser = await requireFirebaseAuthSession();
  const profile = await getCurrentUserProfile();

  if (profile?.role === 'admin' || profile?.role === 'collaborator') {
    return true;
  }

  const email = currentUser.email ?? '';
  if (!isAdminEmail(email)) {
    return false;
  }

  await setDoc(
    doc(getFirestoreDb(), FIRESTORE_COLLECTIONS.users, currentUser.uid),
    {
      email,
      companyName: profile?.companyName ?? 'Administrador',
      clientCnpj: profile?.clientCnpj ?? '',
      createdAt: profile?.createdAt ?? new Date().toISOString(),
      role: 'admin',
    },
    { merge: true },
  );

  return true;
}

export async function resolvePostAuthRoute(): Promise<'Admin' | 'Dashboard'> {
  const isAdmin = await isCurrentUserAdmin();
  return isAdmin ? 'Admin' : 'Dashboard';
}
