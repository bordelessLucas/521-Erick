import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';
import { colors, spacing } from '@/core/theme';
import type { RootStackParamList } from '@/presentation/navigation/types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  onLogout: () => void;
};

export function HomeScreen({ navigation, onLogout }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <AppText variant="caption" color={colors.primary.DEFAULT}>
              Portal B2B
            </AppText>
          </View>
          <AppText variant="h1" style={styles.title}>
            Os seus pedidos
          </AppText>
          <AppText variant="body" color={colors.text.secondary} style={styles.subtitle}>
            Acompanhe a produção, separação e faturação das suas cordas industriais.
          </AppText>
        </View>

        <View style={styles.actions}>
          <Button
            title="Ver pedidos"
            variant="secondary"
            fullWidth
            onPress={() => navigation.navigate('Orders')}
          />
          <Button title="Terminar sessão" variant="outline" fullWidth onPress={onLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    maxWidth: 320,
  },
  actions: {
    gap: spacing.sm,
  },
});
