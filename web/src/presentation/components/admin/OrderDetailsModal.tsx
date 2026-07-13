'use client';

import { useEffect, useState } from 'react';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { OrderTrackingPanel } from '@/presentation/components/orders/OrderTrackingPanel';
import { usePipelineStages } from '@/presentation/contexts/PipelineStagesContext';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  isUpdating?: boolean;
  onClose: () => void;
  onMoveOrder: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

export function OrderDetailsModal({
  order,
  isOpen,
  isUpdating = false,
  onClose,
  onMoveOrder,
}: OrderDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const { stages } = usePipelineStages();

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isUpdating) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isUpdating, onClose]);

  if (!isOpen || !order || !selectedStatus) {
    return null;
  }

  const hasStatusChanged = selectedStatus !== order.status;

  const handleClose = () => {
    if (isUpdating) {
      return;
    }

    onClose();
  };

  const handleUpdateStatus = async () => {
    if (!hasStatusChanged) {
      return;
    }

    await onMoveOrder(order.id, selectedStatus);
  };

  return (
    <div className="kanban-modal" role="presentation" onClick={handleClose}>
      <div
        className="kanban-modal__dialog kanban-modal__dialog--details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="kanban-modal__header">
          <div>
            <p className="eyebrow dark">Detalhes do pedido</p>
            <h2 id="order-details-title">{order.id}</h2>
          </div>
          <button
            type="button"
            className="kanban-modal__close"
            onClick={handleClose}
            disabled={isUpdating}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="kanban-modal__body">
          <OrderTrackingPanel order={order} />
        </div>

        <footer className="kanban-modal__details-footer">
          <label className="kanban-modal__select-label" htmlFor="order-status-select">
            Etapa atual
            <select
              id="order-status-select"
              className="kanban-modal__select"
              value={selectedStatus}
              disabled={isUpdating}
              onChange={(event) => setSelectedStatus(event.target.value as OrderStatus)}
            >
              {stages.map((step) => (
                <option key={step.id} value={step.id}>
                  {step.label}
                </option>
              ))}
            </select>
          </label>

          <div className="kanban-modal__footer">
            <button
              type="button"
              className="kanban-modal__secondary"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Fechar
            </button>
            <button
              type="button"
              className="kanban-modal__primary"
              onClick={() => void handleUpdateStatus()}
              disabled={isUpdating || !hasStatusChanged}
            >
              {isUpdating ? 'Atualizando...' : 'Atualizar etapa'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
