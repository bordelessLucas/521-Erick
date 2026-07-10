import type { OrderStatus } from '@/domain/entities/Order';

/**
 * Capacidades do agente/funcionário do sistema Trançatto.
 * Tudo que o produto já faz (e o que vier) deve ser registrado aqui
 * para o agente ter autonomia operacional.
 */
export enum AgentCapability {
  CREATE_ORDER = 'CREATE_ORDER',
  UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS',
  PROVISION_CLIENT = 'PROVISION_CLIENT',
  LOOKUP_CLIENT = 'LOOKUP_CLIENT',
  LIST_ORDERS = 'LIST_ORDERS',
  GET_ORDER = 'GET_ORDER',
  /** Reservado: sincronizar catálogo/cores quando existir no domínio */
  SYNC_CATALOG = 'SYNC_CATALOG',
  /** Reservado: notificações WhatsApp/e-mail */
  NOTIFY_STAKEHOLDER = 'NOTIFY_STAKEHOLDER',
}

export const ACTIVE_AGENT_CAPABILITIES: readonly AgentCapability[] = [
  AgentCapability.CREATE_ORDER,
  AgentCapability.UPDATE_ORDER_STATUS,
  AgentCapability.PROVISION_CLIENT,
  AgentCapability.LOOKUP_CLIENT,
  AgentCapability.LIST_ORDERS,
  AgentCapability.GET_ORDER,
] as const;

export const FUTURE_AGENT_CAPABILITIES: readonly AgentCapability[] = [
  AgentCapability.SYNC_CATALOG,
  AgentCapability.NOTIFY_STAKEHOLDER,
] as const;

export type AgentAction =
  | {
      type: AgentCapability.CREATE_ORDER;
      clientCnpj: string;
      companyName?: string;
      orderDate: string;
      estimatedValue: number;
      weightInKg: number;
      status: OrderStatus;
      externalOrderId: string;
      externalSystem: string;
    }
  | {
      type: AgentCapability.UPDATE_ORDER_STATUS;
      orderId?: string;
      externalOrderId?: string;
      externalSystem?: string;
      status: OrderStatus;
    }
  | {
      type: AgentCapability.PROVISION_CLIENT;
      clientCnpj: string;
      companyName?: string;
    }
  | {
      type: AgentCapability.LOOKUP_CLIENT;
      clientCnpj: string;
    }
  | {
      type: AgentCapability.LIST_ORDERS;
    }
  | {
      type: AgentCapability.GET_ORDER;
      orderId?: string;
      externalOrderId?: string;
      externalSystem?: string;
    };

export interface AgentActionResult {
  capability: AgentCapability;
  success: boolean;
  message: string;
  orderId?: string;
  data?: unknown;
}
