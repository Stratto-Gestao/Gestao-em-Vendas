import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Loading from './components/Loading';

// Componente principal da aplicação
const AppContent = () => {
  const { currentUser, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <Loading />;
  }

  // Se logado, mostrar dashboard
  if (currentUser) {
    return <Dashboard />;
  }

  // Se não logado, mostrar login
  return <LoginForm />;
};

// App principal com provider
const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;

// Dentro do Dashboard, adicione o menu SDR no local desejado do sidebar
// Exemplo de uso:
// <SDRMenu activeTab={activeTab} setActiveTab={setActiveTab} />