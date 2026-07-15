import { StyleSheet, View } from 'react-native';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  label: string;
  averageMinutes: number;
  orders: Order[];
  onPressOrder: (order: Order) => void;
  onMoveOrder: (orderId: string, status: OrderStatus) => void;
}

export function KanbanColumn({
  label,
  averageMinutes,
  orders,
  onPressOrder,
  onMoveOrder,
}: KanbanColumnProps) {
  return (
    <View style={styles.column}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <AppText variant="eyebrow" color={colors.label} style={styles.title}>
            {label}
          </AppText>
          {averageMinutes > 0 ? (
            <AppText variant="caption" color={colors.muted}>
              Média {averageMinutes} min
            </AppText>
          ) : null}
        </View>
        <View style={styles.count}>
          <AppText variant="caption" color={colors.muted} style={styles.countText}>
            {orders.length}
          </AppText>
        </View>
      </View>

      <View style={styles.body}>
        {orders.length === 0 ? (
          <AppText variant="caption" color={colors.label} style={styles.empty}>
            Toque no card para ver detalhes
          </AppText>
        ) : (
          orders.map((order) => (
            <KanbanCard
              key={order.id}
              order={order}
              averageMinutes={averageMinutes}
              onPress={onPressOrder}
              onMoveOrder={onMoveOrder}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 260,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    minHeight: 360,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.cream,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    flex: 1,
  },
  count: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  countText: {
    fontWeight: '600',
  },
  body: {
    padding: spacing.sm,
    gap: spacing.sm,
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: spacing.lg,
    lineHeight: 18,
  },
});
