import type { Order } from '@/domain/entities/Order';
import { OrderStatus, DefaultOrderStatuses } from '@/domain/entities/Order';
import type { AdminOrderService } from '@/application/orders/AdminOrderService';
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import type { IClientRepository } from '@/domain/repositories/IClientRepository';
import {
  ACTIVE_AGENT_CAPABILITIES,
  AgentCapability,
  type AgentAction,
  type AgentActionResult,
} from '@/domain/agent/AgentCapability';
import type { ExternalSystemEvent } from '@/domain/agent/ExternalSystemEvent';
import type { IAgentInterpreter, IExternalSystemAdapter } from '@/domain/agent/IAgentPorts';
import type { IAgentOrderLinkRepository } from '@/domain/agent/IAgentOrderLinkRepository';

export interface AgentSyncRunResult {
  processedEvents: number;
  actions: AgentActionResult[];
  skipped: string[];
}

/**
 * Agente/funcionário do sistema: observa eventos externos e executa
 * as capacidades ativas no Trançatto com autonomia operacional.
 */
export class SystemAgentService {
  constructor(
    private readonly externalAdapter: IExternalSystemAdapter,
    private readonly interpreter: IAgentInterpreter,
    private readonly orderRepository: IOrderRepository,
    private readonly clientRepository: IClientRepository,
    private readonly adminOrderService: AdminOrderService,
    private readonly linkRepository: IAgentOrderLinkRepository,
  ) {}

  listCapabilities(): readonly AgentCapability[] {
    return ACTIVE_AGENT_CAPABILITIES;
  }

  isReady(): boolean {
    return this.externalAdapter.isConfigured();
  }

  async health() {
    const external = await this.externalAdapter.healthCheck();
    return {
      agent: 'trancatto-system-agent',
      ready: this.isReady(),
      capabilities: this.listCapabilities(),
      external,
    };
  }

  async pullAndSync(sinceIso?: string): Promise<AgentSyncRunResult> {
    if (!this.isReady()) {
      return {
        processedEvents: 0,
        actions: [],
        skipped: ['External system adapter is not configured yet.'],
      };
    }

    const snapshot = await this.externalAdapter.fetchRecentEvents(sinceIso);
    return this.processEvents(snapshot.events);
  }

  async ingestEvent(event: ExternalSystemEvent): Promise<AgentSyncRunResult> {
    return this.processEvents([event]);
  }

  async executeAction(action: AgentAction): Promise<AgentActionResult> {
    switch (action.type) {
      case AgentCapability.CREATE_ORDER:
        return this.createOrder(action);
      case AgentCapability.UPDATE_ORDER_STATUS:
        return this.updateStatus(action);
      case AgentCapability.PROVISION_CLIENT:
        return this.provisionClient(action);
      case AgentCapability.LOOKUP_CLIENT:
        return this.lookupClient(action);
      case AgentCapability.LIST_ORDERS:
        return this.listOrders();
      case AgentCapability.GET_ORDER:
        return this.getOrder(action);
      default: {
        const exhaustive: never = action;
        return {
          capability: (exhaustive as AgentAction).type,
          success: false,
          message: 'Capability not implemented yet.',
        };
      }
    }
  }

  private async processEvents(events: ExternalSystemEvent[]): Promise<AgentSyncRunResult> {
    const actions: AgentActionResult[] = [];
    const skipped: string[] = [];

    for (const event of events) {
      const planned = await this.interpreter.interpret(event);

      if (planned.length === 0) {
        skipped.push(`No actions for event ${event.id} (${event.type})`);
        continue;
      }

      for (const action of planned) {
        actions.push(await this.executeAction(action));
      }
    }

    return {
      processedEvents: events.length,
      actions,
      skipped,
    };
  }

