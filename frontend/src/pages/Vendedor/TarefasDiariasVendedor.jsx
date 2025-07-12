import React, { useState } from 'react';
import { Plus, CheckCircle, Edit, X } from 'lucide-react';

function TarefasDiariasVendedor() {
  const mockTasks = [
    { id: 1, description: 'Ligar para TechStart Solutions - Follow-up proposta', priority: 'Alta', completed: false },
    { id: 2, description: 'Enviar e-mail de apresentação para novo lead - Inova Marketing', priority: 'Média', completed: false },
    { id: 3, description: 'Agendar reunião com Logística Express', priority: 'Alta', completed: true },
  ];

  const [tasks, setTasks] = useState(mockTasks);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityBadgeType = (priority) => {
    if (priority === 'Alta') return 'bg-red-100 text-red-800';
    if (priority === 'Média') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="fade-in-up space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Tarefas Diárias</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2" onClick={() => setShowAddTaskModal(true)}>
          <Plus className="h-5 w-5" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => (
          <div key={task.id} className="glass-card p-4">
            <div className="flex items-center space-x-4">
              <input type="checkbox" className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300" checked={task.completed} onChange={() => toggleTask(task.id)} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted' : 'text-primary'}`}>{task.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeType(task.priority)}`}>{task.priority}</span>
                  {task.completed && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1"><CheckCircle className="h-3 w-3" /><span>Concluída</span></span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors text-xs flex items-center space-x-1"><Edit className="h-3 w-3" /><span>Editar</span></button>
                <button className="bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors text-xs flex items-center space-x-1"><X className="h-3 w-3" /><span>Excluir</span></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddTaskModal(false)}>
            <div className="glass-card p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-primary mb-4">Nova Tarefa</h2>
                {/* Conteúdo do modal aqui */}
            </div>
        </div>
      )}
    </div>
  );
}

export default TarefasDiariasVendedor;
