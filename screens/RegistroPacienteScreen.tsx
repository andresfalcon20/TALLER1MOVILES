import React, { useState } from 'react';
import { Alert, Button, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase/Config2';
import { supabase } from '../supabase/Config';

export default function RegistroPacienteScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [imagen, setImagen] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  async function subirImagenStoragePaciente(): Promise<string | null> {
    if (!image) return null;

    const nombreArchivo = `fotoperfil_${Date.now()}.png`;

    const { data, error } = await supabase
      .storage
      .from('pacientestatic')
      .upload(`public/${nombreArchivo}`, {
        uri: image,
        cacheControl: '3600',
        upsert: false,
        name: nombreArchivo,
      } as any, {
        contentType: "image/png"
      });

    if (error) {
      Alert.alert('Error al subir imagen', error.message);
      return null;
    }

    const { data: urlData } = supabase
      .storage
      .from('pacientestatic')
      .getPublicUrl(`public/${nombreArchivo}`);

    return urlData?.publicUrl || null;
  }


  const handleRegistro = async () => {
    if (
      !nombre || !edad || !usuario || !email || !password || !confirmarPassword ||
      (!image && imagen.trim() === '')
    ) {
      Alert.alert('Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmarPassword) {
      Alert.alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userFirebase = userCredential.user;

      const { error: supabaseAuthError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supabaseAuthError) {
        console.error('Error en Supabase Auth:', supabaseAuthError.message);
        Alert.alert('Error', 'No se pudo registrar en Supabase Auth');
        return;
      }

      let imagenFinal = imagen;
      if (image) {
        const urlSubida = await subirImagenStoragePaciente();
        if (!urlSubida) return;
        imagenFinal = urlSubida;
      }

      await set(ref(db, 'paciente/' + userFirebase.uid), {
        uid: userFirebase.uid,
        nombre,
        edad,
        nombreUsuario: usuario,
        email,
        imagen: imagenFinal,
        fechaRegistro: new Date().toISOString(),
      });

      const { error: insertError } = await supabase.from('paciente').insert([
        {
          nombre,
          edad,
          usuario,
          correo: email,
          imagen: imagenFinal,
        },
      ]);

      if (insertError) {
        console.error("Error al guardar en Supabase table:", insertError.message);
        Alert.alert('Error al guardar en Supabase DB', insertError.message);
        return;
      }

      Alert.alert('Registro exitoso', 'Paciente registrado correctamente');
      limpiarCampos();
      navigation.navigate('Login');

    } catch (error: any) {
      console.error('Error general:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'El correo ya está en uso');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Correo inválido');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'La contraseña es muy débil');
      } else {
        Alert.alert('Error', 'No se pudo registrar el paciente');
      }
    }
  };

  function limpiarCampos() {
    setNombre('');
    setEdad('');
    setUsuario('');
    setEmail('');
    setPassword('');
    setConfirmarPassword('');
    setImagen('');
    setImage(null);
  }

  return (
    <ImageBackground
      source={require('../assets/fondo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.titulo}>MedicPlus</Text>
          <Text style={styles.subtitulo}>Registro de Paciente</Text>

          <TextInput
            style={styles.inputContenedor}
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            style={styles.inputContenedor}
            placeholder="Edad"
            keyboardType="numeric"
            value={edad}
            onChangeText={setEdad}
          />

          <TextInput
            style={styles.inputContenedor}
            placeholder="Nombre de usuario"
            value={usuario}
            onChangeText={setUsuario}
          />

          <TouchableOpacity style={styles.botonImagen} onPress={pickImage}>
            <Text style={styles.textoBotonImagen}>Seleccionar imagen de perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonImagen} onPress={takePhoto}>
            <Text style={styles.textoBotonImagen}>Tomar foto desde cámara</Text>
          </TouchableOpacity>


          {image && <Image source={{ uri: image }} style={styles.image} />}

          <TextInput
            style={styles.inputContenedor}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.inputContenedor}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.inputContenedor}
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
          />

          <TouchableOpacity style={styles.Boton} onPress={handleRegistro}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Registrarse</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.ContainerL}>
            <Text style={styles.TextL} onPress={() => navigation.navigate('Login')}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </View>
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 14,
    marginVertical: 30,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#136966ff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#41a09bff',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContenedor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B6E2DD',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
  Boton: {
    marginBottom: 16,
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
  ContainerL: {
    alignItems: 'center',
    marginTop: 10,
  },
  TextL: {
    fontSize: 14,
    color: 'black',
    fontWeight: "bold",
    textDecorationLine: 'underline',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    alignSelf: 'center',
    borderRadius: 100,
    marginVertical: 10,
  },
  botonImagen: {
    backgroundColor: '#41a09bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  textoBotonImagen: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

});
