import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { spacing } from '@/core/theme';
import { usePipelineStages } from '@/presentation/context/PipelineStagesContext';
import { KanbanColumn } from './KanbanColumn';

interface OrdersKanbanBoardProps {
  orders: Order[];
  onPressOrder: (order: Order) => void;
  onMoveOrder: (orderId: string, status: OrderStatus) => void;
}

export function OrdersKanbanBoard({
  orders,
  onPressOrder,
  onMoveOrder,
}: OrdersKanbanBoardProps) {
  const { stages } = usePipelineStages();

  const ordersByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      stages.map((step) => [step.id, [] as Order[]]),
    ) as Record<OrderStatus, Order[]>;

    for (const order of orders) {
      if (!grouped[order.status]) {
        grouped[order.status] = [];
      }
      grouped[order.status]?.push(order);
    }

    return grouped;
  }, [orders, stages]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.board}
    >
      {stages.map((step) => (
        <KanbanColumn
          key={step.id}
          label={step.shortLabel}
          averageMinutes={step.averageMinutes ?? 0}
          orders={ordersByStatus[step.id] || []}
          onPressOrder={onPressOrder}
          onMoveOrder={onMoveOrder}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  board: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
});
