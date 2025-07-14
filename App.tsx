import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import login from './screens/login';
import RegistroPacienteScreen from './screens/RegistroPacienteScreen';
import TabNavigator from './navigations/TabNavigator';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="Login"
          component={login}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Registro paciente" component={RegistroPacienteScreen} />
        <Stack.Screen options={{ headerShown: false }} name="PacienteScreen" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
