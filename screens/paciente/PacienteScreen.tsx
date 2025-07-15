import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/Config2';
import { get, ref } from 'firebase/database';

export default function PerfilPacienteScreen({ navigation }: any) {
  const [paciente, setPaciente] = useState<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const pacienteRef = ref(db, `paciente/${uid}`);

      get(pacienteRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setPaciente(snapshot.val());
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
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  if (!paciente) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/foto-gratis/estetoscopio-sobre-fondo-azul_23-2148195295.jpg' }}
      style={styles.background}
      blurRadius={1}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.bienvenida}>Bienvenido(a)</Text>
        <Text style={styles.nombre}>{paciente.nombre}</Text>

        {paciente.imagen && (
          <Image source={{ uri: paciente.imagen }} style={styles.img} />
        )}

        <View style={styles.card}>
          <Text style={styles.label}>Nombre completo:</Text>
          <Text style={styles.valor}>{paciente.nombre}</Text>

          <Text style={styles.label}>Nombre de usuario:</Text>
          <Text style={styles.valor}>{paciente.nombreUsuario}</Text>

          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.valor}>{paciente.email}</Text>

          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.valor}>{paciente.edad} años</Text>
        </View>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Guardar Cita')}>
          <Text style={styles.textoBoton}>Nueva Cita</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Historial')}>
          <Text style={styles.textoBoton}>Historial de Citas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.botonCerrar]} onPress={handleLogout}>
          <Text style={styles.textoBoton}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#DFF6F4',
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bienvenida: {
    fontSize: 22,
    color: '#4CAEA9',
    marginBottom: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  nombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B7A78',
    textAlign: 'center',
    marginBottom: 10,
  },
  img: {
    width: 150,
    height: 150,
    marginVertical: 20,
    borderRadius: 80,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#3AAFA9',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    elevation: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#20504F',
    marginTop: 12,
  },
  valor: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  boton: {
    backgroundColor: '#2B7A78',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  botonCerrar: {
    backgroundColor: '#C70039',
    marginBottom: 60,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 60,
  },
});
