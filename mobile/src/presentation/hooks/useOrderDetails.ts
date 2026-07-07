import { useCallback, useEffect, useState } from 'react';
import type { Order } from '@/domain/entities/Order';
import { container } from '@/infrastructure/di/container';

interface UseOrderDetailsReturn {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useOrderDetails(orderId: string): UseOrderDetailsReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await container.getOrderRepository().getById(orderId);
      setOrder(data);
      if (!data) {
        setError('Pedido não encontrado.');
      }
    } catch {
      setError('Não foi possível carregar o pedido.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { order, isLoading, error, refresh };
}
