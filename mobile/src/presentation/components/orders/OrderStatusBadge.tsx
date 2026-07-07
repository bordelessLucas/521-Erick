import { StyleSheet, View, ViewStyle } from 'react-native';
import { OrderStatus } from '@/domain/entities/Order';
import { borderRadius, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { orderStatusConfig } from './orderStatusConfig';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  style?: ViewStyle;
}

export function OrderStatusBadge({ status, style }: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${config.label}`}
    >
      <AppText variant="caption" style={[styles.label, { color: config.textColor }]}>
        {config.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  label: {
    fontWeight: '600',
  },
});
