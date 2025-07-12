import React, { useState } from 'react';
import { 
  CheckCircle, Send, DollarSign, Users, AlertCircle, Clock, 
  TrendingUp, Star, Lightbulb, FileText, MessageSquare, Target,
  ArrowRight, Award, BarChart3, CheckSquare, XCircle
} from 'lucide-react';

// Componente de Estilos Modernos com Glassmorphism
const QualificacaoStyles = () => (
  <style>{`
    :root {
      --primary-text: #111827;
      --secondary-text: #6b7280;
      --accent-blue: #2563eb;
      --accent-green: #10b981;
      --accent-orange: #f59e0b;
      --accent-purple: #8b5cf6;
      --accent-red: #ef4444;
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --border-light: #e5e7eb;
      --border-medium: #d1d5db;
    }

    .qualification-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem;
      position: relative;
    }

    .qualification-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05), transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05), transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.05), transparent 50%);
      pointer-events: none;
    }

    .qualification-content {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 1rem;
    }

    .header-subtitle {
      font-size: 1.1rem;
      color: var(--secondary-text);
      margin-bottom: 0;
    }

    .bant-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .bant-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }

    .bant-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.6s ease;
    }

    .bant-card:hover::before {
      left: 100%;
    }

    .bant-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .bant-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .bant-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .bant-icon.budget {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(34, 197, 94, 0.15));
      box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
      color: #059669;
    }

    .bant-icon.authority {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(59, 130, 246, 0.15));
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
      color: #1d4ed8;
    }

    .bant-icon.need {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.15));
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
      color: #d97706;
    }

    .bant-icon.timeline {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.15));
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
      color: #7c3aed;
    }

    .bant-icon:hover {
      transform: scale(1.1);
    }

    .bant-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: var(--primary-text);
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }

    .form-select {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 1px solid rgba(229, 231, 235, 0.6);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      color: var(--primary-text);
      font-size: 0.95rem;
      transition: all 0.3s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.75rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 3rem;
    }

    .form-select:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-1px);
    }

    .form-select option {
      background: white;
      color: var(--primary-text);
      padding: 0.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s ease;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9));
      color: white;
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .results-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 3rem;
    }

    .score-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 3rem 2rem;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .score-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .score-display {
      font-size: 4rem;
      font-weight: 900;
      margin-bottom: 1rem;
    }

    .score-high { color: #10b981; }
    .score-medium { color: #f59e0b; }
    .score-low { color: #ef4444; }

    .score-label {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary-text);
      margin-bottom: 2rem;
    }

    .recommendations-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .recommendations-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .recommendation-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: rgba(248, 250, 252, 0.6);
      border-radius: 8px;
      margin-bottom: 1rem;
      border: 1px solid rgba(229, 231, 235, 0.3);
      transition: all 0.3s ease;
    }

    .recommendation-item:hover {
      background: rgba(248, 250, 252, 0.8);
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .recommendation-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
      flex-shrink: 0;
    }

    .recommendation-text {
      color: var(--secondary-text);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .scripts-section {
      margin-top: 3rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .scripts-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 2rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .scripts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .script-card {
      background: rgba(248, 250, 252, 0.6);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(229, 231, 235, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .script-card:hover {
      background: rgba(248, 250, 252, 0.8);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .script-card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--primary-text);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .script-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .script-list li {
      color: var(--secondary-text);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 0.75rem;
      padding-left: 1.5rem;
      position: relative;
    }

    .script-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--accent-blue);
      font-weight: bold;
    }

    .script-example {
      background: rgba(59, 130, 246, 0.05);
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
      border-left: 4px solid var(--accent-blue);
    }

    .script-example-text {
      color: var(--secondary-text);
      font-style: italic;
      line-height: 1.6;
      margin: 0;
    }

    .progress-indicator {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
    }

    .progress-step {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.4);
      color: rgba(107, 114, 128, 0.8);
      font-weight: 600;
      transition: all 0.3s ease;
      border: 2px solid rgba(229, 231, 235, 0.5);
    }

    .progress-step.active {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 1));
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.5);
      border-color: var(--accent-blue);
    }

    .progress-step.completed {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 1));
      color: white;
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.5);
      border-color: var(--accent-green);
    }

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

    .fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }

    @media (max-width: 768px) {
      .qualification-container {
        padding: 1rem;
      }

      .header-title {
        font-size: 2rem;
      }

      .results-container {
        grid-template-columns: 1fr;
      }

      .bant-grid {
        grid-template-columns: 1fr;
      }

      .scripts-grid {
        grid-template-columns: 1fr;
      }
    }
  `}</style>
);

