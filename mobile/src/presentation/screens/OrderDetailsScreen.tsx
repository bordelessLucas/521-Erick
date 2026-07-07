import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, borderRadius, spacing } from '@/core/theme';
import { formatCurrency, formatDate, formatWeight } from '@/core/utils/format';
import { AppText } from '@/presentation/components/ui/Text';
import { OrderStatusBadge } from '@/presentation/components/orders/OrderStatusBadge';
import { useOrderDetails } from '@/presentation/hooks/useOrderDetails';
import type { RootStackParamList } from '@/presentation/navigation/types';

type OrderDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

export function OrderDetailsScreen({ route }: OrderDetailsScreenProps) {
  const { order, isLoading, error } = useOrderDetails(route.params.orderId);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.container, styles.centered]}>
        <AppText variant="body" color={colors.text.secondary}>
          {error ?? 'Pedido não encontrado.'}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <AppText variant="h3" style={styles.orderId}>
            {order.id}
          </AppText>
          <OrderStatusBadge status={order.status} />
        </View>

        <View style={styles.details}>
          <DetailRow label="Data" value={formatDate(order.orderDate)} />
          <DetailRow label="Peso Total" value={formatWeight(order.weightInKg)} />
          <DetailRow label="Valor Estimado" value={formatCurrency(order.estimatedValue)} />
          <DetailRow label="CNPJ" value={order.clientCnpj} />
        </View>
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText variant="caption" color={colors.text.secondary}>
        {label}
      </AppText>
      <AppText variant="body" style={styles.detailValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  orderId: {
    color: colors.primary.DEFAULT,
  },
  details: {
    gap: spacing.md,
  },
  detailRow: {
    gap: spacing.xs,
  },
  detailValue: {
    fontWeight: '600',
  },
});
