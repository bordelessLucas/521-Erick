'use client';

import Link from 'next/link';
import { OrdersList } from '@/presentation/components/orders/OrdersList';
import { useOrders } from '@/presentation/hooks/useOrders';

export function OrdersListContainer() {
  const { orders, isLoading, error, refresh } = useOrders();

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white py-16">
        <p className="text-sm text-neutral-500">A carregar pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => void refresh()}
            className="text-sm font-medium text-primary-800 hover:underline"
          >
            Tentar novamente
          </button>
          <Link href="/login" className="text-sm font-medium text-primary-800 hover:underline">
            Iniciar sessão
          </Link>
        </div>
      </div>
    );
  }

  return <OrdersList orders={orders} />;
}
