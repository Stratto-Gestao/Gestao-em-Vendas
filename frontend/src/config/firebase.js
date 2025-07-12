// Firebase Configuration para React
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Sua configuração do Firebase (mesma que você já tem)
const firebaseConfig = {
  apiKey: "AIzaSyDgg5jnDEypyXsAxgqFHDZQzK3rpLY3nU8",
  authDomain: "plataforma-de-vendas-a87c2.firebaseapp.com",
  projectId: "plataforma-de-vendas-a87c2",
  storageBucket: "plataforma-de-vendas-a87c2.appspot.com",
  messagingSenderId: "177158177496",
  appId: "1:177158177496:web:88d1c178147e7e91064dad"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Exportar a instância do app
export default app;