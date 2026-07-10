import { useCallback, useEffect, useState } from 'react';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import type { ClientAccessCredentials, ClientSummary } from '@/domain/entities/Client';
import type { CreateOrderWithClientInput } from '@/application/orders/AdminOrderService';
import { AuthSessionError } from '@/infrastructure/firebase/firebaseAuthSession';
import { ClientProvisioningError } from '@/infrastructure/firebase/FirebaseClientRepository';
import { isCurrentUserAdmin } from '@/infrastructure/firebase/FirebaseUserProfileRepository';
import { container } from '@/infrastructure/di/container';
import { formatCnpj, isValidCnpj, normalizeCnpj } from '@/domain/utils/cnpj';

export interface CreateOrderOutcome {
  success: boolean;
  newClientCredentials?: ClientAccessCredentials;
}

function resolveAdminOrdersError(error: unknown): string {
  if (error instanceof AuthSessionError) {
    return error.message;
  }

  if (error instanceof ClientProvisioningError) {
    return error.message;
  }

  return 'Não foi possível concluir a operação. Tente novamente.';
}

interface UseAdminOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  isMutating: boolean;
  refresh: () => Promise<void>;
  lookupClientByCnpj: (clientCnpj: string) => Promise<ClientSummary | null>;
  createOrder: (data: CreateOrderWithClientInput) => Promise<CreateOrderOutcome>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

export function useAdminOrders(): UseAdminOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const admin = await isCurrentUserAdmin();

      if (!admin) {
        setError('Sem permissão para acessar o painel interno.');
        setOrders([]);
        return;
      }

      const data = await container.getOrderRepository().getAll();
      setOrders(data);
    } catch (err) {
      setError(resolveAdminOrdersError(err));
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lookupClientByCnpj = useCallback(async (clientCnpj: string) => {
    if (!isValidCnpj(clientCnpj)) {
      return null;
    }

    try {
      return await container
        .getClientRepository()
        .findByCnpj(formatCnpj(normalizeCnpj(clientCnpj)));
    } catch (err) {
      setError(resolveAdminOrdersError(err));
      return null;
    }
  }, []);

  const createOrder = useCallback(
    async (data: CreateOrderWithClientInput): Promise<CreateOrderOutcome> => {
      setIsMutating(true);
      setError(null);

      try {
        const result = await container.getAdminOrderService().createOrderWithClient(data);

        setOrders((current) =>
          [result.order, ...current].sort(
            (left, right) =>
              new Date(right.orderDate).getTime() - new Date(left.orderDate).getTime(),
          ),
        );

        return {
          success: true,
          newClientCredentials: result.newClientCredentials,
        };
      } catch (err) {
        setError(resolveAdminOrdersError(err));
        return { success: false };
      } finally {
        setIsMutating(false);
      }
    },
    [],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus): Promise<boolean> => {
      const previousOrders = orders;

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );
      setError(null);

      try {
        const updated = await container.getOrderRepository().updateStatus(orderId, status);
        setOrders((current) =>
          current.map((order) => (order.id === orderId ? updated : order)),
        );
        return true;
      } catch (err) {
        setOrders(previousOrders);
        setError(resolveAdminOrdersError(err));
        return false;
      }
    },
    [orders],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    orders,
    isLoading,
    error,
    isMutating,
    refresh,
    lookupClientByCnpj,
    createOrder,
    updateOrderStatus,
  };
}
