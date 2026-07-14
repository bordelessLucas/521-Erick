import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where, deleteDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import type {
  ICollaboratorRepository,
  CollaboratorSummary,
  ProvisionCollaboratorInput,
} from '@/domain/repositories/ICollaboratorRepository';
import { getFirestoreDb } from '@/core/config/firebase';
import { FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';
import { getProvisioningFirebaseApp } from './firebaseProvisioningApp';
import { isCurrentUserAdmin } from './FirebaseUserProfileRepository';
import { requireFirebaseAuthSession } from './firebaseAuthSession';

export class CollaboratorProvisioningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CollaboratorProvisioningError';
  }
}

export class FirebaseCollaboratorRepository implements ICollaboratorRepository {
  async getAll(): Promise<CollaboratorSummary[]> {
    await requireFirebaseAuthSession();

    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new CollaboratorProvisioningError('Sem permissão para consultar colaboradores.');
    }

    try {
      const q = query(
        collection(getFirestoreDb(), FIRESTORE_COLLECTIONS.users),
        where('role', '==', 'collaborator'),
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          name: data.companyName || data.name || '',
          createdAt: data.createdAt,
        };
      });
    } catch (error) {
      throw new CollaboratorProvisioningError('Erro ao consultar colaboradores.');
    }
  }

  async provisionCollaborator(input: ProvisionCollaboratorInput): Promise<void> {
    await requireFirebaseAuthSession();

    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new CollaboratorProvisioningError('Sem permissão para criar colaboradores.');
    }

    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    // Default password if not provided
    const password = input.password || Math.random().toString(36).slice(-8) + 'A1!';

    const provisioningApp = getProvisioningFirebaseApp();
    const auth = getAuth(provisioningApp);
    const db = getFirestoreDb();

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, FIRESTORE_COLLECTIONS.users, user.uid), {
        email,
        companyName: name, // Using companyName field to store name for consistency with profile
        clientCnpj: '', // No CNPJ for internal collaborators
        createdAt: new Date().toISOString(),
        role: 'collaborator',
        loginMethod: 'email',
      });

      await signOut(auth);
    } catch (error) {
      await signOut(auth).catch(() => undefined);

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          throw new CollaboratorProvisioningError('Este e-mail já está sendo usado por outra conta.');
        }
        if (error.code === 'auth/invalid-email') {
          throw new CollaboratorProvisioningError('E-mail inválido.');
        }
        if (error.code === 'auth/weak-password') {
          throw new CollaboratorProvisioningError('A senha é muito fraca.');
        }
      }

      throw new CollaboratorProvisioningError('Não foi possível criar o colaborador.');
    }
  }

  async deleteCollaborator(id: string): Promise<void> {
    await requireFirebaseAuthSession();

    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new CollaboratorProvisioningError('Sem permissão para excluir colaboradores.');
    }

    try {
      // Delete the Firestore document. Note: This does not delete the Firebase Auth user.
      // To delete the Firebase Auth user, a backend function (Admin SDK) is required.
      // For now, removing them from Firestore revokes their role and data access.
      await deleteDoc(doc(getFirestoreDb(), FIRESTORE_COLLECTIONS.users, id));
    } catch (error) {
      throw new CollaboratorProvisioningError('Erro ao excluir colaborador.');
    }
  }
}
