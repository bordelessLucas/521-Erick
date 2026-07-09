import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { OrderTrackingPanel } from '@/presentation/components/orders/OrderTrackingPanel';
import { useOrderDetails } from '@/presentation/hooks/useOrderDetails';
import type { RootStackParamList } from '@/presentation/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

export function OrderTrackingScreen({ route }: Props) {
  const { order, isLoading, error } = useOrderDetails(route.params.orderId);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.pine} />
          <AppText variant="bodySmall" color={colors.muted}>
            Carregando pedido...
          </AppText>
        </View>
      ) : error || !order ? (
        <View style={styles.center}>
          <AppText variant="body" color={colors.terra}>
            {error ?? 'Pedido não encontrado.'}
          </AppText>
        </View>
      ) : (
        <OrderTrackingPanel order={order} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  center: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    gap: spacing.sm,
  },
});
