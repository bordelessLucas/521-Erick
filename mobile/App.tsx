import { useState } from 'react';
import { LoginScreen } from '@/presentation/screens/LoginScreen';
import { RegisterScreen } from '@/presentation/screens/RegisterScreen';
import { AppNavigator } from '@/presentation/navigation/AppNavigator';

type AuthScreen = 'login' | 'register';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onRegisterSuccess={() => setIsAuthenticated(true)}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }

    return (
      <LoginScreen
        onLoginSuccess={() => setIsAuthenticated(true)}
        onNavigateToRegister={() => setAuthScreen('register')}
      />
    );
  }

  return <AppNavigator onLogout={() => setIsAuthenticated(false)} />;
}
