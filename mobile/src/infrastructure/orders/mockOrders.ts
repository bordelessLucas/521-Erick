import { Order, DefaultOrderStatuses } from '@/domain/entities/Order';

export const mockOrders: Order[] = [
  {
    id: 'PED-2026-0042',
    clientCnpj: '12.345.678/0001-90',
    orderDate: '2026-07-01T10:30:00.000Z',
    estimatedValue: 48750.0,
    weightInKg: 1250.5,
    status: DefaultOrderStatuses.FATURADO,
  },
  {
    id: 'PED-2026-0041',
    clientCnpj: '12.345.678/0001-90',
    orderDate: '2026-06-28T14:15:00.000Z',
    estimatedValue: 32100.0,
    weightInKg: 890.0,
    status: DefaultOrderStatuses.PRODUCAO,
  },
  {
    id: 'PED-2026-0040',
    clientCnpj: '12.345.678/0001-90',
    orderDate: '2026-06-25T09:00:00.000Z',
    estimatedValue: 15600.0,
    weightInKg: 420.75,
    status: DefaultOrderStatuses.SEPARACAO,
  },
  {
    id: 'PED-2026-0039',
    clientCnpj: '12.345.678/0001-90',
    orderDate: '2026-06-20T16:45:00.000Z',
    estimatedValue: 22400.0,
    weightInKg: 610.0,
    status: DefaultOrderStatuses.ORDEM_DE_ROLINHO,
  },
  {
    id: 'PED-2026-0038',
    clientCnpj: '12.345.678/0001-90',
    orderDate: '2026-06-18T11:20:00.000Z',
    estimatedValue: 9800.0,
    weightInKg: 275.3,
    status: DefaultOrderStatuses.APROVADO,
  },
  {
    id: 'PED-2026-0037',
    clientCnpj: '12.345.678/0001-90',
    orderDate: '2026-06-15T08:00:00.000Z',
    estimatedValue: 54300.0,
    weightInKg: 1480.0,
    status: DefaultOrderStatuses.AGUARDANDO_APROVACAO,
  },
  {
    id: 'PED-2026-0036',
    clientCnpj: '12.345.678/0001-90',
    orderDate: '2026-06-10T13:30:00.000Z',
    estimatedValue: 18900.0,
    weightInKg: 520.0,
    status: DefaultOrderStatuses.FATURADO,
  },
  {
    id: 'PED-2026-0035',
    clientCnpj: '12.345.678/0001-90',
    orderDate: '2026-06-05T10:00:00.000Z',
    estimatedValue: 41200.0,
    weightInKg: 1100.25,
    status: DefaultOrderStatuses.FATURADO,
  },
];

export async function fetchMockOrders(): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockOrders];
}

export function findOrderById(orderId: string): Order | undefined {
  return mockOrders.find((order) => order.id === orderId);
}
