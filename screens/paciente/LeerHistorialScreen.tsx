import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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
            setHistorial(citasFiltradas);
          } else {
            setHistorial([]);
          }
        });
      } else {
        setHistorial([]);
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF6F4',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B7A78',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#2B7A78',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#20504F',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#333',
  },
});
