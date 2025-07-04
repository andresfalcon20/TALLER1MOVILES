import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase/Config';

export default function GuardarCitaScreen() {
   const [idCita, setidCita] = useState("")
    const [nombreApellidoPaciente, setnombreApellidoPaciente] = useState("")
    const [cedula, setcedula] = useState("")
    const [edad, setedad] = useState("")
    const [genero, setGenero] = useState("")
    const [correo, setcorreo] = useState("")
    const [telefono, settelefono] = useState("")
    const [tipoSangre, settipoSangre] = useState("")
    const [direccion, setdireccion] = useState("")
    const [especialidadRequerida, setespecialidadRequerida] = useState("")
    const [motivo, setmotivo] = useState("")
    const [nombreApellidoDoctor, setnombreApellidoDoctor] = useState("")
    const [estado, setestado] = useState("")
    const [fecha, setfecha] = useState("")
    const [ubicacionCita, setubicacionCita] = useState("")


    async function guardarConsulta() {

        const { error } = await supabase
            .from('citaMedica')
            .insert({
                nombreApellidoPaciente: nombreApellidoPaciente,
                cedula: cedula,
                edad: edad,
                genero: genero, 
                correoElectronico: correo,
                telefono: telefono,
                tipoSangre: tipoSangre,
                direccion: direccion,
                especialidadRequerida: especialidadRequerida,
                motivo: motivo,
                nombreApellidoDoctor: nombreApellidoDoctor,
                estado: estado,
                fecha: fecha,
                ubicacionCita: ubicacionCita,
            })
        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Éxito", "Cita guardada correctamente.");
        }

    }

   

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nueva Cita</Text>

      <Text style={styles.label}>ID</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="key" size={20} color="#888" />
        <TextInput
          value={idCita}
          onChangeText={setidCita}
          style={styles.inputText}
          placeholder="ID único"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
        />
      </View>




      <Text style={styles.label}>Nombre del Paciente</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#888" />
        <TextInput
          value={nombreApellidoPaciente}
          onChangeText={setnombreApellidoPaciente}
          style={styles.inputText}
          placeholder="Nombre"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Cédula</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="card" size={20} color="#888" />
        <TextInput
          value={cedula}
          onChangeText={setcedula}
          style={styles.inputText}
          placeholder="Cédula"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Edad</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="calendar" size={20} color="#888" />
        <TextInput
          value={edad}
          onChangeText={setedad}
          style={styles.inputText}
          placeholder="Edad"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Género</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="male-female" size={20} color="#888" />
        <TextInput
          onChangeText={setGenero}
          style={styles.inputText}
          placeholder="Género"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Correo Electrónico</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#888" />
        <TextInput
          value={correo}
          onChangeText={setcorreo}
          style={styles.inputText}
          placeholder="Correo"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />
      </View>

      <Text style={styles.label}>Teléfono</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="call" size={20} color="#888" />
        <TextInput
          value={telefono}
          onChangeText={settelefono}
          style={styles.inputText}
          placeholder="Teléfono"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.label}>Tipo de Sangre</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="water" size={20} color="#888" />
        <TextInput
          value={tipoSangre}
          onChangeText={settipoSangre}
          style={styles.inputText}
          placeholder="Ej: O+, A-"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Dirección</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="location" size={20} color="#888" />
        <TextInput
          value={direccion}
          onChangeText={setdireccion}
          style={styles.inputText}
          placeholder="Dirección"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Especialidad Requerida</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="medkit" size={20} color="#888" />
        <TextInput
          value={especialidadRequerida}
          onChangeText={setespecialidadRequerida}
          style={styles.inputText}
          placeholder="Especialidad"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Motivo de la Cita</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="document-text" size={20} color="#888" />
        <TextInput
          value={motivo}
          onChangeText={setmotivo}
          style={styles.inputText}
          placeholder="Motivo"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Nombre del Doctor</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-circle" size={20} color="#888" />
        <TextInput

        onChangeText={setnombreApellidoDoctor}
          style={styles.inputText}
          placeholder="Doctor"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Fecha de la Cita</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={20} color="#888" />
        <TextInput
          value={fecha}
          onChangeText={setfecha}
          style={styles.inputText}
          placeholder="AAAA-MM-DD"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Ubicación</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="pin" size={20} color="#888" />
        <TextInput
          value={ubicacionCita}
          onChangeText={setubicacionCita}
          style={styles.inputText}
          placeholder="Ubicación"
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Guardar Cita" color="#2B7A78" onPress={guardarConsulta} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF6F4',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2B7A78',
    marginBottom: 28,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#20504F',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B6E2DD',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
