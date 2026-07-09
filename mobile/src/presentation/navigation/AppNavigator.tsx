import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/core/theme';
import { useAuth } from '@/presentation/context/AuthContext';
import { DashboardScreen } from '@/presentation/screens/DashboardScreen';
import { OrderTrackingScreen } from '@/presentation/screens/OrderTrackingScreen';
import { AdminScreen } from '@/presentation/screens/AdminScreen';
import type { RootStackParamList } from '@/presentation/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { isLoading, initialRoute } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.pine} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.pine,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{ title: 'Rastreamento' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
