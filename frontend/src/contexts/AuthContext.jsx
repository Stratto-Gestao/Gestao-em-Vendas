import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

import { AuthContext } from './AuthContextDef';

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  // --> ADICIONADO: Novo estado para verificar a permissão de escrita do token
  const [canWrite, setCanWrite] = useState(false);

  // Roles (mesmo do seu projeto atual)
  const adminRoles = ['SUPER_ADMIN', 'ADMIN_OPERACIONAL', 'ADMIN_CONTEUDO', 'ADMIN_GAMIFICACAO'];
  const mrRoles = ['MR_RESPONSAVEL'];

  // Configuração de navegação
  const navConfig = {
    SUPER_ADMIN: ['dashboard', 'academia', 'gamificacao', 'vendedor', 'sdr', 'mr-representacoes', 'perfil', 'admin'],
    ADMIN_OPERACIONAL: ['dashboard', 'academia', 'gamificacao', 'vendedor', 'sdr', 'perfil', 'admin'],
    ADMIN_CONTEUDO: ['dashboard', 'academia', 'perfil', 'admin'],
    ADMIN_GAMIFICACAO: ['dashboard', 'academia', 'gamificacao', 'perfil', 'admin'],
    USER_SDR: ['dashboard', 'academia', 'sdr', 'perfil', 'gamificacao'],
    USER_VENDEDOR: ['dashboard', 'academia', 'vendedor', 'perfil', 'gamificacao'],
    MR_RESPONSAVEL: ['dashboard', 'academia', 'perfil'],
    USER: ['dashboard', 'perfil']
  };

  // Verificar se o usuário tem uma role de admin (para UI e navegação)
  const isAdmin = () => {
    return adminRoles.includes(userRole);
  };

  // Verificar se é MR
  const isMR = () => {
    return mrRoles.includes(userRole);
  };

  // Função de login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Função de logout
  const logout = async () => {
    await signOut(auth);
    // --> ALTERADO: Limpa todos os estados no logout
    setCurrentUser(null);
    setUserRole(null);
    setCanWrite(false);
  };

  // Buscar dados do usuário no Firestore
  const fetchUserData = async (uid) => {
    if (!uid) {
      setUserRole('USER');
      return null;
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || userData.profile?.role || 'USER';
        setUserRole(role);
        // --> ADICIONADO: Se for SUPER_ADMIN, já garantimos que pode escrever.
        if (role === 'SUPER_ADMIN') {
          setCanWrite(true);
        }
        return userData;
      } else {
        setUserRole('USER');
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setUserRole('USER');
      return null;
    }
  };

  // --> ALTERADO: Lógica principal de autenticação foi atualizada
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);

        // Busca os dados do documento e o token de autenticação em paralelo
        const userDataPromise = fetchUserData(user.uid);
        const idTokenPromise = user.getIdTokenResult();

        const [userData, idTokenResult] = await Promise.all([userDataPromise, idTokenPromise]);

        // Verifica se o token tem a claim 'admin'
        const hasAdminClaim = idTokenResult.claims.admin === true;

        // Define a permissão de escrita:
        // O usuário pode escrever se for SUPER_ADMIN (definido no fetchUserData)
        // OU se tiver a claim 'admin: true' no token.
        if (userData?.role !== 'SUPER_ADMIN') {
           setCanWrite(hasAdminClaim);
        }

      } else {
        // Limpa tudo no logout
        setCurrentUser(null);
        setUserRole(null);
        setCanWrite(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Valor do contexto
  const value = {
    currentUser,
    userRole,
    loading,
    canWrite, // --> ADICIONADO: Exporta a permissão de escrita
    login,
    logout,
    isAdmin,
    isMR,
    navConfig,
    fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};