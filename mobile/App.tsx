import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Manrope_300Light, Manrope_500Medium } from '@expo-google-fonts/manrope';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/core/theme';
import { AuthProvider, useAuth } from '@/presentation/context/AuthContext';
import { AppNavigator } from '@/presentation/navigation/AppNavigator';
import { LoginScreen } from '@/presentation/screens/LoginScreen';
import { RegisterScreen } from '@/presentation/screens/RegisterScreen';

type AuthScreen = 'login' | 'register';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.pine} />
      </View>
    );
  }

  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen onNavigateToLogin={() => setAuthScreen('login')} />
      );
    }

    return (
      <LoginScreen onNavigateToRegister={() => setAuthScreen('register')} />
    );
  }

  return <AppNavigator />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    Manrope_300Light,
    Manrope_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.pine} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
});
