import type { Order, OrderStatus } from '@/domain/entities/Order';

export interface CreateOrderData {
  clientCnpj: string;
  orderDate: string;
  estimatedValue: number;
  weightInKg: number;
  status: OrderStatus;
}

export interface IOrderRepository {
  getAllByClientCnpj(clientCnpj: string): Promise<Order[]>;
  getById(orderId: string): Promise<Order | null>;
  getAll(): Promise<Order[]>;
  create(data: CreateOrderData): Promise<Order>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order>;
}
