import { useCallback, useEffect, useState } from 'react';
import type { Order } from '@/domain/entities/Order';
import { container } from '@/infrastructure/di/container';
import { getCurrentUserClientCnpj } from '@/infrastructure/firebase/FirebaseUserProfileRepository';

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const clientCnpj = await getCurrentUserClientCnpj();
      const data = await container.getOrderRepository().getAllByClientCnpj(clientCnpj);
      setOrders(data);
    } catch {
      setError('Não foi possível carregar os pedidos. Verifique a sua sessão e tente novamente.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { orders, isLoading, error, refresh };
}
