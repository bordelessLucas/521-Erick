'use client';

import type { Order, OrderStatus } from '@/domain/entities/Order';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: OrderStatus;
  label: string;
  orders: Order[];
  draggingOrderId: string | null;
  isDropTarget: boolean;
  onDragStart: (orderId: string) => void;
  onDragEnd: () => void;
  onDragOver: (status: OrderStatus) => void;
  onDragLeave: () => void;
  onDrop: (status: OrderStatus) => void;
  onOpenOrder: (order: Order) => void;
}

export function KanbanColumn({
  status,
  label,
  orders,
  draggingOrderId,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenOrder,
}: KanbanColumnProps) {
  return (
    <section
      className={`kanban-column${isDropTarget ? ' kanban-column--active' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver(status);
      }}
      onDragLeave={onDragLeave}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(status);
      }}
    >
      <header className="kanban-column__header">
        <h3>{label}</h3>
        <span className="kanban-column__count">{orders.length}</span>
      </header>

      <div className="kanban-column__body">
        {orders.length === 0 ? (
          <p className="kanban-column__empty">Arraste pedidos para esta etapa</p>
        ) : (
          orders.map((order) => (
            <KanbanCard
              key={order.id}
              order={order}
              isDragging={draggingOrderId === order.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onOpen={onOpenOrder}
            />
          ))
        )}
      </div>
    </section>
  );
}
