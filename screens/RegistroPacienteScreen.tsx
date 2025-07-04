import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegistroPacienteScreen({ navigation }: any) {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const handleRegistro = () => {
    if (usuario === '' || email === '' || password === '' || confirmarPassword === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
    } else if (password !== confirmarPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
    } else {
      Alert.alert('Éxito', 'Usuario registrado');
      navigation.navigate('login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear una cuenta</Text>
      <Ionicons name="person-add" size={48} color="#2B7A78" style={styles.icon} />

      <Text style={styles.label}>Nombre de usuario</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#888" />
        <TextInput
          value={usuario}
          onChangeText={setUsuario}
          style={styles.inputText}
          placeholder="Nombre de usuario"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Correo electrónico</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#888" />
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.inputText}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />
      </View>

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#888" />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputText}
          placeholder="••••••••"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.label}>Confirmar contraseña</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#888" />
        <TextInput
          value={confirmarPassword}
          onChangeText={setConfirmarPassword}
          secureTextEntry
          style={styles.inputText}
          placeholder="••••••••"
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Registrarse" color="#2B7A78" onPress={handleRegistro} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF6F4',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B7A78',
    textAlign: 'center',
    marginBottom: 12,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 24,
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
    paddingVertical: 6,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
