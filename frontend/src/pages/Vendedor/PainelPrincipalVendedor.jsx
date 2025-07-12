import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Target, BarChart3, TrendingUp, Plus } from 'lucide-react';

const PainelVendedorStyles = () => (
  <style>{`
    .metric-card-vendedor {
      background-color: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
      border: 1px solid #f3f4f6;
    }
    .progress-bar-vendedor {
      width: 100%;
      background-color: #e5e7eb;
      border-radius: 9999px;
      height: 8px;
      overflow: hidden;
    }
    .progress-fill-vendedor {
      height: 100%;
      background-color: #3B82F6;
      border-radius: 9999px;
    }
    .task-item-vendedor {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background-color: #f9fafb;
      border-radius: 8px;
    }
  `}</style>
);


function PainelPrincipalVendedor() {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000); // Atualiza a cada minuto
    return () => clearInterval(intervalId);
  }, []);

  const mockMetrics = [
    { id: 1, label: 'Vendas do Mês', value: 'R$ 485K', trend: '+23% vs mês anterior', trendColor: 'text-green-600', icon: DollarSign, iconColor: 'text-green-500' },
    { id: 2, label: 'Negócios Ativos', value: '47', description: 'R$ 1.2M em negociação', icon: Target, iconColor: 'text-blue-500' },
    { id: 3, label: 'Taxa de Conversão', value: '68%', progress: 68, meta: '70%', icon: BarChart3, iconColor: 'text-purple-500' },
    { id: 4, label: 'Ticket Médio', value: 'R$ 12.5K', trend: '+8% vs mês anterior', trendColor: 'text-green-600', icon: DollarSign, iconColor: 'text-orange-500' },
  ];

  const salesData = [
    { month: 'Jan', sales: 300, meta: 350 }, { month: 'Fev', sales: 320, meta: 360 },
    { month: 'Mar', sales: 380, meta: 400 }, { month: 'Abr', sales: 420, meta: 450 },
    { month: 'Mai', sales: 480, meta: 500 }, { month: 'Jun', sales: 450, meta: 480 },
  ];

  const mockTasks = [
    { id: 1, title: 'Reunião com Cliente X', priority: 'Alta', completed: false },
    { id: 2, title: 'Enviar proposta para Cliente Y', priority: 'Média', completed: false },
    { id: 3, title: 'Follow-up com Lead Z', priority: 'Baixa', completed: true },
  ];

  return (
    <>
      <PainelVendedorStyles />
      <div className="fade-in-up space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Painel do Vendedor</h1>
          <div className="text-sm text-secondary">Última atualização: {currentDateTime}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockMetrics.map(metric => (
            <div key={metric.id} className="metric-card-vendedor">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">{metric.label}</p>
                  <p className="text-2xl font-bold text-primary">{metric.value}</p>
                  {metric.trend && (
                    <div className={`flex items-center mt-2 ${metric.trendColor} text-sm`}>
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>{metric.trend}</span>
                    </div>
                  )}
                  {metric.progress !== undefined && (
                    <div className="mt-2">
                      <div className="progress-bar-vendedor">
                        <div className="progress-fill-vendedor" style={{ width: `${metric.progress}%` }}></div>
                      </div>
                      <p className="text-xs text-muted mt-1">Meta: {metric.meta}</p>
                    </div>
                  )}
                </div>
                {metric.icon && (<metric.icon className={`h-8 w-8 ${metric.iconColor}`} />)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="chart-container p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Vendas vs Meta</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip wrapperClassName="recharts-tooltip-wrapper" />
              <Bar dataKey="sales" name="Vendas (R$ mil)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="meta" name="Meta (R$ mil)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-primary">Tarefas de Hoje</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm">
              <Plus className="h-4 w-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>
          <div className="space-y-3">
            {mockTasks.map(task => (
              <div key={task.id} className="task-item-vendedor">
                <input type="checkbox" className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" checked={task.completed} readOnly />
                <p className={`flex-1 text-sm ${task.completed ? 'line-through text-muted' : 'font-medium text-primary'}`}>{task.title}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.priority === 'Alta' ? 'bg-red-100 text-red-800' : task.priority === 'Média' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PainelPrincipalVendedor;
