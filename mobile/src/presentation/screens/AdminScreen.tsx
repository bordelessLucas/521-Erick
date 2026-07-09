import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/core/theme';
import { isCurrentUserAdmin } from '@/infrastructure/firebase/FirebaseUserProfileRepository';
import { AppText } from '@/presentation/components/ui/Text';
import { TrancattoPortalHeader } from '@/presentation/components/layout/TrancattoPortalHeader';
import { OrdersKanbanContainer } from '@/presentation/components/admin/OrdersKanbanContainer';
import { useAuth } from '@/presentation/context/AuthContext';

export function AdminScreen() {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      const isAdmin = await isCurrentUserAdmin();
      setIsAuthorized(isAdmin);
    })();
  }, []);

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
        portalLabel="Painel interno"
        onSignOut={() => void handleSignOut()}
        isSigningOut={isSigningOut}
      />

      {isAuthorized === null ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.pine} />
          <AppText variant="bodySmall" color={colors.muted}>
            Verificando permissões...
          </AppText>
        </View>
      ) : !isAuthorized ? (
        <View style={styles.loading}>
          <AppText variant="body" color={colors.terra}>
            Você não tem permissão para acessar o painel interno.
          </AppText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.intro}>
            <AppText variant="eyebrow" color={colors.label}>
              Operações
            </AppText>
            <AppText variant="h1" color={colors.ink}>
              Quadro de pedidos
            </AppText>
            <AppText variant="bodySmall" color={colors.muted}>
              Cadastre novos pedidos, toque em um card para ver detalhes ou mantenha pressionado para movê-lo.
            </AppText>
          </View>

          <OrdersKanbanContainer />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
    gap: spacing.lg,
  },
  intro: {
    gap: spacing.xs,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
});
