import { Alert, Button, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';

import { Picker } from '@react-native-picker/picker'
import { supabase } from '../../supabase/Config'
import { ref, set } from 'firebase/database'
import { db } from '../../firebase/Config2'
import { auth } from '../../firebase/Config2'

//mapa
import { Pressable } from 'react-native'; 
import MapView, { Marker } from 'react-native-maps';


export default function GuardarCitaMedica() {

  const [idPaciente, setIdPaciente] = useState('')

  const [nombreApellidoPaciente, setNombreApellidoPaciente] = useState('')
  const [cedula, setCedula] = useState('')
  const [edad, setEdad] = useState('')
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [telefono, setTelefono] = useState('')
  const [tipoSangre, setTipoSangre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [motivo, setMotivo] = useState('')
  const [estado, setEstado] = useState('')
  const [fecha, setFecha] = useState('')
  const [ubicacionCita, setUbicacionCita] = useState('')

  const [listaEspecialidades, setListaEspecialidades] = useState<any[]>([])
  const [listaDoctores, setListaDoctores] = useState<any[]>([])

  const [especialidad_id, setEspecialidadRequerida] = useState('')
  const [idDoctorSeleccionado, setIdDoctorSeleccionado] = useState('')
  const [image, setImage] = useState<string | null>(null);


//modal
const [modalVisible, setModalVisible] = useState(false);
const [markerCoords, setMarkerCoords] = useState({
  latitude: -0.180653,
  longitude: -78.467829,
});





  useEffect(() => {
    if (especialidad_id) {
      cargarDoctoresPorEspecialidad(especialidad_id);
    } else {
      setListaDoctores([]);
    }
  }, [especialidad_id]);

  async function cargarDoctoresPorEspecialidad(idEspecialidad: string) {
    const { data, error } = await supabase
      .from('doctor')
      .select('id, nombreApellido')
      .eq('especialidad_id', idEspecialidad);

    if (error) {
      Alert.alert('Error al filtrar doctores', error.message);
      return;
    }

    setListaDoctores(data || []);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIdPaciente(user.uid)
      } else {
        setIdPaciente('')
      }
    })

    cargarEspecialidades()

    return () => unsubscribe()
  }, [])

  async function cargarEspecialidades() {
    const { data, error } = await supabase
      .from('especialidad')
      .select('*')
      .order('nombre_especialidad', { ascending: true })
    if (error) {
      Alert.alert('Error al cargar especialidades', error.message)
    } else {
      setListaEspecialidades(data || [])
    }
  }

  const guardarCita = async () => {
    if (!nombreApellidoPaciente.trim() || !cedula.trim() || !especialidad_id || !idDoctorSeleccionado) {
      Alert.alert('Campos requeridos', 'Complete nombre, cédula, especialidad y doctor.')
      return
    }

    if (!idPaciente) {
      Alert.alert('Error', 'Usuario no autenticado en Firebase.')
      return
    }

    // 1. Obtener nombre del doctor
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctor')
      .select('nombreApellido')
      .eq('id', idDoctorSeleccionado)
      .single();

    if (doctorError || !doctorData) {
      Alert.alert('Error', 'No se pudo obtener el nombre del doctor.')
      return
    }

    const nombreApellidoDoctor = doctorData.nombreApellido;

    const datosCita = {
      nombreApellidoPaciente,
      cedula,
      edad,
      correoElectronico,
      telefono,
      tipoSangre,
      direccion,
      especialidad_id,
      motivo,
      doctor_id: idDoctorSeleccionado,
      estado: "PENDIENTE",
      fecha,
      ubicacionCita,
    }

    try {
      // 2. Insertar en Supabase
      const { data, error } = await supabase.from('citaMedica').insert([datosCita]).select();
      if (error) {
        console.error('Error Supabase:', error.message);
        Alert.alert('Error en Supabase', error.message);
        return;
      }

      const idGenerado = data?.[0]?.id;
      if (!idGenerado) {
        Alert.alert('Error', 'No se pudo obtener el ID de la cita.')
        return
      }

      // 3. Insertar en Firebase
      const citaRef = ref(db, `citas_medicas/${idGenerado}`)
      await set(citaRef, {
        ...datosCita,
        id: idGenerado,
        idPaciente: idPaciente,
        nombreApellidoDoctor, 
      })

      Alert.alert('Éxito', 'Cita médica registrada en ambas bases de datos.')
      limpiarCampos()
    } catch (err) {
      console.error('Error general:', err)
      Alert.alert('Error', 'Ocurrió un problema al guardar la cita.')
    }
  }

  function limpiarCampos() {
    setNombreApellidoPaciente('')
    setCedula('')
    setEdad('')
    setCorreoElectronico('')
    setTelefono('')
    setTipoSangre('')
    setDireccion('')
    setMotivo('')
    setEstado('')
    setFecha('')
    setUbicacionCita('')
    setEspecialidadRequerida('')
    setIdDoctorSeleccionado('')
  }









  return (

    <ImageBackground
      source={require('../../assets/fondo.jpg')}
      resizeMode="cover"
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.titulo}>Registrar Cita Médica</Text>

          <Text style={styles.label}>Nombre del paciente</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del paciente"
            value={nombreApellidoPaciente}
            onChangeText={setNombreApellidoPaciente}
          />

          <Text style={styles.label}>Cédula</Text>
          <TextInput
            style={styles.input}
            placeholder="Cédula"
            value={cedula}
            keyboardType='numeric'
            onChangeText={setCedula}
          />

          <Text style={styles.label}>Edad</Text>
          <TextInput
            style={styles.input}
            placeholder="Edad"
            keyboardType='numeric'
            value={edad}
            onChangeText={setEdad}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType='email-address'
            value={correoElectronico}
            onChangeText={setCorreoElectronico}
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            keyboardType='number-pad'
            value={telefono}
            onChangeText={setTelefono}
          />

          <Text style={styles.label}>Tipo de sangre</Text>
          <TextInput
            style={styles.input}
            placeholder="Tipo de sangre"
            value={tipoSangre}
            onChangeText={setTipoSangre}
          />

          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={direccion}
            onChangeText={setDireccion}
          />

          <Text style={styles.label}>Seleccione Especialidad</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={especialidad_id}
              onValueChange={(value) => setEspecialidadRequerida(value)}
              itemStyle={{ fontSize: 16 }}
            >
              <Picker.Item label="Seleccione una especialidad" value="" />
              {listaEspecialidades.map((item) => (
                <Picker.Item key={item.id} label={item.nombre_especialidad} value={item.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Seleccione Doctor</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={idDoctorSeleccionado}
              onValueChange={(value) => setIdDoctorSeleccionado(value)}
              itemStyle={{ fontSize: 16 }}
            >
              <Picker.Item label="Seleccione un doctor" value="" />
              {listaDoctores.map((item) => (
                <Picker.Item key={item.id} label={item.nombreApellido} value={item.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Motivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Motivo"
            value={motivo}
            onChangeText={setMotivo}
          />

          <Text style={styles.label}>Fecha</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha"
            value={fecha}
            onChangeText={setFecha}
          />



      <Text style={styles.label}>Ubicación</Text>
<TextInput
  style={styles.input}
  placeholder="Ubicación"
  value={ubicacionCita}
  editable={false}
/>

<TouchableOpacity style={styles.boton1} onPress={() => setModalVisible(true)}>
  <Text style={styles.btnText}>Seleccionar ubicación en mapa</Text>
</TouchableOpacity>

       


          <TouchableOpacity style={styles.boton} onPress={guardarCita}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Guardar Cita</Text>
            </View>
          </TouchableOpacity>



{/* Mapa */}
<Modal visible={modalVisible} animationType="slide">
  <View style={{ flex: 1 }}>
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: markerCoords.latitude,
        longitude: markerCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={(e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarkerCoords({ latitude, longitude });
      }}
    >
      <Marker coordinate={markerCoords} />
    </MapView>
    <View style={{ padding: 10 }}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          setUbicacionCita(`${markerCoords.latitude}, ${markerCoords.longitude}`);
          setModalVisible(false);
        }}
      >
        <Text style={styles.btnText}>Confirmar ubicación</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#FF6B6B', marginTop: 10 }]}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.btnText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d928eff',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 40
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B6E2DD',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    fontSize: 20,
    borderWidth: 1.5,
    borderColor: '#B6E2DD',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#146663ff',
    fontSize: 16
  },
  boton: {
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
  },
  btn: {
    backgroundColor: '#3AAFA9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonDisabled: {
    opacity: 0.5,
  },
  boton1: {
    backgroundColor: "hsl(198, 78%, 64%)",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,

  }

})
