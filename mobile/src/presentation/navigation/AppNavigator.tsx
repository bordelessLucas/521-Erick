import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/presentation/screens/HomeScreen';
import { OrdersScreen } from '@/presentation/screens/OrdersScreen';
import { OrderDetailsScreen } from '@/presentation/screens/OrderDetailsScreen';
import { colors } from '@/core/theme';
import type { RootStackParamList } from '@/presentation/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  onLogout: () => void;
}

export function AppNavigator({ onLogout }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background.secondary },
          headerTintColor: colors.primary.DEFAULT,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      >
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <HomeScreen {...props} onLogout={onLogout} />}
        </Stack.Screen>
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{ title: 'Meus Pedidos' }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailsScreen}
          options={{ title: 'Detalhes do Pedido' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
