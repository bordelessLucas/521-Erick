import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';

interface TrancattoPortalHeaderProps {
  portalLabel?: string;
  onSignOut?: () => void;
  isSigningOut?: boolean;
}

export function TrancattoPortalHeader({
  portalLabel = 'Portal do cliente',
  onSignOut,
  isSigningOut = false,
}: TrancattoPortalHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/images/trancatto-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Trançatto"
        />

        <View style={styles.actions}>
          <AppText variant="eyebrow" color={colors.label}>
            {portalLabel}
          </AppText>
          {onSignOut && (
            <Pressable
              onPress={onSignOut}
              disabled={isSigningOut}
              style={styles.logoutButton}
              accessibilityRole="button"
            >
              <AppText variant="bodySmall" color={colors.ink} style={styles.logoutText}>
                {isSigningOut ? 'Saindo...' : 'Sair'}
              </AppText>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  logo: {
    width: 140,
    height: 40,
    tintColor: colors.ink,
  },
  actions: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
  },
  logoutText: {
    fontWeight: '600',
  },
});