function Qualificacao() {
  const [bant, setBant] = useState({ 
    budget: '', 
    authority: '', 
    need: '', 
    timeline: '' 
  });
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBant(prev => ({ ...prev, [name]: value }));
  };
  
  const calculateScore = () => {
    let newScore = 0;
    if (bant.budget === 'Confirmado') newScore += 25;
    else if (bant.budget === 'Em análise') newScore += 15;
    
    if (bant.authority === 'Decisor') newScore += 25;
    else if (bant.authority === 'Influenciador') newScore += 15;
    else if (bant.authority === 'Usuário') newScore += 5;
    
    if (bant.need === 'Crítica') newScore += 25;
    else if (bant.need === 'Importante') newScore += 15;
    else if (bant.need === 'Potencial') newScore += 5;
    
    if (bant.timeline === 'Curto') newScore += 25;
    else if (bant.timeline === 'Médio') newScore += 15;
    else if (bant.timeline === 'Longo') newScore += 5;
    
    setScore(newScore);
    setShowResult(true);
  };

  const getScoreColor = () => {
    if (score >= 75) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  const getScoreLabel = () => {
    if (score >= 75) return 'Lead Quente! 🔥';
    if (score >= 50) return 'Potencial Bom 👍';
    return 'Qualificação Baixa ⚠️';
  };

  const getRecommendations = () => {
    if (score >= 75) {
      return [
        { icon: <ArrowRight />, text: "Priorize este lead e entre em contato imediatamente" },
        { icon: <Award />, text: "Prepare uma proposta personalizada e detalhada" },
        { icon: <Calendar />, text: "Agende uma demonstração ou reunião de fechamento" },
        { icon: <Star />, text: "Envolva decisores sêniors no processo de venda" }
      ];
    } else if (score >= 50) {
      return [
        { icon: <Target />, text: "Continue o processo de nutrição com conteúdo relevante" },
        { icon: <MessageSquare />, text: "Identifique e conecte-se com mais decisores" },
        { icon: <Clock />, text: "Estabeleça um cronograma mais claro para a decisão" },
        { icon: <BarChart3 />, text: "Demonstre ROI e valor específicos para o negócio" }
      ];
    } else {
      return [
        { icon: <Lightbulb />, text: "Eduque o lead sobre os benefícios da solução" },
        { icon: <Users />, text: "Identifique os verdadeiros decisores na organização" },
        { icon: <DollarSign />, text: "Explore opções de orçamento e financiamento" },
        { icon: <XCircle />, text: "Considere desqualificar se não houver progressão" }
      ];
    }
  };

  const completedSteps = Object.values(bant).filter(value => value !== '').length;

  return (
    <>
      <QualificacaoStyles />
      <div className="qualification-container">
        <div className="qualification-content fade-in-up">
          
          {/* Header */}
          <div className="header-section">
            <h1 className="header-title">Qualificação BANT</h1>
            <p className="header-subtitle">
              Sistema inteligente de qualificação de leads baseado em Budget, Authority, Need e Timeline
            </p>
          </div>

          {/* Indicador de Progresso */}
          <div className="progress-indicator">
            <div className={`progress-step ${bant.budget ? 'completed' : completedSteps >= 0 ? 'active' : ''}`}>
              <DollarSign size={20} />
            </div>
            <div className={`progress-step ${bant.authority ? 'completed' : completedSteps >= 1 ? 'active' : ''}`}>
              <Users size={20} />
            </div>
            <div className={`progress-step ${bant.need ? 'completed' : completedSteps >= 2 ? 'active' : ''}`}>
              <AlertCircle size={20} />
            </div>
            <div className={`progress-step ${bant.timeline ? 'completed' : completedSteps >= 3 ? 'active' : ''}`}>
              <Clock size={20} />
            </div>
          </div>

          {/* Cards BANT */}
          <div className="bant-grid">
            
            {/* Budget */}
            <div className="bant-card">
              <div className="bant-header">
                <div className="bant-icon budget">
                  <DollarSign size={24} color="white" />
                </div>
                <h3 className="bant-title">Budget</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Situação do Orçamento</label>
                <select 
                  name="budget" 
                  value={bant.budget} 
                  onChange={handleChange} 
                  className="form-select"
                >
                  <option value="">Selecione a situação...</option>
                  <option value="Confirmado">✅ Confirmado e Aprovado</option>
                  <option value="Em análise">🔄 Em Análise/Planejamento</option>
                  <option value="Sem orçamento">❌ Sem Orçamento Definido</option>
                </select>
              </div>
            </div>

            {/* Authority */}
            <div className="bant-card">
              <div className="bant-header">
                <div className="bant-icon authority">
                  <Users size={24} color="white" />
                </div>
                <h3 className="bant-title">Authority</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Nível de Autoridade</label>
                <select 
                  name="authority" 
                  value={bant.authority} 
                  onChange={handleChange} 
                  className="form-select"
                >
                  <option value="">Selecione o nível...</option>
                  <option value="Decisor">👑 Decisor Final</option>
                  <option value="Influenciador">🎯 Influenciador-Chave</option>
                  <option value="Usuário">👤 Usuário/Avaliador</option>
                </select>
              </div>
            </div>

            {/* Need */}
            <div className="bant-card">
              <div className="bant-header">
                <div className="bant-icon need">
                  <AlertCircle size={24} color="white" />
                </div>
                <h3 className="bant-title">Need</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Urgência da Necessidade</label>
                <select 
                  name="need" 
                  value={bant.need} 
                  onChange={handleChange} 
                  className="form-select"
                >
                  <option value="">Selecione a urgência...</option>
                  <option value="Crítica">🔥 Crítica (Problema Urgente)</option>
                  <option value="Importante">⚡ Importante (Melhoria Necessária)</option>
                  <option value="Potencial">💡 Potencial (Interesse Futuro)</option>
                </select>
              </div>
            </div>

            {/* Timeline */}
            <div className="bant-card">
              <div className="bant-header">
                <div className="bant-icon timeline">
                  <Clock size={24} color="white" />
                </div>
                <h3 className="bant-title">Timeline</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Prazo para Decisão</label>
                <select 
                  name="timeline" 
                  value={bant.timeline} 
                  onChange={handleChange} 
                  className="form-select"
                >
                  <option value="">Selecione o prazo...</option>
                  <option value="Curto">⚡ Curto (1-3 meses)</option>
                  <option value="Médio">⏳ Médio (3-6 meses)</option>
                  <option value="Longo">📅 Longo (6+ meses)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Botão de Cálculo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={calculateScore}
              disabled={Object.values(bant).some(value => value === '')}
            >
              <CheckCircle size={20} /> Calcular Pontuação BANT
            </button>
          </div>

          {/* Resultados */}
          {showResult && (
            <div className="results-container">
              <div className="score-card">
                <div className={`score-display ${getScoreColor()}`}>
                  {score}
                </div>
                <div className="score-label">{getScoreLabel()}</div>
                <button className="btn btn-secondary" onClick={() => alert('Lead qualificado e enviado para o pipeline!')}>
                  <Send size={20} /> Finalizar Qualificação
                </button>
              </div>

              <div className="recommendations-card">
                <h3 className="recommendations-title">
                  <Lightbulb size={24} />
                  Próximos Passos
                </h3>
                {getRecommendations().map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="recommendation-icon">
                      {rec.icon}
                    </div>
                    <div className="recommendation-text">
                      {rec.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scripts de Apoio */}
          <div className="scripts-section">
            <h3 className="scripts-title">
              <MessageSquare size={28} />
              Scripts e Ferramentas de Apoio
            </h3>
            
            <div className="scripts-grid">
              <div className="script-card">
                <h4 className="script-card-title">
                  <Target size={20} />
                  Perguntas de Descoberta
                </h4>
                <ul className="script-list">
                  <li>Como vocês gerenciam [processo] atualmente?</li>
                  <li>Quais desafios vocês enfrentam com [processo atual]?</li>
                  <li>Como esses desafios impactam seus objetivos?</li>
                  <li>Se pudessem melhorar algo, o que seria?</li>
                  <li>Qual seria o impacto financeiro de resolver isso?</li>
                  <li>Quem mais está envolvido nesta decisão?</li>
                </ul>
              </div>

              <div className="script-card">
                <h4 className="script-card-title">
                  <FileText size={20} />
                  Script de Abertura
                </h4>
                <div className="script-example">
                  <p className="script-example-text">
                    "Olá [Nome], vi que sua empresa atua com [Setor]. Muitas empresas como a sua enfrentam [Desafio Comum]. Nossa solução ajuda a [Benefício Principal]. 
                    Faz sentido conversarmos sobre como podemos ajudar a [Objetivo Específico]?"
                  </p>
                </div>
              </div>

              <div className="script-card">
                <h4 className="script-card-title">
                  <CheckSquare size={20} />
                  Checklist de Qualificação
                </h4>
                <ul className="script-list">
                  <li>Orçamento definido ou em planejamento?</li>
                  <li>Decisor identificado e engajado?</li>
                  <li>Necessidade crítica ou importante?</li>
                  <li>Timeline realista para implementação?</li>
                  <li>Competição mapeada?</li>
                  <li>ROI claramente definido?</li>
                </ul>
              </div>

              <div className="script-card">
                <h4 className="script-card-title">
                  <TrendingUp size={20} />
                  Perguntas de Fechamento
                </h4>
                <ul className="script-list">
                  <li>Com base no que conversamos, faz sentido avançar?</li>
                  <li>Quais seriam os próximos passos ideais?</li>
                  <li>Quando podemos agendar uma demonstração?</li>
                  <li>Há algo que eu deveria saber antes da próxima conversa?</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Qualificacao;