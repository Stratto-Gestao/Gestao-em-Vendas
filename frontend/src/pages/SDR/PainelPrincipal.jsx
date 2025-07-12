import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Target, Clock, TrendingUp, TrendingDown, Plus } from 'lucide-react';

// Componente de Estilos: Injeta o CSS diretamente no DOM.
const PainelStyles = () => (
  <style>{`
    :root {
      --primary-text: #111827;
      --secondary-text: #6b7280;
      --accent-blue: #3b82f6;
      --accent-green: #10b981;
      --border-color: #f3f4f6;
    }
    .kpi-card, .team-goal-card, .campaigns-card, .performance-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .kpi-card:hover, .team-goal-card:hover, .campaigns-card:hover, .performance-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
    }
    
    .kpi-card {
      min-height: 140px;
      max-height: 140px;
    }
    
    .team-goal-card, .campaigns-card, .performance-card {
      min-height: 260px;
    }
    
    /* Cores para os ícones dos KPIs */
    .kpi-card:nth-child(1) .icon { color: #3b82f6; }
    .kpi-card:nth-child(2) .icon { color: #10b981; }
    .kpi-card:nth-child(3) .icon { color: #8b5cf6; }
    .kpi-card:nth-child(4) .icon { color: #f97316; }
    /* Estilos KPI Cards */
    .kpi-card-header .label { color: var(--secondary-text); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
    .kpi-card-body { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .kpi-card-body .value { color: var(--primary-text); font-size: 1.875rem; font-weight: 700; line-height: 1.2; }
    .kpi-card-body .icon { width: 1.5rem; height: 1.5rem; }
    .kpi-card-footer { border-top: 1px solid var(--border-color); padding-top: 0.75rem; }
    .kpi-card-footer .trend { display: flex; align-items: center; font-size: 0.8rem; font-weight: 500; }
    .kpi-card-footer .trend.positive { color: var(--accent-green); }
    .kpi-card-footer .trend.negative { color: #ef4444; }
    .kpi-card-footer .trend-icon { margin-right: 0.25rem; width: 0.875rem; height: 0.875rem; }
    .kpi-card-footer .meta { font-size: 0.8rem; color: var(--secondary-text); }
    
    /* Estilos Meta da Equipe e Título Genérico de Card */
    .card-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem; }
    .team-goal-card .metric-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; }
    .team-goal-card .metric-label { color: var(--secondary-text); }
    .team-goal-card .metric-value { color: var(--primary-text); font-weight: 600; }
    .team-goal-card .progress-bar { width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 8px; margin: 1rem 0; }
    .team-goal-card .progress-bar-fill { height: 100%; background-color: var(--accent-blue); border-radius: 9999px; }
    
    /* Estilos Campanhas Ativas */
    .campaign-item { background-color: #f9fafb; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; }
    .campaign-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
    .campaign-title-text { font-weight: 600; color: var(--primary-text); }
    .campaign-badge { padding: 0.125rem 0.625rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
    .campaign-badge.ativa { background-color: #dcfce7; color: #166534; }
    .campaign-badge.finalizada { background-color: #e5e7eb; color: #4b5563; }
    .campaign-stats { display: flex; justify-content: space-between; font-size: 0.875rem; }

    /* Estilos Performance Individual */
    .performance-item { margin-bottom: 1.25rem; }
    .performance-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .performance-item-label { font-size: 0.875rem; color: var(--secondary-text); font-weight: 500; }
    .performance-item-value { font-size: 0.875rem; color: var(--primary-text); font-weight: 600; }
    .performance-progress-bar { width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 8px; }
    .performance-progress-bar-fill { height: 100%; background-color: var(--accent-blue); border-radius: 9999px; }
  `}</style>
);


