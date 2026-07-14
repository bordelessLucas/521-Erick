import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing } from '@/core/theme';
import { formatCurrency, formatDate } from '@/core/utils/format';
import { isCurrentUserAdmin } from '@/infrastructure/firebase/FirebaseUserProfileRepository';
import { AppText } from '@/presentation/components/ui/Text';
import { TrancattoPortalHeader } from '@/presentation/components/layout/TrancattoPortalHeader';
import { useOrders } from '@/presentation/hooks/useOrders';
import { useAuth } from '@/presentation/context/AuthContext';
import { usePipelineStages } from '@/presentation/context/PipelineStagesContext';
import type { RootStackParamList } from '@/presentation/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { orders, isLoading, error, refresh } = useOrders();
  const { stages } = usePipelineStages();

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) => order.id.toLowerCase().includes(query));
  }, [orders, searchQuery]);

  useEffect(() => {
    void (async () => {
      const isAdmin = await isCurrentUserAdmin();
      if (isAdmin) {
        navigation.replace('Admin');
      }
    })();
  }, [navigation]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View style={styles.screen}>
      <TrancattoPortalHeader
        portalLabel="Portal do cliente"
        onSignOut={() => void handleSignOut()}
        isSigningOut={isSigningOut}
      />

      <View style={styles.intro}>
        <AppText variant="eyebrow" color={colors.label}>
          Rastreamento
        </AppText>
        <AppText variant="h1" color={colors.ink}>
          Meus pedidos
        </AppText>
        <AppText variant="bodySmall" color={colors.muted}>
          Acompanhe cada etapa da produção com a mesma clareza de um rastreamento de entrega.
        </AppText>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar pedido..."
        placeholderTextColor={colors.label}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.pine} />
          <AppText variant="bodySmall" color={colors.muted}>
            Carregando pedidos...
          </AppText>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <AppText variant="body" color={colors.terra} style={styles.centerText}>
            {error}
          </AppText>
          <Pressable onPress={() => void refresh()} style={styles.retryButton}>
            <AppText variant="bodySmall" color={colors.pine} style={styles.retryText}>
              Tentar novamente
            </AppText>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => void refresh()}
              tintColor={colors.pine}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <AppText variant="body" color={colors.ink} style={styles.emptyTitle}>
                Nenhum pedido encontrado
              </AppText>
              <AppText variant="bodySmall" color={colors.muted} style={styles.centerText}>
                {searchQuery.trim()
                  ? 'Tente pesquisar com outro número de pedido.'
                  : 'Ainda não há pedidos vinculados à sua conta.'}
              </AppText>
            </View>
          }
          renderItem={({ item }) => {
            const activeStage = stages.find((s) => s.id === item.status) || stages[0];
            const statusLabel = activeStage?.shortLabel || item.status;
            const statusTitle = activeStage?.label || item.status;

            return (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
            >
              <View style={styles.cardTop}>
                <AppText variant="caption" color={colors.pine} style={styles.cardId}>
                  {item.id}
                </AppText>
                <AppText variant="caption" color={colors.label}>
                  {statusLabel}
                </AppText>
              </View>
              <AppText variant="bodySmall" color={colors.ink}>
                {statusTitle}
              </AppText>
              <View style={styles.cardMeta}>
                <AppText variant="caption" color={colors.muted}>
                  {formatDate(item.orderDate)}
                </AppText>
                <AppText variant="caption" color={colors.muted}>
                  {formatCurrency(item.estimatedValue)}
                </AppText>
              </View>
            </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  search: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardId: {
    fontWeight: '700',
    flex: 1,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  center: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  centerText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyTitle: {
    fontWeight: '600',
  },
  retryButton: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  retryText: {
    fontWeight: '600',
  },
});
