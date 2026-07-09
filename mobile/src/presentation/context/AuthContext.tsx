import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/core/config/firebase';
import { container } from '@/infrastructure/di/container';
import {
  isCurrentUserAdmin,
  resolvePostAuthRoute,
  type UserRole,
} from '@/infrastructure/firebase/FirebaseUserProfileRepository';

type AuthRoute = 'Admin' | 'Dashboard';

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  initialRoute: AuthRoute;
  refreshRole: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialRoute, setInitialRoute] = useState<AuthRoute>('Dashboard');

  const refreshRole = useCallback(async () => {
    const admin = await isCurrentUserAdmin();
    const route = await resolvePostAuthRoute();
    setIsAdmin(admin);
    setInitialRoute(route);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      void (async () => {
        if (!user) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setInitialRoute('Dashboard');
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        try {
          await refreshRole();
        } catch {
          setIsAdmin(false);
          setInitialRoute('Dashboard');
        } finally {
          setIsLoading(false);
        }
      })();
    });

    return unsubscribe;
  }, [refreshRole]);

  const signOut = useCallback(async () => {
    await container.getAuthService().logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setInitialRoute('Dashboard');
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      isAdmin,
      initialRoute,
      refreshRole,
      signOut,
    }),
    [isLoading, isAuthenticated, isAdmin, initialRoute, refreshRole, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
