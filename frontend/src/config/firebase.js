// Firebase Configuration para React
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "AIzaSyDgg5jnDEypyXsAxgqFHDZQzK3rpLY3nU8",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "plataforma-de-vendas-a87c2.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID || "plataforma-de-vendas-a87c2",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "plataforma-de-vendas-a87c2.appspot.com",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || "177158177496",
  appId: import.meta.env.VITE_APP_ID || "1:177158177496:web:88d1c178147e7e91064dad"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configurar Firestore para reduzir warnings
try {
  // Desabilitar alguns recursos avançados que podem causar warnings
  if (import.meta.env.DEV) {
    console.log('Firebase configurado para desenvolvimento');
    
    // Conectar ao emulador se especificado
    if (import.meta.env.VITE_USE_EMULATOR === 'true') {
      console.log('Conectando ao emulador do Firestore...');
      // connectFirestoreEmulator(db, 'localhost', 8080);
    }
  }
} catch (error) {
  console.log('Erro na configuração do Firebase:', error);
}

// Exportar a instância do app
export default app;