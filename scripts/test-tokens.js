// Arquivo de teste para verificar os tokens de autenticação
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Função para testar os tokens personalizados
function testAuthTokens() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Obtém o token do usuário
        const token = await user.getIdToken();
        console.log('Token do usuário:', token);

        // Decodifica o token para ver os claims
        const tokenResult = await user.getIdTokenResult();
        console.log('Claims do token:', tokenResult.claims);

        // Verifica se tem o role personalizado
        if (tokenResult.claims.role) {
          console.log('Role do usuário:', tokenResult.claims.role);
        } else {
          console.log('Nenhum role encontrado no token');
        }

        // Verifica se é admin
        if (tokenResult.claims.admin) {
          console.log('Usuário é admin:', tokenResult.claims.admin);
        }

      } catch (error) {
        console.error('Erro ao obter token:', error);
      }
    } else {
      console.log('Usuário não autenticado');
    }
  });
}

// Executa o teste
testAuthTokens();

export default testAuthTokens;
