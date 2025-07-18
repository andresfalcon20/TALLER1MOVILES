import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Modal, Alert } from 'react-native';
import { supabase } from '../../supabase/Config';
import { auth, db } from '../../firebase/Config2';
import { onValue, ref, update } from 'firebase/database';

export default function LeerHistorialScreen() {
  const [historial, setHistorial] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<any | null>(null);
  const [calificacion, setCalificacion] = useState<number>(0);

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

  function abrirModal(cita: any) {
    setCitaSeleccionada(cita);
    setCalificacion(0);
    setModalVisible(true);
  }

  async function guardarCalificacion() {
    if (!citaSeleccionada) return;

    if (calificacion < 1 || calificacion > 5) {
      Alert.alert('Error', 'Por favor, seleccione una calificación entre 1 y 5.');
      return;
    }

    try {
      const citaRef = ref(db, `citas_medicas/${citaSeleccionada.id}`);
      await update(citaRef, { calificacionDoctor: calificacion });

      const { error } = await supabase
        .from('citaMedica')
        .update({ calificacionDoctor: calificacion })
        .eq('id', citaSeleccionada.id);

      if (error) {
        Alert.alert('Error', 'No se pudo guardar la calificación en Supabase: ' + error.message);
        return;
      }

      Alert.alert('Éxito', 'Calificación guardada correctamente.');
      setModalVisible(false);
      setCitaSeleccionada(null);
      setCalificacion(0);

    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error al guardar la calificación.');
      console.error(e);
    }
  }

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

              {item.estado === 'TERMINADO' && (
                <TouchableOpacity
                  style={styles.botonCalificar}
                  onPress={() => abrirModal(item)}
                >
                  <Text style={styles.textoBoton}>Calificar Doctor</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalFondo}>
            <View style={styles.modalContenedor}>
              <Text style={styles.modalTitulo}>Calificar Doctor</Text>
              <Text>Seleccione una calificación de 1 a 5:</Text>

              <View style={styles.estrellasContainer}>
                {[1, 2, 3, 4, 5].map(n => (
                  <TouchableOpacity key={n} onPress={() => setCalificacion(n)}>
                    <Text style={[styles.estrella, calificacion >= n ? styles.estrellaActiva : styles.estrellaInactiva]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalBotones}>
                <TouchableOpacity style={styles.botonGuardar} onPress={guardarCalificacion}>
                  <Text style={styles.textoBoton}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonCancelar} onPress={() => setModalVisible(false)}>
                  <Text style={styles.textoBoton}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  botonCalificar: {
    marginTop: 10,
    backgroundColor: '#2793a1ff',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContenedor: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  estrellasContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  estrella: {
    fontSize: 32,
    marginHorizontal: 8,
  },
  estrellaActiva: {
    color: '#FFD700',
  },
  estrellaInactiva: {
    color: '#ccc',
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  botonGuardar: {
    backgroundColor: '#2793a1ff',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  botonCancelar: {
    backgroundColor: '#aaa',
    padding: 12,
    borderRadius: 6,
    flex: 1,
  },
});