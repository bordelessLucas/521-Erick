import { OrderStatus } from '@/domain/entities/Order';
import { colors } from '@/core/theme';

interface StatusConfig {
  label: string;
  backgroundColor: string;
  textColor: string;
}

export const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  [OrderStatus.AGUARDANDO_APROVACAO]: {
    label: 'Aguardando Aprovação',
    backgroundColor: '#FEF9C3',
    textColor: '#854D0E',
  },
  [OrderStatus.APROVADO]: {
    label: 'Aprovado',
    backgroundColor: colors.creamDark,
    textColor: colors.pine,
  },
  [OrderStatus.ORDEM_DE_ROLINHO]: {
    label: 'Ordem de Rolinho',
    backgroundColor: '#F3F4F6',
    textColor: colors.ink,
  },
  [OrderStatus.SEPARACAO]: {
    label: 'Separação',
    backgroundColor: '#fdf0ea',
    textColor: colors.terra,
  },
  [OrderStatus.PRODUCAO]: {
    label: 'Produção',
    backgroundColor: '#e8f0ec',
    textColor: colors.pine,
  },
  [OrderStatus.FATURADO]: {
    label: 'Faturado',
    backgroundColor: '#D1FAE5',
    textColor: '#065F46',
  },
};
