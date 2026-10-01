import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text } from 'react-native';

import DaftarScreen from './src/screens/DaftarScreen';
import TambahScreen from './src/screens/TambahScreen';
import DetailScreen from './src/screens/DetailScreen';
import UbahScreen   from './src/screens/UbahScreen';
import { COLORS } from './src/utils/constants';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={COLORS.surface} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Daftar"
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.surface,
            },
            headerTintColor: COLORS.onSurface,
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '700',
              color: COLORS.onSurface,
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: COLORS.surface },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="Daftar"
            component={DaftarScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tambah"
            component={TambahScreen}
            options={({ navigation }) => ({
              title: 'Tambah Pengelua ran',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
                  <Text style={{ fontSize: 24, color: COLORS.onSurface }}>‹</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={({ navigation }) => ({
              title: 'Detail Pengeluaran',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
                  <Text style={{ fontSize: 24, color: COLORS.onSurface }}>‹</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Ubah"
            component={UbahScreen}
            options={({ navigation }) => ({
              title: 'Ubah Pengeluaran',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
                  <Text style={{ fontSize: 24, color: COLORS.onSurface }}>‹</Text>
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}