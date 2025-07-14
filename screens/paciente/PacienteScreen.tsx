import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../firebase/Config2';
import { db } from '../../firebase/Config2';
import { ref, get } from 'firebase/database';

export default function PacienteScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const pacienteRef = ref(db, `paciente/${uid}`);

      get(pacienteRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setNombre(data.nombre || '');
            setNombreUsuario(data.nombreUsuario || '');
            setEmail(data.email || '');
            setEdad(data.edad || '');
          } else {
            Alert.alert('Datos no encontrados', 'No se encontraron datos del paciente.');
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos del paciente:', error);
          Alert.alert('Error', 'No se pudieron obtener los datos del paciente.');
        });
    }
  }, []);

const handleLogout = async () => {
  try {
    await auth.signOut();
    navigation.replace('Login');  
  } catch (error) {
    Alert.alert('Error', 'No se pudo cerrar sesión.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido(a)</Text>

      {nombre !== '' && (
        <View style={styles.userInfo}>
          <Text style={styles.infoText}>Nombre: {nombre}</Text>
          <Text style={styles.infoText}>Usuario: {nombreUsuario}</Text>
          <Text style={styles.infoText}>Correo: {email}</Text>
          <Text style={styles.infoText}>Edad: {edad}</Text>
        </View>
      )}

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

      {/* Botón de cerrar sesión */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FF4B4B' }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
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
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 30,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#17252A',
    marginBottom: 4,
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
