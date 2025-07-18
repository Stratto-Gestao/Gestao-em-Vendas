import React from 'react';
import { AlertCircle } from 'lucide-react';
import { resetAllBusinessData } from '../../hooks/admin/useAdminData';

function ResetAllDataButton({ currentUser, userRole }) {
  const handleResetAllData = async () => {
    if (!currentUser || userRole !== 'SUPER_ADMIN') {
      alert(`Apenas SUPER_ADMIN pode executar esta ação. Seu role atual: ${userRole || 'undefined'}`);
      return;
    }

    if (!window.confirm('Tem certeza que deseja EXCLUIR TODOS os dados de negócio? Esta ação é irreversível! Os USUÁRIOS serão mantidos.')) {
      return;
    }

    try {
      await resetAllBusinessData(currentUser, userRole);
      alert('Todos os dados de negócio foram excluídos com sucesso!');
    } catch (error) {
      alert('Erro ao excluir dados: ' + error.message);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5 text-red-500" />
      <button 
        onClick={handleResetAllData}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Resetar Dados
      </button>
    </div>
  );
}

export default ResetAllDataButton;
