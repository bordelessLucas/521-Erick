import { OrderStatus, DefaultOrderStatuses } from '@/domain/entities/Order';

interface StatusConfig {
  label: string;
  badgeClassName: string;
}

export const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  [DefaultOrderStatuses.AGUARDANDO_APROVACAO]: {
    label: 'Aguardando Aprovação',
    badgeClassName: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
  },
  [DefaultOrderStatuses.APROVADO]: {
    label: 'Aprovado',
    badgeClassName: 'bg-primary-100 text-primary-800 ring-primary-600/20',
  },
  [DefaultOrderStatuses.ORDEM_DE_ROLINHO]: {
    label: 'Ordem de Rolinho',
    badgeClassName: 'bg-neutral-100 text-neutral-700 ring-neutral-500/20',
  },
  [DefaultOrderStatuses.SEPARACAO]: {
    label: 'Separação',
    badgeClassName: 'bg-secondary-100 text-secondary-800 ring-secondary-600/20',
  },
  [DefaultOrderStatuses.PRODUCAO]: {
    label: 'Produção',
    badgeClassName: 'bg-blue-100 text-blue-800 ring-blue-600/20',
  },
  [DefaultOrderStatuses.FATURADO]: {
    label: 'Faturado',
    badgeClassName: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  },
};
