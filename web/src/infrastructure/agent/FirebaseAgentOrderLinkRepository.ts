import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { getFirestoreDb } from '@/core/config/firebase';
import type {
  AgentOrderLink,
  IAgentOrderLinkRepository,
  UpsertAgentOrderLinkInput,
} from '@/domain/agent/IAgentOrderLinkRepository';

const COLLECTION = 'agent_order_links';

function buildLinkId(externalSystem: string, externalOrderId: string): string {
  return `${externalSystem}__${externalOrderId}`.replace(/[^\w.-]+/g, '_');
}

export class FirebaseAgentOrderLinkRepository implements IAgentOrderLinkRepository {
  private db() {
    return getFirestoreDb();
  }

  async findByExternalRef(
    externalSystem: string,
    externalOrderId: string,
  ): Promise<AgentOrderLink | null> {
    const snapshot = await getDocs(
      query(
        collection(this.db(), COLLECTION),
        where('externalSystem', '==', externalSystem),
        where('externalOrderId', '==', externalOrderId),
      ),
    );

    const document = snapshot.docs[0];
    if (!document) {
      return null;
    }

    return { id: document.id, ...(document.data() as Omit<AgentOrderLink, 'id'>) };
  }

  async upsert(input: UpsertAgentOrderLinkInput): Promise<AgentOrderLink> {
    const id = buildLinkId(input.externalSystem, input.externalOrderId);
    const existing = await this.findByExternalRef(input.externalSystem, input.externalOrderId);
    const now = new Date().toISOString();

    const link: AgentOrderLink = {
      id,
      externalSystem: input.externalSystem,
      externalOrderId: input.externalOrderId,
      orderId: input.orderId,
      lastExternalStatus: input.lastExternalStatus,
      lastSyncedAt: now,
      createdAt: existing?.createdAt ?? now,
    };

    await setDoc(doc(this.db(), COLLECTION, id), link, { merge: true });
    return link;
  }
}
