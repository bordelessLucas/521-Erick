'use client';

import { useState } from 'react';
import type { Order } from '@/domain/entities/Order';
import type { ClientAccessCredentials } from '@/domain/entities/Client';
import { useAdminOrders } from '@/presentation/hooks/useAdminOrders';
import { ClientCredentialsModal } from './ClientCredentialsModal';
import { CreateOrderModal } from './CreateOrderModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrdersKanbanBoard } from './OrdersKanbanBoard';
import { ManageStagesModal } from './ManageStagesModal';
import { ManageCollaboratorsModal } from './ManageCollaboratorsModal';

export function OrdersKanbanContainer() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageStagesModalOpen, setIsManageStagesModalOpen] = useState(false);
  const [isManageCollaboratorsModalOpen, setIsManageCollaboratorsModalOpen] = useState(false);
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

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="kanban-toolbar__action bg-neutral-200 text-neutral-800 hover:bg-neutral-300 mr-2 px-3 py-2 rounded font-medium text-sm transition-colors"
            onClick={() => setIsManageStagesModalOpen(true)}
          >
            Gerenciar Etapas
          </button>
          <button
            type="button"
            className="kanban-toolbar__action bg-neutral-200 text-neutral-800 hover:bg-neutral-300 mr-2 px-3 py-2 rounded font-medium text-sm transition-colors"
            onClick={() => setIsManageCollaboratorsModalOpen(true)}
          >
            Equipe
          </button>
          <button
            type="button"
            className="kanban-toolbar__action"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Novo pedido
          </button>
        </div>
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

      <ManageStagesModal
        isOpen={isManageStagesModalOpen}
        onClose={() => setIsManageStagesModalOpen(false)}
      />

      <ManageCollaboratorsModal
        isOpen={isManageCollaboratorsModalOpen}
        onClose={() => setIsManageCollaboratorsModalOpen(false)}
      />
    </div>
  );
}
