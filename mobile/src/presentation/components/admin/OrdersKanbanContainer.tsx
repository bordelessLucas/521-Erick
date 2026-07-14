import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { Order } from '@/domain/entities/Order';
import type { ClientAccessCredentials } from '@/domain/entities/Client';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';
import { useAdminOrders } from '@/presentation/hooks/useAdminOrders';
import { ClientCredentialsModal } from './ClientCredentialsModal';
import { CreateOrderModal } from './CreateOrderModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrdersKanbanBoard } from './OrdersKanbanBoard';
import { ManageStagesModal } from './ManageStagesModal';
import { ManageCollaboratorsModal } from './ManageCollaboratorsModal';

export function OrdersKanbanContainer() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageStagesModalOpen, setIsManageStagesModalOpen] = useState(false);
  const [isManageCollaboratorsModalOpen, setIsManageCollaboratorsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newClientCredentials, setNewClientCredentials] =
    useState<ClientAccessCredentials | null>(null);
  const {
    orders,
    isLoading,
    error,
    isMutating,
    lookupClientByCnpj,
    createOrder,
    updateOrderStatus,
  } = useAdminOrders();

  const displayedOrder = selectedOrder
    ? orders.find((order) => order.id === selectedOrder.id) ?? selectedOrder
    : null;

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.pine} />
        <AppText variant="bodySmall" color={colors.muted}>
          Carregando pedidos...
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <AppText variant="bodySmall" color={colors.muted}>
          {orders.length} pedido{orders.length === 1 ? '' : 's'} no quadro
        </AppText>
        <View style={styles.actions}>
          <Button
            title="Etapas"
            variant="secondary"
            size="sm"
            onPress={() => setIsManageStagesModalOpen(true)}
          />
          <Button
            title="Equipe"
            variant="secondary"
            size="sm"
            onPress={() => setIsManageCollaboratorsModalOpen(true)}
          />
          <Button
            title="+ Novo"
            variant="primary"
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
          />
        </View>
      </View>

      {error ? (
        <View style={styles.alert}>
          <AppText variant="bodySmall" color={colors.terra}>
            {error}
          </AppText>
        </View>
      ) : null}

      <OrdersKanbanBoard
        orders={orders}
        onPressOrder={setSelectedOrder}
        onMoveOrder={(orderId, status) => void updateOrderStatus(orderId, status)}
      />

      <OrderDetailsModal
        order={displayedOrder}
        visible={displayedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        onMoveOrder={(orderId, status) => void updateOrderStatus(orderId, status)}
      />

      <CreateOrderModal
        visible={isCreateModalOpen}
        isSubmitting={isMutating}
        onClose={() => setIsCreateModalOpen(false)}
        onLookupClient={lookupClientByCnpj}
        onSubmit={async (data) => {
          const result = await createOrder(data);

          if (result.success && result.newClientCredentials) {
            setNewClientCredentials(result.newClientCredentials);
          }

          return result.success;
        }}
      />

      <ClientCredentialsModal
        credentials={newClientCredentials}
        visible={newClientCredentials !== null}
        onClose={() => setNewClientCredentials(null)}
      />

      <ManageStagesModal
        visible={isManageStagesModalOpen}
        onClose={() => setIsManageStagesModalOpen(false)}
      />

      <ManageCollaboratorsModal
        visible={isManageCollaboratorsModalOpen}
        onClose={() => setIsManageCollaboratorsModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  loading: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  alert: {
    borderWidth: 1,
    borderColor: 'rgba(198, 94, 52, 0.25)',
    backgroundColor: 'rgba(198, 94, 52, 0.08)',
    padding: spacing.sm + 4,
  },
});
