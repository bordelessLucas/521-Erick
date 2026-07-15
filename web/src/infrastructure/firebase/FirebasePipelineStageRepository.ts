import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/core/config/firebase';
import { FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';
import type { PipelineStage } from '@/domain/entities/Order';
import type { IPipelineStageRepository } from '@/domain/repositories/IPipelineStageRepository';

function normalizeStage(id: string, data: Record<string, unknown>): PipelineStage {
  return {
    id,
    label: String(data.label ?? ''),
    shortLabel: String(data.shortLabel ?? ''),
    description: String(data.description ?? ''),
    orderIndex: Number(data.orderIndex ?? 0),
    averageMinutes: Number(data.averageMinutes ?? 0),
  };
}

export class FirebasePipelineStageRepository implements IPipelineStageRepository {
  private get collectionRef() {
    return collection(getFirestoreDb(), FIRESTORE_COLLECTIONS.pipelineStages);
  }

  async getAll(): Promise<PipelineStage[]> {
    const q = query(this.collectionRef, orderBy('orderIndex', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) =>
      normalizeStage(docSnap.id, docSnap.data()),
    );
  }

  async getById(id: string): Promise<PipelineStage | null> {
    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return normalizeStage(docSnap.id, docSnap.data());
  }

  async save(stage: PipelineStage): Promise<void> {
    const { id, ...data } = stage;
    const docRef = doc(this.collectionRef, id);
    await setDoc(docRef, data, { merge: true });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }

  async reorder(stages: { id: string; orderIndex: number }[]): Promise<void> {
    const batch = writeBatch(getFirestoreDb());

    for (const stage of stages) {
      const docRef = doc(this.collectionRef, stage.id);
      batch.update(docRef, { orderIndex: stage.orderIndex });
    }

    await batch.commit();
  }
}