function PainelPrincipal() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const kpiData = [
    { label: "Leads Recebidos", value: "152", Icon: Users, trend: "+18% vs mês anterior", isPositive: true },
    { label: "Leads Qualificados", value: "68", Icon: Target, trend: "+12% vs mês anterior", isPositive: true },
    { label: "Taxa de Conversão", value: "44.7%", Icon: BarChart3, meta: "Meta: 45%" },
    { label: "Tempo Médio", value: "2.3h", Icon: Clock, trend: "-15 min vs mês anterior", isPositive: true },
  ];

  const teamGoal = {
    meta: 200,
    qualificados: 152,
  };
  const goalPercentage = (teamGoal.qualificados / teamGoal.meta) * 100;

  const campaigns = [
    { title: 'Campanha Tecnologia Q2', status: 'Ativa', leads: 45, conversões: 12 },
    { title: 'Promoção Fim de Trimestre', status: 'Ativa', leads: 78, conversões: 23 },
    { title: 'Webinar Soluções Digitais', status: 'Finalizada', leads: 156, conversões: 34 },
  ];
  
  const performanceItems = [
    { label: 'Calls por dia', value: 45, goal: 50 },
    { label: 'Taxa de conexão', value: 35, goal: 40 },
    { label: 'Taxa de qualificação', value: 44, goal: 45 },
    { label: 'Agendamentos', value: 8, goal: 10 },
  ];

  return (
    <>
      <PainelStyles />
      <div className="fade-in-up space-y-8 p-4 md:p-6" style={{ padding: '1.5rem 2rem' }}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Painel Principal</h1>
          <p className="text-sm text-secondary">
            Última atualização: {currentDate.toLocaleDateString('pt-BR')} {currentDate.toLocaleTimeString('pt-BR')}
          </p>
        </div>

        {/* Primeira linha - 4 KPI Cards horizontais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {kpiData.map((kpi, index) => (
            <div key={index} className="kpi-card">
              <div className="kpi-card-header">
                <p className="label">{kpi.label}</p>
              </div>
              <div className="kpi-card-body">
                <p className="value">{kpi.value}</p>
                <kpi.Icon className="icon" size={24} />
              </div>
              <div className="kpi-card-footer">
                {kpi.trend ? (
                  <div className={`trend ${kpi.isPositive ? 'positive' : 'negative'}`}>
                    {kpi.isPositive ? <TrendingUp size={14} className="trend-icon" /> : <TrendingDown size={14} className="trend-icon" />}
                    <span>{kpi.trend}</span>
                  </div>
                ) : (
                  <p className="meta">{kpi.meta}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Segunda linha - Meta da Equipe e Campanhas Ativas lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div className="team-goal-card">
            <h2 className="card-title">Meta da Equipe</h2>
            <div className="space-y-3">
              <div className="metric-row">
                <span className="metric-label">Meta Mensal:</span>
                <span className="metric-value">{teamGoal.meta} leads</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Qualificados:</span>
                <span className="metric-value">{teamGoal.qualificados} leads</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${goalPercentage}%` }}></div>
            </div>
            <div className="metric-row text-sm mt-1">
              <span className="metric-label">{goalPercentage.toFixed(0)}% da meta</span>
              <span className="metric-label">Faltam: {teamGoal.meta - teamGoal.qualificados} leads</span>
            </div>
          </div>

          <div className="campaigns-card">
            <h2 className="card-title">Campanhas Ativas</h2>
            <div className="space-y-3">
              {campaigns.map((camp, index) => (
                <div key={index} className="campaign-item">
                  <div className="campaign-item-header">
                    <span className="campaign-title-text">{camp.title}</span>
                    <span className={`campaign-badge ${camp.status.toLowerCase()}`}>{camp.status}</span>
                  </div>
                  <div className="campaign-stats">
                    <span className="text-sm text-gray-500">Leads: <b className="text-gray-700">{camp.leads}</b></span>
                    <span className="text-sm text-gray-500">Conversões: <b className="text-gray-700">{camp.conversões}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terceira linha - Performance Individual ocupando largura total */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          <div className="performance-card">
              <h2 className="card-title">Performance Individual</h2>
              <div className="space-y-5">
                {performanceItems.map(item => {
                  const percentage = (item.value / item.goal) * 100;
                  return (
                    <div key={item.label} className="performance-item">
                      <div className="performance-item-header">
                        <span className="performance-item-label">{item.label}</span>
                        <span className="performance-item-value">{item.value}/{item.goal} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="performance-progress-bar">
                        <div className="performance-progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        </div>
        
      </div>
    </>
  );
}

export default PainelPrincipal;