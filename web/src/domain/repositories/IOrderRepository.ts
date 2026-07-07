import type { Order } from '@/domain/entities/Order';

export interface IOrderRepository {
  getAllByClientCnpj(clientCnpj: string): Promise<Order[]>;
  getById(orderId: string): Promise<Order | null>;
}
