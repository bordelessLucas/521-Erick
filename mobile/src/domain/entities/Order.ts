export type OrderStatus = string;

export const DefaultOrderStatuses = {
  AGUARDANDO_APROVACAO: 'AGUARDANDO_APROVACAO',
  APROVADO: 'APROVADO',
  ORDEM_DE_ROLINHO: 'ORDEM_DE_ROLINHO',
  SEPARACAO: 'SEPARACAO',
  PRODUCAO: 'PRODUCAO',
  FATURADO: 'FATURADO',
} as const;

export interface Order {
  id: string;
  clientCnpj: string;
  orderDate: string;
  estimatedValue: number;
  weightInKg: number;
  status: OrderStatus;
  statusChangedAt: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  orderIndex: number;
  averageMinutes: number;
}

export type StageTrafficLight = 'green' | 'yellow' | 'red';
