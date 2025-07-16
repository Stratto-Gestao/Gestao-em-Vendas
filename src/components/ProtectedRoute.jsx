import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredPermission, fallback = null }) => {
  const { userRole, navConfig } = useAuth();
  
  // SUPER_ADMIN tem acesso total a tudo
  if (userRole === 'SUPER_ADMIN') {
    return children;
  }
  
  // Obter menus do usuário
  const userMenus = navConfig[userRole] || navConfig.USER;
  
  // Verificar se o usuário tem permissão
  const hasPermission = userMenus.includes(requiredPermission);
  
  if (!hasPermission) {
    return fallback || (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Sua permissão atual: <strong>{userRole}</strong></p>
          <p>Permissão necessária: <strong>{requiredPermission}</strong></p>
        </div>
      </div>
    );
  }
  
  return children;
};

export default ProtectedRoute;
