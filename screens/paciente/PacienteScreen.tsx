import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity,} from 'react-native';


export default function PacienteScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido(a)</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Guardar Cita')}
      >
        <Text style={styles.buttonText}>Nueva Cita</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Historial')}
      >
        <Text style={styles.buttonText}>Ver Historial de Citas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF6F4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2B7A78',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2B7A78',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
