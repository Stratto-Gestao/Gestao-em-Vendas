import React, { useState } from 'react';
import { Phone, Activity, Target, Calendar, TrendingUp, TrendingDown, Award, BarChart3, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

function AnalisePerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const kpis = [
    { 
      label: 'Ligações/Dia', 
      value: '45', 
      meta: 'Meta: 50', 
      icon: Phone, 
      color: '#10b981', 
      progress: 90,
      trend: '+12%',
      isPositive: true,
      description: 'Média de ligações realizadas por dia'
    },
    { 
      label: 'Taxa de Conexão', 
      value: '35%', 
      meta: 'Meta: 40%', 
      icon: Activity, 
      color: '#3b82f6', 
      progress: 87.5,
      trend: '+5%',
      isPositive: true,
      description: 'Percentual de ligações atendidas'
    },
    { 
      label: 'Qualificações', 
      value: '12', 
      meta: 'Meta: 15', 
      icon: Target, 
      color: '#8b5cf6', 
      progress: 80,
      trend: '-3%',
      isPositive: false,
      description: 'Leads qualificados no período'
    },
    { 
      label: 'Reuniões Agendadas', 
      value: '8', 
      meta: 'Meta: 10', 
      icon: Calendar, 
      color: '#f59e0b', 
      progress: 80,
      trend: '+8%',
      isPositive: true,
      description: 'Reuniões marcadas com prospects'
    },
  ];

  const performanceData = [
    { month: 'Jan', 'Qualificações': 40, 'Ligações': 850, 'Reuniões': 25 },
    { month: 'Fev', 'Qualificações': 45, 'Ligações': 920, 'Reuniões': 28 },
    { month: 'Mar', 'Qualificações': 50, 'Ligações': 1050, 'Reuniões': 32 },
    { month: 'Abr', 'Qualificações': 55, 'Ligações': 1180, 'Reuniões': 35 },
    { month: 'Mai', 'Qualificações': 60, 'Ligações': 1280, 'Reuniões': 38 },
    { month: 'Jun', 'Qualificações': 68, 'Ligações': 1350, 'Reuniões': 42 },
  ];

  const dailyActivityData = [
    { day: 'Seg', calls: 52, qualified: 8 },
    { day: 'Ter', calls: 48, qualified: 6 },
    { day: 'Qua', calls: 45, qualified: 9 },
    { day: 'Qui', calls: 42, qualified: 7 },
    { day: 'Sex', calls: 38, qualified: 5 },
  ];

  const leadSourceData = [
    { name: 'LinkedIn', value: 35, color: '#0077b5' },
    { name: 'Website', value: 25, color: '#3b82f6' },
    { name: 'E-mail', value: 20, color: '#10b981' },
    { name: 'Indicação', value: 15, color: '#f59e0b' },
    { name: 'Outros', value: 5, color: '#8b5cf6' },
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: 'call', 
      description: 'Ligação para TechStart Solutions', 
      time: '2 min atrás', 
      status: 'success',
      icon: Phone 
    },
    { 
      id: 2, 
      type: 'meeting', 
      description: 'Reunião agendada com Inovação Digital', 
      time: '15 min atrás', 
      status: 'success',
      icon: Calendar 
    },
    { 
      id: 3, 
      type: 'qualification', 
      description: 'Lead qualificado - Global Corp', 
      time: '1h atrás', 
      status: 'success',
      icon: CheckCircle 
    },
    { 
      id: 4, 
      type: 'call', 
      description: 'Tentativa de contato - Smart Tech', 
      time: '2h atrás', 
      status: 'pending',
      icon: AlertCircle 
    },
  ];

  const periods = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' },
    { value: '1y', label: '1 ano' }
  ];

  return (
    <div className="performance-page">
      {/* Header Principal */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Análise de Performance</h1>
            <p className="page-subtitle">Acompanhe suas métricas e evolução como SDR</p>
          </div>
          <div className="header-controls">
            <div className="period-selector">
              <label className="selector-label">Período:</label>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="period-select"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="status-badge">
              <Award className="badge-icon" size={16} />
              <span>Performance Excelente</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="kpis-grid">
        {kpis.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-info">
                <p className="kpi-label">{kpi.label}</p>
                <p className="kpi-description">{kpi.description}</p>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                <kpi.icon size={24} />
              </div>
            </div>
            
            <div className="kpi-value">{kpi.value}</div>
            
            <div className="kpi-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${kpi.progress}%`, 
                    backgroundColor: kpi.color 
                  }}
                />
              </div>
              <div className="progress-info">
                <span className="progress-meta">{kpi.meta}</span>
                <span className={`progress-trend ${kpi.isPositive ? 'positive' : 'negative'}`}>
                  {kpi.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Evolução de Performance */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3 className="chart-title">Evolução de Performance</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
                <span>Qualificações</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Ligações</span>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Qualificações" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#8b5cf6' }} 
                  activeDot={{ r: 8, fill: '#8b5cf6' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Ligações" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#3b82f6' }} 
                  activeDot={{ r: 8, fill: '#3b82f6' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Atividade Semanal */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Atividade Semanal</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyActivityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Origem dos Leads */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Origem dos Leads</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={0}
                  dataKey="value"
                  labelLine={false}
                  label={false}
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legenda customizada compacta */}
            <div className="pie-legend-compact">
              {leadSourceData.map((entry, index) => (
                <div key={index} className="pie-legend-item-compact">
                  <div 
                    className="pie-legend-color-compact" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="pie-legend-text-compact">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="activities-section">
        <div className="section-header">
          <h3 className="section-title">Atividades Recentes</h3>
          <button className="view-all-btn">Ver Todas</button>
        </div>
        
        <div className="activities-list">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${activity.status}`}>
                <activity.icon size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
              <div className={`activity-status ${activity.status}`}>
                {activity.status === 'success' ? 'Concluído' : 'Pendente'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .performance-page {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .performance-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03), transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03), transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.03), transparent 50%);
          pointer-events: none;
        }

        /* Header */
        .page-header {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .page-header:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .page-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #1e293b, #475569);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .period-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .selector-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }

        .period-select {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: #1e293b;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .period-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          color: #065f46;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .badge-icon {
          color: #10b981;
        }

        /* KPIs Grid */
        .kpis-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .kpi-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.4s ease;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.6s ease;
        }

        .kpi-card:hover::before {
          left: 100%;
        }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .kpi-info {
          flex: 1;
        }

        .kpi-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.25rem;
        }

        .kpi-description {
          font-size: 0.75rem;
          color: #64748b;
          line-height: 1.4;
        }

        .kpi-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .kpi-card:hover .kpi-icon {
          transform: scale(1.1);
        }

        .kpi-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
          margin-bottom: 1rem;
        }

        .kpi-progress {
          space-y: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progress-meta {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .progress-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .progress-trend.positive {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .progress-trend.negative {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Charts Grid */
        .charts-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .chart-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .chart-card.large {
          grid-row: span 2;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
        }

        .chart-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .chart-legend {
          display: flex;
          gap: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #64748b;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .chart-container {
          position: relative;
        }

        /* Pie Chart Legend Compacta */
        .pie-legend-compact {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(241, 245, 249, 0.6);
        }

        .pie-legend-item-compact {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .pie-legend-color-compact {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .pie-legend-text-compact {
          font-size: 0.75rem;
          color: #475569;
          font-weight: 500;
          line-height: 1.2;
        }

        /* Activities Section */
        .activities-section {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .view-all-btn {
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          color: #1e40af;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          background: rgba(59, 130, 246, 0.15);
          transform: translateY(-1px);
        }

        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(248, 250, 252, 0.6);
          border: 1px solid rgba(226, 232, 240, 0.6);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: rgba(248, 250, 252, 0.9);
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .activity-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .activity-icon.success {
          background: rgba(16, 185, 129, 0.15);
          color: #059669;
        }

        .activity-icon.pending {
          background: rgba(245, 158, 11, 0.15);
          color: #d97706;
        }

        .activity-content {
          flex: 1;
        }

        .activity-description {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          font-size: 0.8rem;
          color: #64748b;
        }

        .activity-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .activity-status.success {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .activity-status.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .charts-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .chart-card.large {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .performance-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.875rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .kpis-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .chart-card.large {
            grid-column: span 1;
            grid-row: span 1;
          }
        }

        @media (max-width: 480px) {
          .page-header,
          .chart-card,
          .activities-section {
            padding: 1rem;
          }

          .kpi-card {
            padding: 1rem;
          }

          .activity-item {
            padding: 0.75rem;
          }

          .header-controls {
            flex-direction: column;
            width: 100%;
          }
        }

        /* Accessibility Improvements */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus States */
        .period-select:focus,
        .view-all-btn:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .kpi-card,
          .chart-card,
          .activities-section,
          .activity-item {
            border: 2px solid #1e293b;
          }
          
          .page-title,
          .section-title,
          .chart-title {
            color: #000;
          }
        }

        /* Print Styles */
        @media print {
          .performance-page {
            background: white;
          }
          
          .page-header,
          .kpi-card,
          .chart-card,
          .activities-section {
            background: white;
            border: 1px solid #000;
            box-shadow: none;
          }
          
          .view-all-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default AnalisePerformance;