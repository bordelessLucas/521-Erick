import type { Order, OrderStatus } from '@/domain/entities/Order';

export interface FirestoreOrderDocument {
  clientCnpj: string;
  orderDate: string;
  estimatedValue: number;
  weightInKg: number;
  status: OrderStatus;
}

export function mapOrderFromFirestore(
  id: string,
  data: FirestoreOrderDocument,
): Order {
  return {
    id,
    clientCnpj: data.clientCnpj,
    orderDate: data.orderDate,
    estimatedValue: data.estimatedValue,
    weightInKg: data.weightInKg,
    status: data.status,
  };
}
