import { View, StyleSheet } from 'react-native';
import type { Order } from '@/domain/entities/Order';
import { colors, spacing } from '@/core/theme';
import { formatCurrency, formatDate, formatWeight } from '@/core/utils/format';
import { AppText } from '@/presentation/components/ui/Text';
import { OrderTimeline } from './OrderTimeline';
import { usePipelineStages } from '@/presentation/context/PipelineStagesContext';

interface OrderTrackingPanelProps {
  order: Order;
}

export function OrderTrackingPanel({ order }: OrderTrackingPanelProps) {
  const { stages } = usePipelineStages();
  const activeStage = stages.find((s) => s.id === order.status) || stages[0];

  const statusTitle = activeStage?.label || order.status;
  const statusHeadline = activeStage?.description || '';
  const statusLabel = activeStage?.shortLabel || order.status;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="eyebrow" color={colors.label}>
            Pedido {order.id}
          </AppText>
          <AppText variant="h2" color={colors.ink} style={styles.title}>
            {statusTitle}
          </AppText>
          <AppText variant="bodySmall" color={colors.muted}>
            {statusHeadline}
          </AppText>
        </View>
        <View style={styles.badge}>
          <AppText variant="caption" color={colors.pine} style={styles.badgeText}>
            {statusLabel}
          </AppText>
        </View>
      </View>

      <OrderTimeline status={order.status} />

      <View style={styles.details}>
        <DetailItem label="Data do pedido" value={formatDate(order.orderDate)} />
        <DetailItem label="Peso total" value={formatWeight(order.weightInKg)} />
        <DetailItem label="Valor estimado" value={formatCurrency(order.estimatedValue)} />
        <DetailItem label="CNPJ" value={order.clientCnpj} />
      </View>
    </View>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <AppText variant="eyebrow" color={colors.label}>
        {label}
      </AppText>
      <AppText variant="bodySmall" color={colors.ink} style={styles.detailValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    marginTop: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  detailItem: {
    width: '47%',
    gap: 4,
  },
  detailValue: {
    fontWeight: '600',
  },
});
