'use client';

import { useEffect, useState, useRef } from 'react';
import { formatCurrency, formatDate, formatWeight } from '@/core/utils/format';
import type { Order } from '@/domain/entities/Order';
import {
  formatMinutesLabel,
  getElapsedMinutes,
  getStageTrafficLight,
} from '@/domain/utils/stageTrafficLight';

interface KanbanCardProps {
  order: Order;
  averageMinutes: number;
  isDragging: boolean;
  onDragStart: (orderId: string) => void;
  onDragEnd: () => void;
  onOpen: (order: Order) => void;
}

function shortenOrderId(orderId: string): string {
  return orderId.length > 8 ? `#${orderId.slice(0, 8)}` : `#${orderId}`;
}

const LIGHT_LABELS = {
  green: 'No tempo',
  yellow: 'Atenção',
  red: 'Atrasado',
} as const;

export function KanbanCard({
  order,
  averageMinutes,
  isDragging,
  onDragStart,
  onDragEnd,
  onOpen,
}: KanbanCardProps) {
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    if (!averageMinutes || averageMinutes <= 0) {
      return;
    }

    const timer = window.setInterval(() => setNowMs(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, [averageMinutes]);

  const light = getStageTrafficLight(order.statusChangedAt, averageMinutes, nowMs);
  const elapsed = getElapsedMinutes(order.statusChangedAt, nowMs);

  return (
    <article
      className={`kanban-card${isDragging ? ' kanban-card--dragging' : ''}${isGrabbed ? ' kanban-card--grabbed' : ''}${light ? ` kanban-card--sla-${light}` : ''}`}
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

      {light && elapsed !== null && (
        <div className={`kanban-card__sla kanban-card__sla--${light}`}>
          <span className="kanban-card__sla-dot" aria-hidden="true" />
          <span className="kanban-card__sla-label">{LIGHT_LABELS[light]}</span>
          <span className="kanban-card__sla-time">
            {formatMinutesLabel(elapsed)} / {averageMinutes} min
          </span>
        </div>
      )}
    </article>
  );
}
