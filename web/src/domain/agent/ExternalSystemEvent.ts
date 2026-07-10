/**
 * Eventos vindos do sistema/banco externo do Erick.
 * O adapter traduz a fonte real (API, SQL, webhook, etc.) para este contrato.
 */
export type ExternalSystemEventType =
  | 'ORDER_UPSERTED'
  | 'ORDER_STATUS_CHANGED'
  | 'CLIENT_UPSERTED'
  | 'UNKNOWN';

export interface ExternalOrderPayload {
  externalOrderId: string;
  clientCnpj: string;
  companyName?: string;
  orderDate?: string;
  estimatedValue?: number;
  weightInKg?: number;
  /** Status no vocabulário do sistema externo — o agente mapeia para OrderStatus */
  externalStatus?: string;
}

export interface ExternalSystemEvent {
  id: string;
  source: string;
  type: ExternalSystemEventType;
  occurredAt: string;
  payload: ExternalOrderPayload | Record<string, unknown>;
  /** Payload bruto para a IA interpretar quando o mapeamento determinístico falhar */
  raw?: unknown;
}

export interface ExternalSystemSnapshot {
  source: string;
  fetchedAt: string;
  events: ExternalSystemEvent[];
}
