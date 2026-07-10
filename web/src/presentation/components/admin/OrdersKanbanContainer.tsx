'use client';

import { useState } from 'react';
import type { Order } from '@/domain/entities/Order';
import type { ClientAccessCredentials } from '@/domain/entities/Client';
import { useAdminOrders } from '@/presentation/hooks/useAdminOrders';
import { ClientCredentialsModal } from './ClientCredentialsModal';
import { CreateOrderModal } from './CreateOrderModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrdersKanbanBoard } from './OrdersKanbanBoard';

export function OrdersKanbanContainer() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newClientCredentials, setNewClientCredentials] =
    useState<ClientAccessCredentials | null>(null);
  const {
    orders,
    isLoading,
    error,
    isMutating,
    lookupClientByCnpj,
    createOrder,
    updateOrderStatus,
  } = useAdminOrders();

  const displayedOrder = selectedOrder
    ? (orders.find((order) => order.id === selectedOrder.id) ?? selectedOrder)
    : null;

  if (isLoading) {
    return (
      <div className="orders-timeline-loading">
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="kanban-container">
      <div className="kanban-toolbar">
        <div>
          <p className="kanban-toolbar__summary">
            {orders.length} pedido{orders.length === 1 ? '' : 's'} no quadro
          </p>
        </div>

        <button
          type="button"
          className="kanban-toolbar__action"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Novo pedido
        </button>
      </div>

      {error && (
        <div className="kanban-alert" role="alert">
          {error}
        </div>
      )}

      <OrdersKanbanBoard
        orders={orders}
        isMutating={isMutating}
        onMoveOrder={updateOrderStatus}
        onOpenOrder={setSelectedOrder}
      />

      <OrderDetailsModal
        order={displayedOrder}
        isOpen={displayedOrder !== null}
        isUpdating={isMutating}
        onClose={() => setSelectedOrder(null)}
        onMoveOrder={updateOrderStatus}
      />

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        isSubmitting={isMutating}
        onClose={() => setIsCreateModalOpen(false)}
        onLookupClient={lookupClientByCnpj}
        onSubmit={async (data) => {
          const result = await createOrder(data);

          if (result.success && result.newClientCredentials) {
            setNewClientCredentials(result.newClientCredentials);
          }

          return result.success;
        }}
      />

      <ClientCredentialsModal
        credentials={newClientCredentials}
        onClose={() => setNewClientCredentials(null)}
      />
    </div>
  );
}
