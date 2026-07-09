import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { spacing } from '@/core/theme';
import { ORDER_TIMELINE_STEPS } from '@/presentation/components/orders/orderTimelineSteps';
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
  const ordersByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      ORDER_TIMELINE_STEPS.map((step) => [step.status, [] as Order[]]),
    ) as Record<OrderStatus, Order[]>;

    for (const order of orders) {
      grouped[order.status]?.push(order);
    }

    return grouped;
  }, [orders]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.board}
    >
      {ORDER_TIMELINE_STEPS.map((step) => (
        <KanbanColumn
          key={step.status}
          label={step.shortLabel}
          orders={ordersByStatus[step.status]}
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
