import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DebugPermissions = () => {
  const { userRole, userMenus, navConfig, isAdmin } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      width: '300px', 
      height: '100vh', 
      background: '#f5f5f5', 
      padding: '20px', 
      border: '1px solid #ddd',
      overflow: 'auto',
      zIndex: 9999 
    }}>
      <h3>Debug Permissions</h3>
      <div>
        <strong>User Role:</strong> {userRole || 'Loading...'}
      </div>
      <div>
        <strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Is SUPER_ADMIN:</strong> {userRole === 'SUPER_ADMIN' ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>User Menus:</strong>
        <ul>
          {userMenus && userMenus.length > 0 ? (
            userMenus.map((menu, index) => (
              <li key={index}>{menu}</li>
            ))
          ) : (
            <li>No menus available</li>
          )}
        </ul>
      </div>
      <div>
        <strong>Nav Config:</strong>
        <pre style={{ fontSize: '10px', overflow: 'auto' }}>
          {JSON.stringify(navConfig, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DebugPermissions;
