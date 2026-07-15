'use client';

import { useMemo, useState } from 'react';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { usePipelineStages } from '@/presentation/contexts/PipelineStagesContext';
import { KanbanColumn } from './KanbanColumn';

interface OrdersKanbanBoardProps {
  orders: Order[];
  isMutating: boolean;
  onMoveOrder: (orderId: string, status: OrderStatus) => Promise<boolean>;
  onOpenOrder: (order: Order) => void;
}

export function OrdersKanbanBoard({
  orders,
  isMutating,
  onMoveOrder,
  onOpenOrder,
}: OrdersKanbanBoardProps) {
  const [draggingOrderId, setDraggingOrderId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<OrderStatus | null>(null);
  const { stages } = usePipelineStages();

  const ordersByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      stages.map((step) => [step.id, [] as Order[]]),
    ) as Record<OrderStatus, Order[]>;

    for (const order of orders) {
      grouped[order.status]?.push(order);
    }

    return grouped;
  }, [orders, stages]);

  const handleDrop = async (status: OrderStatus) => {
    const orderId = draggingOrderId;

    setDraggingOrderId(null);
    setDropTargetStatus(null);

    if (!orderId) {
      return;
    }

    const order = orders.find((item) => item.id === orderId);

    if (!order || order.status === status) {
      return;
    }

    await onMoveOrder(orderId, status);
  };

  return (
    <div className={`kanban-board${isMutating ? ' kanban-board--busy' : ''}`}>
      {stages.map((step) => (
        <KanbanColumn
          key={step.id}
          status={step.id}
          label={step.shortLabel}
          averageMinutes={step.averageMinutes ?? 0}
          orders={ordersByStatus[step.id] || []}
          draggingOrderId={draggingOrderId}
          isDropTarget={dropTargetStatus === step.id}
          onDragStart={setDraggingOrderId}
          onDragEnd={() => {
            setDraggingOrderId(null);
            setDropTargetStatus(null);
          }}
          onDragOver={setDropTargetStatus}
          onDragLeave={() => setDropTargetStatus(null)}
          onDrop={(status) => void handleDrop(status)}
          onOpenOrder={onOpenOrder}
        />
      ))}
    </div>
  );
}
