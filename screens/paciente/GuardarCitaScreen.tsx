import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Picker } from '@react-native-picker/picker'
import { supabase } from '../../supabase/Config'
import { ref, set } from 'firebase/database'
import { db } from '../../firebase/Config2'
import { auth } from '../../firebase/Config2'  // Importa Firebase Auth

export default function GuardarCitaMedica() {

  const [idPaciente, setIdPaciente] = useState('')  // Guarda el id del paciente autenticado

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

  const [especialidadRequerida, setEspecialidadRequerida] = useState('')
  const [idDoctorSeleccionado, setIdDoctorSeleccionado] = useState('')

  useEffect(() => {
    // Listener para autenticación Firebase
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIdPaciente(user.uid)
        console.log('Usuario Firebase autenticado:', user)
      } else {
        setIdPaciente('')
        console.log('No hay usuario autenticado en Firebase')
      }
    })

    cargarEspecialidades()
    cargarDoctores()

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

  async function cargarDoctores() {
    const { data, error } = await supabase
      .from('doctor')
      .select('*')  // trae todo
    //.order('nombreApellido', { ascending: true }) // comentado para prueba

    console.log('Doctores data:', data)
    console.log('Doctores error:', error)

    if (error) {
      Alert.alert('Error al cargar doctores', error.message)
    } else if (!data || data.length === 0) {
      Alert.alert('Aviso', 'No se encontraron doctores en la base de datos.')
      setListaDoctores([])
    } else {
      setListaDoctores(data)
    }
  }

  const guardarCita = async () => {
    if (!nombreApellidoPaciente.trim() || !cedula.trim() || !especialidadRequerida || !idDoctorSeleccionado) {
      Alert.alert('Campos requeridos', 'Complete nombre, cédula, especialidad y doctor.');
      return;
    }

    const datosCita = {
      nombreApellidoPaciente,
      cedula,
      edad,
      correoElectronico,
      telefono,
      tipoSangre,
      direccion,
      especialidadRequerida,
      motivo,
      nombreApellidoDoctor: idDoctorSeleccionado,
      estado: "PENDIENTE",
      fecha,
      ubicacionCita,
    };

    try {
      // Guardar en Supabase
      const { data, error } = await supabase.from('citaMedica').insert([datosCita]).select();
      if (error) {
        Alert.alert('Error en Supabase', error.message);
        return;
      }

      const idGenerado = data[0].id;

      // Guardar en Firebase incluyendo idPaciente
      const citaRef = ref(db, `citas_medicas/${idGenerado}`);
      await set(citaRef, {
        ...datosCita,
        id: idGenerado,
        idPaciente,
      });

      Alert.alert('Éxito', 'Cita médica registrada en ambas bases de datos.');

      limpiarCampos();

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Ocurrió un problema al guardar la cita.');
    }
  };


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
          onChangeText={setCedula}
        />

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={edad}
          onChangeText={setEdad}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={correoElectronico}
          onChangeText={setCorreoElectronico}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
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
            selectedValue={especialidadRequerida}
            onValueChange={(value) => setEspecialidadRequerida(value)}
            itemStyle={{ fontSize: 16 }}
          >
            <Picker.Item label="Seleccione una especialidad" value="" />
            {listaEspecialidades.map((item) => (
              <Picker.Item key={item.id} label={item.nombre_especialidad} value={item.nombre_especialidad} />
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
          onChangeText={setUbicacionCita}
        />

        <TouchableOpacity style={styles.boton} onPress={guardarCita}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Guardar Cita</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#DFF6F4',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B7A78',
    textAlign: 'center',
    marginBottom: 24,
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
    color: '#2B7A78',
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
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
