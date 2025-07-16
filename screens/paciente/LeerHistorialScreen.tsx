import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { supabase } from '../../supabase/Config';
import { auth, db } from '../../firebase/Config2';
import { onValue, ref } from 'firebase/database';

export default function LeerHistorialScreen() {
  const [historial, setHistorial] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid;
        const citasRef = ref(db, 'citas_medicas');

        onValue(citasRef, snapshot => {
          const data = snapshot.val();
          if (data) {
            const citasArray = Object.values(data);
            const citasFiltradas = citasArray.filter((cita: any) => cita.idPaciente === uid);
            setHistorial([...citasFiltradas, citaDemo]); 
          } else {
            setHistorial([citaDemo]);
          }
        });
      } else {
        setHistorial([citaDemo]);
      }
    });

    return () => unsubscribe();
  }, []);



  const citaDemo = {
    id: 'demo123',
    fecha: '2025-07-20',
    nombreApellidoPaciente: 'Juan Pérez',
    nombreApellidoDoctor: 'Dra. Ana Torres',
    ubicacionCita: 'Clínica Central - Consultorio 3B',
    motivo: 'Chequeo general anual',
    estado: 'Confirmada',
  };

  return (
    <ImageBackground
      source={require('../../assets/fondo9.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Historial de Citas</Text>
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>Fecha: {item.fecha}</Text>
              <Text style={styles.description}>Paciente: {item.nombreApellidoPaciente}</Text>
            
              <Text style={styles.description}>Doctor: {item.nombreApellidoDoctor}</Text>

              <Text style={styles.description}>Ubicación: {item.ubicacionCita}</Text>

              <Text style={styles.description}>Motivo: {item.motivo}</Text>

              <Text style={styles.description}>Estado: {item.estado}</Text>

            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2793a1ff',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#1ba6beff',
    shadowColor: '#1ba6beff',
    shadowRadius: 2,
    elevation: 1,
      borderWidth: 0.5,      
  borderColor: 'black',
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
    color: 'black',
    marginBottom: 3,
  },
  description: {
    fontSize: 16,
    color: 'black',
    fontWeight: "500",
        marginBottom: 3,

  },
});
