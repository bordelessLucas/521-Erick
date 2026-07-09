import { OrderStatus } from '@/domain/entities/Order';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  shortLabel: string;
  description: string;
}

export const ORDER_TIMELINE_STEPS: OrderTimelineStep[] = [
  {
    status: OrderStatus.AGUARDANDO_APROVACAO,
    label: 'Aguardando aprovação',
    shortLabel: 'Aprovação',
    description: 'Seu pedido foi recebido e aguarda validação comercial.',
  },
  {
    status: OrderStatus.APROVADO,
    label: 'Pedido aprovado',
    shortLabel: 'Aprovado',
    description: 'O pedido foi confirmado e entrou na fila de produção.',
  },
  {
    status: OrderStatus.ORDEM_DE_ROLINHO,
    label: 'Ordem de rolinho',
    shortLabel: 'Rolinho',
    description: 'A ordem de rolinho foi emitida para a fábrica.',
  },
  {
    status: OrderStatus.SEPARACAO,
    label: 'Separação',
    shortLabel: 'Separação',
    description: 'Materiais e insumos estão sendo separados.',
  },
  {
    status: OrderStatus.PRODUCAO,
    label: 'Em produção',
    shortLabel: 'Produção',
    description: 'Seu pedido está sendo produzido na fábrica.',
  },
  {
    status: OrderStatus.FATURADO,
    label: 'Faturado',
    shortLabel: 'Faturado',
    description: 'Pedido concluído e faturado com sucesso.',
  },
];

export type TimelineStepState = 'completed' | 'current' | 'pending';

export function getActiveStepIndex(status: OrderStatus): number {
  const index = ORDER_TIMELINE_STEPS.findIndex((step) => step.status === status);
  return index >= 0 ? index : 0;
}

export function getStepState(
  stepIndex: number,
  activeIndex: number,
  isFullyComplete: boolean,
): TimelineStepState {
  if (isFullyComplete || stepIndex < activeIndex) {
    return 'completed';
  }

  if (stepIndex === activeIndex) {
    return isFullyComplete ? 'completed' : 'current';
  }

  return 'pending';
}

export function getOrderStatusHeadline(status: OrderStatus): string {
  const activeIndex = getActiveStepIndex(status);
  const step = ORDER_TIMELINE_STEPS[activeIndex];
  return step?.description ?? 'Acompanhe o andamento do seu pedido.';
}

export function getOrderStatusTitle(status: OrderStatus): string {
  const activeIndex = getActiveStepIndex(status);
  const step = ORDER_TIMELINE_STEPS[activeIndex];
  return step?.label ?? 'Em andamento';
}
