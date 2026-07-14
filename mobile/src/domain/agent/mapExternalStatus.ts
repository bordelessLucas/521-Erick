import { OrderStatus, DefaultOrderStatuses } from '@/domain/entities/Order';

const EXTERNAL_STATUS_ALIASES: Record<string, OrderStatus> = {
  aguardando: DefaultOrderStatuses.AGUARDANDO_APROVACAO,
  aguardando_aprovacao: DefaultOrderStatuses.AGUARDANDO_APROVACAO,
  pendente: DefaultOrderStatuses.AGUARDANDO_APROVACAO,
  aprovado: DefaultOrderStatuses.APROVADO,
  aprovacao: DefaultOrderStatuses.APROVADO,
  rolinho: DefaultOrderStatuses.ORDEM_DE_ROLINHO,
  ordem_de_rolinho: DefaultOrderStatuses.ORDEM_DE_ROLINHO,
  separacao: DefaultOrderStatuses.SEPARACAO,
  separação: DefaultOrderStatuses.SEPARACAO,
  producao: DefaultOrderStatuses.PRODUCAO,
  produção: DefaultOrderStatuses.PRODUCAO,
  em_producao: DefaultOrderStatuses.PRODUCAO,
  faturado: DefaultOrderStatuses.FATURADO,
  concluido: DefaultOrderStatuses.FATURADO,
  concluído: DefaultOrderStatuses.FATURADO,
};

export function mapExternalStatusToOrderStatus(
  externalStatus: string | undefined,
  fallback: OrderStatus = DefaultOrderStatuses.AGUARDANDO_APROVACAO,
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

  return EXTERNAL_STATUS_ALIASES[normalized] ?? fallback;
}
