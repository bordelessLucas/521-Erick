export enum OrderStatus {
  AGUARDANDO_APROVACAO = 'AGUARDANDO_APROVACAO',
  APROVADO = 'APROVADO',
  ORDEM_DE_ROLINHO = 'ORDEM_DE_ROLINHO',
  SEPARACAO = 'SEPARACAO',
  PRODUCAO = 'PRODUCAO',
  FATURADO = 'FATURADO',
}

export interface Order {
  id: string;
  clientCnpj: string;
  orderDate: string;
  estimatedValue: number;
  weightInKg: number;
  status: OrderStatus;
}
