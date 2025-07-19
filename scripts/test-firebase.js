// Teste de conexão com Firebase
import { auth, db } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

// Função para testar a autenticação
const testAuth = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✅ Usuário autenticado:', user.uid);
      console.log('📧 Email:', user.email);
      testFirestore(user);
    } else {
      console.log('❌ Usuário não autenticado');
    }
  });
};

// Função para testar o Firestore
const testFirestore = async (user) => {
  try {
    const testData = {
      nome: 'Teste',
      empresa: 'Empresa Teste',
      email: 'teste@teste.com',
      telefone: '11999999999',
      origem: 'Teste',
      status: 'Novo',
      pontuacao: 50,
      proximaAcao: 'Teste',
      observacoes: 'Teste de conexão',
      tentativas: 0,
      recebido: new Date().toLocaleDateString('pt-BR'),
      criadoEm: new Date().toISOString(),
      criadoPor: user.uid,
      responsavel: user.uid
    };

    console.log('🔄 Tentando salvar no Firestore...');
    const docRef = await addDoc(collection(db, 'leads'), testData);
    console.log('✅ Documento salvo com ID:', docRef.id);
  } catch (error) {
    console.error('❌ Erro ao salvar no Firestore:', error);
  }
};

// Executar teste
testAuth();
