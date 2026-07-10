'use client';

import { useMemo, useState } from 'react';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { ORDER_TIMELINE_STEPS } from '@/presentation/components/orders/orderTimelineSteps';
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

  const ordersByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      ORDER_TIMELINE_STEPS.map((step) => [step.status, [] as Order[]]),
    ) as Record<OrderStatus, Order[]>;

    for (const order of orders) {
      grouped[order.status]?.push(order);
    }

    return grouped;
  }, [orders]);

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
      {ORDER_TIMELINE_STEPS.map((step) => (
        <KanbanColumn
          key={step.status}
          status={step.status}
          label={step.shortLabel}
          orders={ordersByStatus[step.status]}
          draggingOrderId={draggingOrderId}
          isDropTarget={dropTargetStatus === step.status}
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
