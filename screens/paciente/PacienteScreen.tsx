import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text,
TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/Config2';
import { get, ref } from 'firebase/database';
import { supabase } from '../../supabase/Config'; 

export default function PacienteScreen({ navigation }: any) {
  const [paciente, setPaciente] = useState<any>(null);
  const [promedioCalificaciones, setPromedioCalificaciones] = useState<number | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const pacienteRef = ref(db, `paciente/${uid}`);

      get(pacienteRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setPaciente(snapshot.val());
            cargarPromedioCalificacion(uid);
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

  async function cargarPromedioCalificacion(pacienteId: string) {
    const { data, error } = await supabase
      .from('citaMedica')
      .select('calificacionPaciente')
      .eq('paciente_id', pacienteId)
      .not('calificacionPaciente', 'is', null);

    if (error) {
      console.error('Error al obtener calificaciones:', error.message);
      setPromedioCalificaciones(null);
      return;
    }

    if (!data || data.length === 0) {
      setPromedioCalificaciones(null);
      return;
    }

    const calificacionesNumericas = data
      .map(item => {
        const val = item.calificacionPaciente?.toString().trim();
        const num = Number(val);
        return val && !isNaN(num) ? num : null;
      })
      .filter((num): num is number => num !== null);

    if (calificacionesNumericas.length === 0) {
      setPromedioCalificaciones(null);
      return;
    }

    const suma = calificacionesNumericas.reduce((acc, val) => acc + val, 0);
    const promedio = suma / calificacionesNumericas.length;
    setPromedioCalificaciones(promedio);
  }

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
      source={require('../../assets/fondo6.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.bienvenida}>Bienvenido(a)</Text>
        <Text style={styles.nombre}>{paciente.nombre}</Text>

        {paciente.imagen && (
          <View style={styles.imgContainer}>
            <Image source={{ uri: paciente.imagen }} style={styles.img} />
          </View>
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

          {promedioCalificaciones !== null ? (
            <>
              <Text style={styles.label}>Promedio que has dado a doctores:</Text>
              <Text style={styles.valor}>{promedioCalificaciones.toFixed(1)} ⭐</Text>
            </>
          ) : (
            <Text style={styles.label}>No has calificado doctores aún.</Text>
          )}
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  bienvenida: {
    fontSize: 22,
    color: '#27918bff',
    marginBottom: 6,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 5,
    marginTop: 40,
  },
  nombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a7c79ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  imgContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 80,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#1a7c79ff',
  },
  card: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#ffffffdd',
    borderRadius: 10,
    width: '100%',
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#20504F',
    marginTop: 12,
    textAlign: 'center',
  },
  valor: {
    fontSize: 17,
    color: 'black',
    marginTop: 4,
    textAlign: 'center',
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