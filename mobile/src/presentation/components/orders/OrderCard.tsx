import { Pressable, StyleSheet, View } from 'react-native';
import { Order } from '@/domain/entities/Order';
import { colors, borderRadius, spacing } from '@/core/theme';
import { formatDate } from '@/core/utils/format';
import { AppText } from '@/presentation/components/ui/Text';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Pedido ${order.id}, ${formatDate(order.orderDate)}`}
      accessibilityHint="Abre os detalhes do pedido"
    >
      <View style={styles.header}>
        <AppText variant="label" style={styles.orderId}>
          {order.id}
        </AppText>
        <AppText variant="bodySmall" color={colors.text.secondary}>
          {formatDate(order.orderDate)}
        </AppText>
      </View>

      <OrderStatusBadge status={order.status} style={styles.badge} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  orderId: {
    color: colors.primary.DEFAULT,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    marginTop: spacing.sm,
  },
});
