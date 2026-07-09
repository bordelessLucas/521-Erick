import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';
import { OrderTrackingPanel } from '@/presentation/components/orders/OrderTrackingPanel';
import { ORDER_TIMELINE_STEPS } from '@/presentation/components/orders/orderTimelineSteps';

interface OrderDetailsModalProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
  onMoveOrder: (orderId: string, status: OrderStatus) => void;
}

export function OrderDetailsModal({
  order,
  visible,
  onClose,
  onMoveOrder,
}: OrderDetailsModalProps) {
  if (!order) {
    return null;
  }

  const handleMoveOrder = () => {
    Alert.alert(
      'Mover pedido',
      'Selecione a nova etapa:',
      [
        ...ORDER_TIMELINE_STEPS.map((step) => ({
          text: step.shortLabel,
          onPress: () => {
            onMoveOrder(order.id, step.status);
            onClose();
          },
        })),
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <View>
              <AppText variant="eyebrow" color={colors.label}>
                Detalhes do pedido
              </AppText>
              <AppText variant="h3" color={colors.ink}>
                {order.id}
              </AppText>
            </View>
            <Pressable onPress={onClose} accessibilityLabel="Fechar">
              <AppText variant="h3" color={colors.muted}>
                ×
              </AppText>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <OrderTrackingPanel order={order} />
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Mover etapa"
              variant="outline"
              onPress={handleMoveOrder}
              style={styles.footerButton}
            />
            <Button
              title="Fechar"
              variant="primary"
              onPress={onClose}
              style={styles.footerButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 20, 18, 0.45)',
    justifyContent: 'flex-end',
  },
  dialog: {
    maxHeight: '92%',
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderColor: colors.line,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  footerButton: {
    flex: 1,
  },
});
