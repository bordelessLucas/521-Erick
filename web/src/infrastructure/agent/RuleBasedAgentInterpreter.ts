import type { AgentAction } from '@/domain/agent/AgentCapability';
import { AgentCapability } from '@/domain/agent/AgentCapability';
import type { ExternalOrderPayload, ExternalSystemEvent } from '@/domain/agent/ExternalSystemEvent';
import type { IAgentInterpreter } from '@/domain/agent/IAgentPorts';
import { mapExternalStatusToOrderStatus } from '@/domain/agent/mapExternalStatus';
import { OrderStatus } from '@/domain/entities/Order';

function isOrderPayload(payload: ExternalSystemEvent['payload']): payload is ExternalOrderPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'externalOrderId' in payload &&
    'clientCnpj' in payload
  );
}

/**
 * Intérprete determinístico (placeholder da IA).
 * Quando o LLM entrar, deve continuar emitindo AgentAction[].
 */
export class RuleBasedAgentInterpreter implements IAgentInterpreter {
  async interpret(event: ExternalSystemEvent): Promise<AgentAction[]> {
    if (event.type === 'UNKNOWN' || !isOrderPayload(event.payload)) {
      return [];
    }

    const payload = event.payload;
    const status = mapExternalStatusToOrderStatus(
      payload.externalStatus,
      OrderStatus.AGUARDANDO_APROVACAO,
    );

    if (event.type === 'ORDER_STATUS_CHANGED') {
      return [
        {
          type: AgentCapability.UPDATE_ORDER_STATUS,
          externalSystem: event.source,
          externalOrderId: payload.externalOrderId,
          status,
        },
      ];
    }

    if (event.type === 'ORDER_UPSERTED' || event.type === 'CLIENT_UPSERTED') {
      const orderDate = payload.orderDate ?? new Date().toISOString();
      const estimatedValue = payload.estimatedValue ?? 0;
      const weightInKg = payload.weightInKg ?? 0;

      if (estimatedValue <= 0 || weightInKg <= 0) {
        return [
          {
            type: AgentCapability.PROVISION_CLIENT,
            clientCnpj: payload.clientCnpj,
            companyName: payload.companyName,
          },
        ];
      }

      return [
        {
          type: AgentCapability.CREATE_ORDER,
          externalSystem: event.source,
          externalOrderId: payload.externalOrderId,
          clientCnpj: payload.clientCnpj,
          companyName: payload.companyName,
          orderDate,
          estimatedValue,
          weightInKg,
          status,
        },
      ];
    }

    return [];
  }
}
