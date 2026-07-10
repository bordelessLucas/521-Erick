'use client';

import { useRef, useState } from 'react';
import { formatCurrency, formatDate, formatWeight } from '@/core/utils/format';
import type { Order } from '@/domain/entities/Order';

interface KanbanCardProps {
  order: Order;
  isDragging: boolean;
  onDragStart: (orderId: string) => void;
  onDragEnd: () => void;
  onOpen: (order: Order) => void;
}

function shortenOrderId(orderId: string): string {
  return orderId.length > 8 ? `#${orderId.slice(0, 8)}` : `#${orderId}`;
}

export function KanbanCard({
  order,
  isDragging,
  onDragStart,
  onDragEnd,
  onOpen,
}: KanbanCardProps) {
  const [isGrabbed, setIsGrabbed] = useState(false);
  const hasDraggedRef = useRef(false);

  return (
    <article
      className={`kanban-card${isDragging ? ' kanban-card--dragging' : ''}${isGrabbed ? ' kanban-card--grabbed' : ''}`}
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Abrir detalhes do pedido ${shortenOrderId(order.id)}`}
      onDragStart={() => {
        hasDraggedRef.current = true;
        setIsGrabbed(true);
        onDragStart(order.id);
      }}
      onDragEnd={() => {
        setIsGrabbed(false);
        onDragEnd();
        window.setTimeout(() => {
          hasDraggedRef.current = false;
        }, 0);
      }}
      onClick={() => {
        if (hasDraggedRef.current) {
          return;
        }

        onOpen(order);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(order);
        }
      }}
    >
      <header className="kanban-card__header">
        <span className="kanban-card__id">{shortenOrderId(order.id)}</span>
        <time className="kanban-card__date" dateTime={order.orderDate}>
          {formatDate(order.orderDate)}
        </time>
      </header>

      <p className="kanban-card__cnpj">{order.clientCnpj}</p>

      <dl className="kanban-card__metrics">
        <div>
          <dt>Valor</dt>
          <dd>{formatCurrency(order.estimatedValue)}</dd>
        </div>
        <div>
          <dt>Peso</dt>
          <dd>{formatWeight(order.weightInKg)}</dd>
        </div>
      </dl>
    </article>
  );
}
