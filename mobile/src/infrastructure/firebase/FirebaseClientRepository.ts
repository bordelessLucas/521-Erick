import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import type { ClientAccessCredentials, ClientSummary } from '@/domain/entities/Client';
import type {
  IClientRepository,
  ProvisionClientInput,
} from '@/domain/repositories/IClientRepository';
import {
  buildClientAuthEmail,
  buildClientAuthPassword,
  buildDefaultCompanyName,
} from '@/domain/utils/clientAuthIdentity';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { getFirestoreDb } from '@/core/config/firebase';
import { FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';
import { getProvisioningFirebaseApp } from './firebaseProvisioningApp';
import { isCurrentUserAdmin } from './FirebaseUserProfileRepository';
import { requireFirebaseAuthSession } from './firebaseAuthSession';

function normalizeClientCnpj(clientCnpj: string): string {
  return formatCnpj(normalizeCnpj(clientCnpj));
}

export class ClientProvisioningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientProvisioningError';
  }
}

export class FirebaseClientRepository implements IClientRepository {
  async findByCnpj(clientCnpj: string): Promise<ClientSummary | null> {
    await requireFirebaseAuthSession();

    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new ClientProvisioningError('Sem permissão para consultar clientes.');
    }

    const normalizedCnpj = normalizeClientCnpj(clientCnpj);

    try {
      const snapshot = await getDocs(
        query(
          collection(getFirestoreDb(), FIRESTORE_COLLECTIONS.users),
          where('clientCnpj', '==', normalizedCnpj),
        ),
      );

      const document = snapshot.docs[0];
      if (!document) {
        return null;
      }

      const data = document.data() as {
        email: string;
        companyName: string;
        clientCnpj: string;
        role?: string;
      };

      if (data.role === 'admin') {
        return null;
      }

      return {
        email: data.email,
        companyName: data.companyName,
        clientCnpj: data.clientCnpj,
      };
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'permission-denied') {
        throw new ClientProvisioningError(
          'Sem permissão para consultar clientes. Confirme se sua conta tem role admin no Firestore.',
        );
      }

      throw new ClientProvisioningError('Não foi possível consultar o cliente pelo CNPJ.');
    }
  }

  async provisionClient(input: ProvisionClientInput): Promise<ClientAccessCredentials> {
    await requireFirebaseAuthSession();

    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new ClientProvisioningError('Sem permissão para criar acesso de cliente.');
    }

    const normalizedCnpj = normalizeClientCnpj(input.clientCnpj);
    const email = input.clientEmail?.trim().toLowerCase() || buildClientAuthEmail(normalizedCnpj);
    const companyName = input.companyName?.trim() || buildDefaultCompanyName(normalizedCnpj);
    const password = buildClientAuthPassword(normalizedCnpj);

    const existingClient = await this.findByCnpj(normalizedCnpj);
    if (existingClient) {
      throw new ClientProvisioningError('Já existe um cliente com este CNPJ.');
    }

    const provisioningApp = getProvisioningFirebaseApp();
    const auth = getAuth(provisioningApp);
    const db = getFirestoreDb();

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(user, { displayName: companyName });

      await setDoc(doc(db, FIRESTORE_COLLECTIONS.users, user.uid), {
        email,
        companyName,
        clientCnpj: normalizedCnpj,
        createdAt: new Date().toISOString(),
        role: 'client',
        loginMethod: 'cnpj',
      });

      await signOut(auth);

      return {
        email,
        password,
        companyName,
        clientCnpj: normalizedCnpj,
      };
    } catch (error) {
      await signOut(auth).catch(() => undefined);

      if (error instanceof ClientProvisioningError) {
        throw error;
      }

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          throw new ClientProvisioningError(
            'Já existe uma conta vinculada a este CNPJ. Verifique o cadastro do cliente.',
          );
        }

        if (error.code === 'auth/invalid-email') {
          throw new ClientProvisioningError('Não foi possível criar o e-mail de acesso do cliente.');
        }

        if (error.code === 'auth/weak-password') {
          throw new ClientProvisioningError('Não foi possível gerar uma senha válida. Tente novamente.');
        }

        if (error.code === 'permission-denied') {
          throw new ClientProvisioningError(
            'Sem permissão para criar o perfil do cliente. Confirme se sua conta tem role admin.',
          );
        }
      }

      throw new ClientProvisioningError('Não foi possível criar o acesso do cliente.');
    }
  }
}
