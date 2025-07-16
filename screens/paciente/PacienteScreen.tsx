import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/Config';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/Config2';

type Paciente = {
  nombre: string;
  edad: string;
  nombreUsuario: string;
  correo: string;
  imagen: string;
};

export default function PerfilPacienteScreen({ navigation }: any) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    async function cargarDatosPaciente() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("No se pudo obtener el usuario:", userError?.message);
        return;
      }

      const { data, error } = await supabase
        .from('paciente')
        .select(`
          nombre,
          edad,
          nombreUsuario:usuario,
          correo,
          imagen
        `)
        .eq('correo', user.email)
        .maybeSingle();

      if (error) {
        console.error('Error al cargar paciente:', error.message);
        Alert.alert('Error', 'No se pudo cargar el perfil del paciente.');
        return;
      }

      if (!data) {
        Alert.alert('Advertencia', 'No se encontraron datos del paciente.');
        return;
      }

      setPaciente({
        nombre: data.nombre,
        edad: data.edad,
        nombreUsuario: data.nombreUsuario,
        correo: data.correo,
        imagen: data.imagen ?? '',
      });
    }

    cargarDatosPaciente();
  }, []);

  const handleLogout = async () => {
    try {
      // Cierra sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error', 'No se pudo cerrar sesión en Supabase.');
        return;
      }

      // Cierra sesión en Firebase
      await signOut(auth);

      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert('Error', `No se pudo cerrar sesión: ${error.message}`);
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
      source={require('../../assets/fondo6.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.bienvenida}>Bienvenido(a)</Text>
        <Text style={styles.nombre}>{paciente.nombre}</Text>

        {paciente.imagen ? (
          <Image source={{ uri: paciente.imagen }} style={styles.img} />
        ) : (
          <Text style={{ color: '#666', marginVertical: 10 }}>Sin imagen de perfil</Text>
        )}

        <View style={styles.card}>
          <Text style={styles.label}>Nombre completo:</Text>
          <Text style={styles.valor}>{paciente.nombre}</Text>

          <Text style={styles.label}>Nombre de usuario:</Text>
          <Text style={styles.valor}>{paciente.nombreUsuario}</Text>

          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.valor}>{paciente.correo}</Text>

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
    width: '100%',
    height: '100%',
  },
  container: {
    padding: 24,
    borderRadius: 14,
    paddingBottom: 20
  },
  bienvenida: {
    fontSize: 22,
    color: '#27918bff',
    marginBottom: 6,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 5,
    marginTop: 40
  },
  nombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a7c79ff',
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
    borderColor: '#27918bff'
  },
  card: {
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    textAlign: "center",
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#20504F',
    marginTop: 12,
    textAlign: "center"
  },
  valor: {
    fontSize: 17,
    color: 'black',
    marginTop: 4,
    textAlign: "center"
  },
  boton: {
    backgroundColor: '#32a8a4ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  botonCerrar: {
    backgroundColor: '#b12a50ff',
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
