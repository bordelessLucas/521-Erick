import { OrderStatus } from '@/domain/entities/Order';

/**
 * Mapa inicial de status externos → Kanban Trançatto.
 * Ampliar quando o Erick documentar os status do sistema dele.
 */
const EXTERNAL_STATUS_ALIASES: Record<string, OrderStatus> = {
  aguardando: OrderStatus.AGUARDANDO_APROVACAO,
  aguardando_aprovacao: OrderStatus.AGUARDANDO_APROVACAO,
  pendente: OrderStatus.AGUARDANDO_APROVACAO,
  aprovado: OrderStatus.APROVADO,
  aprovacao: OrderStatus.APROVADO,
  rolinho: OrderStatus.ORDEM_DE_ROLINHO,
  ordem_de_rolinho: OrderStatus.ORDEM_DE_ROLINHO,
  separacao: OrderStatus.SEPARACAO,
  separação: OrderStatus.SEPARACAO,
  producao: OrderStatus.PRODUCAO,
  produção: OrderStatus.PRODUCAO,
  em_producao: OrderStatus.PRODUCAO,
  faturado: OrderStatus.FATURADO,
  concluido: OrderStatus.FATURADO,
  concluído: OrderStatus.FATURADO,
};

export function mapExternalStatusToOrderStatus(
  externalStatus: string | undefined,
  fallback: OrderStatus = OrderStatus.AGUARDANDO_APROVACAO,
): OrderStatus {
  if (!externalStatus?.trim()) {
    return fallback;
  }

  const normalized = externalStatus
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s-]+/g, '_');

  if (normalized in OrderStatus) {
    return normalized as OrderStatus;
  }

  return EXTERNAL_STATUS_ALIASES[normalized] ?? fallback;
}
