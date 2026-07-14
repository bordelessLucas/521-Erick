import { StyleSheet, View, ViewStyle } from 'react-native';
import type { OrderStatus } from '@/domain/entities/Order';
import { borderRadius, spacing, colors } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { usePipelineStages } from '@/presentation/context/PipelineStagesContext';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  style?: ViewStyle;
}

export function OrderStatusBadge({ status, style }: OrderStatusBadgeProps) {
  const { stages } = usePipelineStages();
  const stage = stages.find(s => s.id === status) || stages[0];
  const label = stage?.shortLabel || status;

  return (
    <View
      style={[
        styles.badge,
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label}`}
    >
      <AppText variant="caption" style={styles.label}>
        {label}
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
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
  },
  label: {
    fontWeight: '600',
    color: colors.pine,
  },
});
