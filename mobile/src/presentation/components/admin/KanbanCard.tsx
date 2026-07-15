import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { colors, spacing } from '@/core/theme';
import { formatCurrency, formatDate, formatWeight } from '@/core/utils/format';
import {
  formatMinutesLabel,
  getElapsedMinutes,
  getStageTrafficLight,
} from '@/domain/utils/stageTrafficLight';
import { AppText } from '@/presentation/components/ui/Text';
import { usePipelineStages } from '@/presentation/context/PipelineStagesContext';

interface KanbanCardProps {
  order: Order;
  averageMinutes: number;
  onPress: (order: Order) => void;
  onMoveOrder: (orderId: string, status: OrderStatus) => void;
}

function shortenOrderId(orderId: string): string {
  return orderId.length > 8 ? `#${orderId.slice(0, 8)}` : `#${orderId}`;
}

const LIGHT_LABELS = {
  green: 'No tempo',
  yellow: 'Atenção',
  red: 'Atrasado',
} as const;

const LIGHT_COLORS = {
  green: '#2f7d4a',
  yellow: '#c4a035',
  red: '#b5402c',
} as const;

export function KanbanCard({
  order,
  averageMinutes,
  onPress,
  onMoveOrder,
}: KanbanCardProps) {
  const { stages } = usePipelineStages();
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!averageMinutes || averageMinutes <= 0) {
      return;
    }

    const timer = setInterval(() => setNowMs(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, [averageMinutes]);

  const light = getStageTrafficLight(order.statusChangedAt, averageMinutes, nowMs);
  const elapsed = getElapsedMinutes(order.statusChangedAt, nowMs);

  const handleLongPress = () => {
    Alert.alert('Mover pedido', 'Selecione a nova etapa:', [
      ...stages.map((step) => ({
        text: step.shortLabel,
        onPress: () => onMoveOrder(order.id, step.id),
      })),
      { text: 'Cancelar', style: 'cancel' as const },
    ]);
  };

  return (
    <Pressable
      onPress={() => onPress(order)}
      onLongPress={handleLongPress}
      style={[
        styles.card,
        light ? { borderLeftWidth: 3, borderLeftColor: LIGHT_COLORS[light] } : null,
      ]}
      accessibilityHint="Toque para ver detalhes. Mantenha pressionado para mover de etapa."
    >
      <View style={styles.header}>
        <AppText variant="caption" color={colors.pine} style={styles.id}>
          {shortenOrderId(order.id)}
        </AppText>
        <AppText variant="caption" color={colors.label}>
          {formatDate(order.orderDate)}
        </AppText>
      </View>

      <AppText variant="bodySmall" color={colors.ink} style={styles.cnpj}>
        {order.clientCnpj}
      </AppText>

      <View style={styles.metrics}>
        <View>
          <AppText variant="eyebrow" color={colors.label}>
            Valor
          </AppText>
          <AppText variant="bodySmall" color={colors.ink} style={styles.metricValue}>
            {formatCurrency(order.estimatedValue)}
          </AppText>
        </View>
        <View>
          <AppText variant="eyebrow" color={colors.label}>
            Peso
          </AppText>
          <AppText variant="bodySmall" color={colors.ink} style={styles.metricValue}>
            {formatWeight(order.weightInKg)}
          </AppText>
        </View>
      </View>

      {light && elapsed !== null ? (
        <View style={styles.sla}>
          <View style={[styles.slaDot, { backgroundColor: LIGHT_COLORS[light] }]} />
          <AppText variant="caption" color={LIGHT_COLORS[light]} style={styles.slaLabel}>
            {LIGHT_LABELS[light]}
          </AppText>
          <AppText variant="caption" color={colors.label} style={styles.slaTime}>
            {formatMinutesLabel(elapsed)} / {averageMinutes} min
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.sm + 4,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  id: {
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cnpj: {
    fontWeight: '500',
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricValue: {
    fontWeight: '600',
    marginTop: 2,
  },
  sla: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.cream,
  },
  slaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  slaLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  slaTime: {
    marginLeft: 'auto',
  },
});
