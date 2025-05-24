import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MapScreen from './src/screens/MapScreen';
import NewReportScreen from './src/screens/ReportScreen';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen}  options={{ headerShown: false }} />
          <Stack.Screen name="Map" component={MapScreen}  options={{ headerShown: false }} />
          <Stack.Screen name="Report" component={NewReportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
