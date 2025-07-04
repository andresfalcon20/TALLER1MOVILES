import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GuardarCitaScreen from '../screens/paciente/GuardarCitaScreen';
import LeerHistorialScreen from '../screens/paciente/LeerHistorialScreen';
import PacienteScreen from '../screens/paciente/PacienteScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Inicio" component={PacienteScreen} />
      <Tab.Screen name="Guardar Cita" component={GuardarCitaScreen} />
      <Tab.Screen name="Historial" component={LeerHistorialScreen} />
    </Tab.Navigator>
  );
}
