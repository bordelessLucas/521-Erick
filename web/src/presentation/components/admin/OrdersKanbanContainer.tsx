'use client';

import { useState } from 'react';
import type { ClientAccessCredentials } from '@/domain/entities/Client';
import { useAdminOrders } from '@/presentation/hooks/useAdminOrders';
import { ClientCredentialsModal } from './ClientCredentialsModal';
import { CreateOrderModal } from './CreateOrderModal';
import { OrdersKanbanBoard } from './OrdersKanbanBoard';

export function OrdersKanbanContainer() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
