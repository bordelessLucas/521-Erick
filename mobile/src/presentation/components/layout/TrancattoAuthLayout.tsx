import type { ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';

interface TrancattoAuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function TrancattoAuthLayout({ title, subtitle, children }: TrancattoAuthLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../../../assets/images/trancatto-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Trançatto"
          />

          <View style={styles.card}>
            <AppText variant="eyebrow" color={colors.label} style={styles.eyebrow}>
              Portal do cliente
            </AppText>
            <AppText variant="h2" color={colors.ink} style={styles.title}>
              {title}
            </AppText>
            <AppText variant="bodySmall" color={colors.muted} style={styles.subtitle}>
              {subtitle}
            </AppText>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logo: {
    width: 180,
    height: 52,
    alignSelf: 'center',
    marginBottom: spacing.lg,
    tintColor: colors.ink,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
  },
  eyebrow: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
});
