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
    backgroundColor: colors.primary[100],
    textColor: colors.primary[800],
  },
  [OrderStatus.ORDEM_DE_ROLINHO]: {
    label: 'Ordem de Rolinho',
    backgroundColor: '#F3F4F6',
    textColor: '#374151',
  },
  [OrderStatus.SEPARACAO]: {
    label: 'Separação',
    backgroundColor: colors.secondary[100],
    textColor: colors.secondary[800],
  },
  [OrderStatus.PRODUCAO]: {
    label: 'Produção',
    backgroundColor: '#DBEAFE',
    textColor: '#1E40AF',
  },
  [OrderStatus.FATURADO]: {
    label: 'Faturado',
    backgroundColor: '#D1FAE5',
    textColor: '#065F46',
  },
};
