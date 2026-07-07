import type { Order } from '../types/order';

export interface IOrderRepository {
  getAllByClientCnpj(clientCnpj: string): Promise<Order[]>;
  getById(orderId: string): Promise<Order | null>;
}
