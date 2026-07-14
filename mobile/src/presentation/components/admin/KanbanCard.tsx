import { Alert, Pressable, StyleSheet, View } from 'react-native';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { colors, spacing } from '@/core/theme';
import { formatCurrency, formatDate, formatWeight } from '@/core/utils/format';
import { AppText } from '@/presentation/components/ui/Text';
import { usePipelineStages } from '@/presentation/context/PipelineStagesContext';

interface KanbanCardProps {
  order: Order;
  onPress: (order: Order) => void;
  onMoveOrder: (orderId: string, status: OrderStatus) => void;
}

function shortenOrderId(orderId: string): string {
  return orderId.length > 8 ? `#${orderId.slice(0, 8)}` : `#${orderId}`;
}

export function KanbanCard({ order, onPress, onMoveOrder }: KanbanCardProps) {
  const { stages } = usePipelineStages();

  const handleLongPress = () => {
    Alert.alert(
      'Mover pedido',
      'Selecione a nova etapa:',
      [
        ...stages.map((step) => ({
          text: step.shortLabel,
          onPress: () => onMoveOrder(order.id, step.id),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  };

  return (
    <Pressable
      onPress={() => onPress(order)}
      onLongPress={handleLongPress}
      style={styles.card}
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
});
