import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/Config2';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { supabase } from '../supabase/Config';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const { error: supaError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (supaError) {
        console.error('Error Supabase:', supaError.message);
        Vibration.vibrate(500); 
        Alert.alert('Error', 'No se pudo iniciar sesión en Supabase.');
        return;
      }

      navigation.navigate('PacienteScreen');
    } catch (error: any) {
      let mensaje = 'Error al iniciar sesión.';

      Vibration.vibrate(500);

      switch (error.code) {
        case 'auth/invalid-email':
          mensaje = 'Correo electrónico no válido.';
          break;
        case 'auth/user-disabled':
          mensaje = 'Esta cuenta ha sido deshabilitada.';
          break;
        case 'auth/user-not-found':
          mensaje = 'No existe un usuario con este correo.';
          break;
        case 'auth/wrong-password':
          mensaje = 'Contraseña incorrecta.';
          break;
      }

      Alert.alert('Error de autenticación', mensaje);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/fondologin.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.titulo}>BIENVENIDO</Text>
          <Text style={styles.subtitulo}>medicPLus</Text>

          <Image source={require('../assets/paciente.jpg')} style={styles.image} />

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContenedor}>
            <Ionicons name="mail" size={20} color="#888" />
            <TextInput
              style={styles.inputTexto}
              placeholder='Ingrese su email'
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContenedor}>
            <Ionicons name="lock-closed" size={20} color="#888" />
            <TextInput
              placeholder='Ingrese su contraseña'
              style={styles.inputTexto}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.boton} onPress={handleLogin}>
            <Text style={styles.textoBoton}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ContainerL}
            onPress={() => navigation.navigate('Registro paciente')}
          >
            <Text style={styles.TextL}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
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
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    padding: 24,
    borderRadius: 14,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1b8d87ff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f7471ff',
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
  boton: {
    backgroundColor: '#3AAFA9',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ContainerL: {
    alignItems: 'center',
    marginTop: 10,
  },
  TextL: {
    fontSize: 14,
    color: '#434949ff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 40,
  },
});
