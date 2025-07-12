import React, { useState } from 'react';
import { Plus, Phone, Mail, Edit } from 'lucide-react';

function Clientes() {
  const [selectedClient, setSelectedClient] = useState(null);

  const mockClients = [
    { id: 1, company: 'TechStart Solutions', contactName: 'Carlos Silva', status: 'Ativo', email: 'carlos@techstart.com', phone: '(11) 99999-9999', segment: 'Tecnologia', totalValue: '285K', lastPurchase: '2024-01-15' },
    { id: 2, company: 'Inova Marketing Digital', contactName: 'Ana Paula', status: 'Ativo', email: 'ana.paula@inova.com', phone: '(21) 88888-8888', segment: 'Marketing', totalValue: '150K', lastPurchase: '2023-11-20' },
    { id: 3, company: 'Logística Express', contactName: 'Fernando Costa', status: 'Inativo', email: 'fernando@logexpress.com', phone: '(31) 77777-7777', segment: 'Logística', totalValue: '90K', lastPurchase: '2024-02-10' },
  ];

  return (
    <div className="fade-in-up space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Clientes</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockClients.map(client => (
          <div key={client.id} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedClient(client)}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold text-primary">{client.company}</h3>
                <p className="text-sm text-secondary">{client.contactName}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 ${client.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{client.status}</span>
              </div>
              <div>
                <p className="text-secondary">Contato</p>
                <p className="text-primary">{client.email}</p>
                <p className="text-primary">{client.phone}</p>
              </div>
              <div>
                <p className="text-secondary">Segmento: <span className="text-primary">{client.segment}</span></p>
                <p className="text-secondary">Valor Total: <span className="text-primary font-medium">R$ {client.totalValue}</span></p>
                <p className="text-secondary">Última Compra: <span className="text-primary">{client.lastPurchase}</span></p>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-xs"><Phone className="h-3 w-3" /><span>Ligar</span></button>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-xs"><Mail className="h-3 w-3" /><span>E-mail</span></button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1 text-xs"><Edit className="h-3 w-3" /><span>Editar</span></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedClient(null)}>
          <div className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{selectedClient.company}</h2>
                  <p className="text-secondary">Detalhes do cliente</p>
                </div>
                <button className="text-gray-500 hover:text-gray-700 text-3xl" onClick={() => setSelectedClient(null)}>&times;</button>
              </div>
              <div className="space-y-6">
                  {/* Conteúdo do Modal */}
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;
