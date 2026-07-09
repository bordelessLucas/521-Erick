import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import type { ClientAccessCredentials, ClientSummary } from '@/domain/entities/Client';
import type {
  IClientRepository,
  ProvisionClientInput,
} from '@/domain/repositories/IClientRepository';
import { generateClientPassword } from '@/domain/utils/password';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
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
    const provisioningApp = getProvisioningFirebaseApp();
    const db = getFirestore(provisioningApp);

    const snapshot = await getDocs(
      query(
        collection(db, FIRESTORE_COLLECTIONS.users),
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
  }

  async provisionClient(input: ProvisionClientInput): Promise<ClientAccessCredentials> {
    await requireFirebaseAuthSession();

    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new ClientProvisioningError('Sem permissão para criar acesso de cliente.');
    }

    const normalizedCnpj = normalizeClientCnpj(input.clientCnpj);
    const email = input.clientEmail.trim().toLowerCase();
    const companyName = input.companyName.trim();
    const password = generateClientPassword();

    const existingClient = await this.findByCnpj(normalizedCnpj);
    if (existingClient) {
      throw new ClientProvisioningError('Já existe um cliente com este CNPJ.');
    }

    const provisioningApp = getProvisioningFirebaseApp();
    const auth = getAuth(provisioningApp);
    const db = getFirestore(provisioningApp);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(user, { displayName: companyName });

      await setDoc(doc(db, FIRESTORE_COLLECTIONS.users, user.uid), {
        email,
        companyName,
        clientCnpj: normalizedCnpj,
        createdAt: new Date().toISOString(),
        role: 'client',
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

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          throw new ClientProvisioningError('Este e-mail já está em uso por outra conta.');
        }

        if (error.code === 'auth/invalid-email') {
          throw new ClientProvisioningError('Informe um e-mail válido para o cliente.');
        }
      }

      throw new ClientProvisioningError('Não foi possível criar o acesso do cliente.');
    }
  }
}