  private async createOrder(
    action: Extract<AgentAction, { type: AgentCapability.CREATE_ORDER }>,
  ): Promise<AgentActionResult> {
    const existingLink = await this.linkRepository.findByExternalRef(
      action.externalSystem,
      action.externalOrderId,
    );

    if (existingLink) {
      const updated = await this.orderRepository.updateStatus(
        existingLink.orderId,
        action.status,
      );
      await this.linkRepository.upsert({
        externalSystem: action.externalSystem,
        externalOrderId: action.externalOrderId,
        orderId: updated.id,
        lastExternalStatus: action.status,
      });

      return {
        capability: AgentCapability.CREATE_ORDER,
        success: true,
        message: 'Pedido externo já vinculado — status atualizado.',
        orderId: updated.id,
        data: updated,
      };
    }

    const result = await this.adminOrderService.createOrderWithClient({
      clientCnpj: action.clientCnpj,
      companyName: action.companyName,
      orderDate: action.orderDate,
      estimatedValue: action.estimatedValue,
      weightInKg: action.weightInKg,
      status: action.status,
    });

    await this.linkRepository.upsert({
      externalSystem: action.externalSystem,
      externalOrderId: action.externalOrderId,
      orderId: result.order.id,
      lastExternalStatus: action.status,
    });

    return {
      capability: AgentCapability.CREATE_ORDER,
      success: true,
      message: result.newClientCredentials
        ? 'Pedido criado e acesso do cliente provisionado.'
        : 'Pedido criado.',
      orderId: result.order.id,
      data: {
        order: result.order,
        newClientCredentials: result.newClientCredentials,
      },
    };
  }

  private async updateStatus(
    action: Extract<AgentAction, { type: AgentCapability.UPDATE_ORDER_STATUS }>,
  ): Promise<AgentActionResult> {
    const orderId = await this.resolveOrderId(action);

    if (!orderId) {
      return {
        capability: AgentCapability.UPDATE_ORDER_STATUS,
        success: false,
        message: 'Pedido não encontrado para atualizar status.',
      };
    }

    const order = await this.orderRepository.updateStatus(orderId, action.status);

    if (action.externalSystem && action.externalOrderId) {
      await this.linkRepository.upsert({
        externalSystem: action.externalSystem,
        externalOrderId: action.externalOrderId,
        orderId: order.id,
        lastExternalStatus: action.status,
      });
    }

    return {
      capability: AgentCapability.UPDATE_ORDER_STATUS,
      success: true,
      message: `Status atualizado para ${action.status}.`,
      orderId: order.id,
      data: order,
    };
  }

  private async provisionClient(
    action: Extract<AgentAction, { type: AgentCapability.PROVISION_CLIENT }>,
  ): Promise<AgentActionResult> {
    const existing = await this.clientRepository.findByCnpj(action.clientCnpj);
    if (existing) {
      return {
        capability: AgentCapability.PROVISION_CLIENT,
        success: true,
        message: 'Cliente já possui acesso.',
        data: existing,
      };
    }

    const credentials = await this.clientRepository.provisionClient({
      clientCnpj: action.clientCnpj,
      companyName: action.companyName,
    });

    return {
      capability: AgentCapability.PROVISION_CLIENT,
      success: true,
      message: 'Acesso do cliente criado.',
      data: { clientCnpj: credentials.clientCnpj, companyName: credentials.companyName },
    };
  }

  private async lookupClient(
    action: Extract<AgentAction, { type: AgentCapability.LOOKUP_CLIENT }>,
  ): Promise<AgentActionResult> {
    const client = await this.clientRepository.findByCnpj(action.clientCnpj);
    return {
      capability: AgentCapability.LOOKUP_CLIENT,
      success: true,
      message: client ? 'Cliente encontrado.' : 'Cliente não cadastrado.',
      data: client,
    };
  }

  private async listOrders(): Promise<AgentActionResult> {
    const orders = await this.orderRepository.getAll();
    return {
      capability: AgentCapability.LIST_ORDERS,
      success: true,
      message: `${orders.length} pedido(s) no quadro.`,
      data: orders,
    };
  }

  private async getOrder(
    action: Extract<AgentAction, { type: AgentCapability.GET_ORDER }>,
  ): Promise<AgentActionResult> {
    const orderId = await this.resolveOrderId(action);
    if (!orderId) {
      return {
        capability: AgentCapability.GET_ORDER,
        success: false,
        message: 'Pedido não encontrado.',
      };
    }

    const order: Order | null = await this.orderRepository.getById(orderId);
    return {
      capability: AgentCapability.GET_ORDER,
      success: Boolean(order),
      message: order ? 'Pedido encontrado.' : 'Pedido não encontrado.',
      orderId: order?.id,
      data: order,
    };
  }

  private async resolveOrderId(input: {
    orderId?: string;
    externalOrderId?: string;
    externalSystem?: string;
  }): Promise<string | null> {
    if (input.orderId) {
      return input.orderId;
    }

    if (input.externalSystem && input.externalOrderId) {
      const link = await this.linkRepository.findByExternalRef(
        input.externalSystem,
        input.externalOrderId,
      );
      return link?.orderId ?? null;
    }

    return null;
  }
}

export function defaultOrderStatus(): OrderStatus {
  return DefaultOrderStatuses.AGUARDANDO_APROVACAO;
}
