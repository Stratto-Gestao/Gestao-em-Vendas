import React, { useState } from 'react';
import { Plus } from 'lucide-react';

function GestaoNegocios() {
  const [selectedDeal, setSelectedDeal] = useState(null);

  const mockDeals = [
    { id: 1, client: 'TechStart Solutions', contact: 'Carlos Silva', value: 50, probability: 80, stage: 'Qualificação' },
    { id: 2, client: 'Inova Marketing Digital', contact: 'Ana Paula', value: 30, probability: 60, stage: 'Proposta' },
    { id: 3, client: 'Logística Express', contact: 'Fernando Costa', value: 100, probability: 40, stage: 'Negociação' },
    { id: 4, client: 'Soluções Sustentáveis', contact: 'Mariana Lima', value: 75, probability: 90, stage: 'Fechamento' },
    { id: 5, client: 'Consultoria Alpha', contact: 'Pedro Santos', value: 20, probability: 30, stage: 'Qualificação' },
  ];

  const kanbanStages = ['Qualificação', 'Proposta', 'Negociação', 'Fechamento'];

  const getProbabilityBadgeType = (probability) => {
    if (probability >= 70) return 'bg-green-100 text-green-800';
    if (probability >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="fade-in-up space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gestão de Negócios</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Novo Negócio</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {kanbanStages.map(stage => (
          <div key={stage} className="glass-card p-4">
            <h3 className="font-semibold text-primary mb-4 text-center">{stage}</h3>
            <div className="space-y-3">
              {mockDeals.filter(deal => deal.stage === stage).map(deal => (
                <div key={deal.id} className="glass-card p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedDeal(deal)}>
                  <h4 className="font-medium text-primary text-sm">{deal.client}</h4>
                  <p className="text-xs text-secondary">{deal.contact}</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-secondary">Valor:</p>
                      <p className="text-sm font-bold text-primary">R$ {deal.value}K</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-secondary">Probabilidade:</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProbabilityBadgeType(deal.probability)}`}>{deal.probability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDeal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDeal(null)}>
            <div className="glass-card p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                {/* Conteúdo do modal aqui */}
                <h2 className="text-2xl font-bold text-primary">{selectedDeal.client}</h2>
            </div>
         </div>
      )}
    </div>
  );
}

export default GestaoNegocios;
