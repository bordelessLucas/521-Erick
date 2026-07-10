/**
 * Vínculo idempotente entre pedido externo e pedido Trançatto.
 */
export interface AgentOrderLink {
  id: string;
  externalSystem: string;
  externalOrderId: string;
  orderId: string;
  lastExternalStatus?: string;
  lastSyncedAt: string;
  createdAt: string;
}

export interface UpsertAgentOrderLinkInput {
  externalSystem: string;
  externalOrderId: string;
  orderId: string;
  lastExternalStatus?: string;
}

export interface IAgentOrderLinkRepository {
  findByExternalRef(
    externalSystem: string,
    externalOrderId: string,
  ): Promise<AgentOrderLink | null>;
  upsert(input: UpsertAgentOrderLinkInput): Promise<AgentOrderLink>;
}
