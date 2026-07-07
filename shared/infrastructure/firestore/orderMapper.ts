import type { Order, OrderStatus } from '../../types/order';

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

export function mapOrderToFirestore(order: Order): FirestoreOrderDocument {
  return {
    clientCnpj: order.clientCnpj,
    orderDate: order.orderDate,
    estimatedValue: order.estimatedValue,
    weightInKg: order.weightInKg,
    status: order.status,
  };
}
