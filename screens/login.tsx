import React, { useState } from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email !== '' && password !== '') {
      navigation.navigate('PacienteScreen');
    } else {
      Alert.alert('Error', 'Ingresa un email y contraseña de prueba');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>BIENVENIDO</Text>
      <Text style={styles.subtitulo}>medicPLus</Text>

      <Image
  source={require('../assets/paciente.jpg')} 
  style={styles.image}
/>

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContenedor}>
        <Ionicons name="mail" size={20} color="#888" />
        <TextInput
          style={styles.inputTexto}
          placeholderTextColor="#aaa"
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.inputContenedor}>
        <Ionicons name="lock-closed" size={20} color="#888" />
        <TextInput
          style={styles.inputTexto}
          placeholderTextColor="#aaa"
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.Boton}>
        <Button title="Iniciar sesión" color="#2B7A78" onPress={handleLogin} />
      </View>

      <TouchableOpacity
        style={styles.ContainerL}
        onPress={() => navigation.navigate('RegistroPacienteScreen')}
      >
        <Text style={styles.TextL}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#DFF6F4',
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2B7A78',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitulo: {
  fontSize: 16,
  fontWeight: '600',
  color: '#4CAEA9',
  textAlign: 'center',
  marginBottom: 16,
  textTransform: 'uppercase',
},

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#20504F',
    marginBottom: 6,
  },
  inputContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B6E2DD',
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputTexto: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  Boton: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  ContainerL: {
    alignItems: 'center',
    marginTop: 10,
  },
  TextL: {
    fontSize: 14,
    color: '#2B7A78',
    textDecorationLine: 'underline',
  },
  image: {
  width: 120,
  height: 120,
  alignSelf: 'center',
  marginBottom: 24,
  borderRadius: 40, 
},

});
