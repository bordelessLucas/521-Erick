import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/core/config/firebase';
import { FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';
import {
  LANDING_CONTENT_DOC_ID,
  type LandingContent,
} from '@/domain/entities/LandingContent';
import type { ILandingContentRepository } from '@/domain/repositories/ILandingContentRepository';
import { mergeLandingContent } from '@/domain/landing/defaultLandingContent';

export class FirebaseLandingContentRepository implements ILandingContentRepository {
  private get docRef() {
    return doc(
      getFirestoreDb(),
      FIRESTORE_COLLECTIONS.landingContent,
      LANDING_CONTENT_DOC_ID,
    );
  }

  async get(): Promise<LandingContent> {
    const snapshot = await getDoc(this.docRef);

    if (!snapshot.exists()) {
      return mergeLandingContent(null);
    }

    return mergeLandingContent(snapshot.data() as Partial<LandingContent>);
  }

  async save(content: LandingContent): Promise<void> {
    const payload: LandingContent = {
      ...content,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(this.docRef, payload, { merge: true });
  }
}
