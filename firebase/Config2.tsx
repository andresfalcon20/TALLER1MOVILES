import { ref, push } from 'firebase/database'
// Update the import path below to match your actual Firebase config file location and name

// firebase.js o firebaseConfig.js

// ✅ Importación correcta de Firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// ✅ Configuración del proyecto (copiada desde Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyAVnVnUxyWMyqIk9yOKh32rE918pjfrIGU",
    authDomain: "mov2proyecto.firebaseapp.com",
    databaseURL: "https://mov2proyecto-default-rtdb.firebaseio.com",
    projectId: "mov2proyecto",
    storageBucket: "mov2proyecto.appspot.com", // ❗CORREGIDO
    messagingSenderId: "552746056346",
    appId: "1:552746056346:web:3e931d302dac35793bbd23"
};

// ✅ Inicializar Firebase y exportar instancias
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
