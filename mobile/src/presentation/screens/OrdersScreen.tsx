import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Order } from '@/domain/entities/Order';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { OrderCard } from '@/presentation/components/orders/OrderCard';
import { useOrders } from '@/presentation/hooks/useOrders';
import type { RootStackParamList } from '@/presentation/navigation/types';

type OrdersScreenProps = NativeStackScreenProps<RootStackParamList, 'Orders'>;

export function OrdersScreen({ navigation }: OrdersScreenProps) {
  const { orders, isLoading, error, refresh } = useOrders();
  const isRefreshing = isLoading && orders.length > 0;

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const handleOrderPress = useCallback(
    (orderId: string) => {
      navigation.navigate('OrderDetails', { orderId });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<Order> = useCallback(
    ({ item }) => (
      <OrderCard order={item} onPress={() => handleOrderPress(item.id)} />
    ),
    [handleOrderPress],
  );

  if (isLoading && orders.length === 0 && !error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <AppText variant="bodySmall" color={colors.text.secondary} style={styles.loadingText}>
            A carregar pedidos...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (error && orders.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.centered}>
          <AppText variant="body" color={colors.text.secondary} style={styles.errorText}>
            {error}
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ListSeparator}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary.DEFAULT]}
            tintColor={colors.primary.DEFAULT}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <AppText variant="body" color={colors.text.secondary} style={styles.emptyText}>
                Nenhum pedido encontrado.
              </AppText>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.sm,
  },
  errorText: {
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyText: {
    textAlign: 'center',
  },
});
