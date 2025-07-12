import React, { useState, useRef, useEffect } from 'react';
import { 
  Lightbulb, MessageSquare, ChevronDown, Send, Eye, Download,
  CheckCircle, Mail, AlertCircle, Bot, Phone, Target
} from 'lucide-react';

function AssistenteIA() {
  const [selectedFunnel, setSelectedFunnel] = useState('Primeiro Contato');
  const [selectedSegment, setSelectedSegment] = useState('Tecnologia');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'user',
      text: 'Olá! Como posso guiá-lo com suas qualificações hoje?'
    },
    {
      type: 'ai',
      text: 'Ótimo! Para a TechStart, sugiro focar em perguntas sobre escalabilidade e automação. Eles estão em crescimento rápido...'
    }
  ]);

  const topCards = [
    {
      icon: Lightbulb,
      title: 'Assistente de Qualificação',
      subtitle: 'Sugestões inteligentes de perguntas e identificação de red flags',
      buttonText: 'Ativar Assistente',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-50'
    },
    {
      icon: MessageSquare,
      title: 'Gerador de Mensagens',
      subtitle: 'E-mails, scripts e mensagens personalizadas por contexto',
      buttonText: 'Gerar Mensagem',
      buttonColor: 'bg-blue-500 hover:bg-blue-600 text-white',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    },
    {
      icon: Target,
      title: 'Batedor de Metas',
      subtitle: 'Acompanhe e otimize seu desempenho para alcançar suas metas de vendas',
      buttonText: 'Iniciar Análise',
      buttonColor: 'bg-purple-500 hover:bg-purple-600 text-white',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50'
    },
    {
      icon: Mail,
      title: 'Gerador de E-mails',
      subtitle: 'Crie e-mails personalizados para prospecção, follow-up e relacionamento com clientes.',
      buttonText: 'Explorar Recurso',
      buttonColor: 'bg-green-500 hover:bg-green-600 text-white',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50'
    },
    {
      icon: Bot,
      title: 'Ideias para Qualificação',
      subtitle: 'Receba sugestões de perguntas estratégicas para qualificar melhor seus leads.',
      buttonText: 'Explorar Recurso',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600 text-white',
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50'
    },
    {
      icon: Phone,
      title: 'Scripts de Ligação',
      subtitle: 'Gere scripts personalizados e persuasivos para suas ligações comerciais.',
      buttonText: 'Explorar Recurso',
      buttonColor: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50'
    }
  ];

  const suggestions = [
    {
      icon: CheckCircle,
      iconColor: 'text-blue-500',
      title: 'Pergunta de descoberta',
      subtitle: 'Qual é o maior desafio que vocês enfrentam atualmente com o processo manual?',
      actions: ['Ver', 'Baixar']
    },
    {
      icon: Lightbulb,
      iconColor: 'text-yellow-500',
      title: 'Script para TechStart',
      subtitle: 'Olá Carlos, vi que a TechStart está crescendo rapidamente. Como vocês estão gerenciando...',
      actions: ['Ver', 'Baixar']
    },
    {
      icon: Mail,
      iconColor: 'text-green-500',
      title: 'E-mail de follow-up',
      subtitle: 'Assunto: Próximos passos para otimizar seus processos...',
      actions: ['Ver', 'Baixar']
    },
    {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      title: 'Resposta para objeção',
      subtitle: 'Entendo sua preocupação com o tempo de implementação. Na verdade...',
      actions: ['Ver', 'Baixar']
    }
  ];

  const funnelOptions = ['Primeiro Contato', 'Qualificação', 'Proposta', 'Fechamento'];
  const segmentOptions = ['Tecnologia', 'Saúde', 'Educação', 'Financeiro'];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, { type: 'user', text: chatMessage }]);
      setChatMessage('');
      
      // Simular resposta da IA
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          type: 'ai',
          text: 'Preciso de sugestões para qualificar a TechStart'
        }]);
      }, 1000);
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* Cards Superiores */}
      <div className="top-cards-grid">
        {topCards.map((card, index) => (
          <div key={index} className="top-card">
            <div className="card-header">
              <div className={`card-icon ${card.iconBg}`}>
                <card.icon className={`${card.iconColor}`} size={24} />
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-subtitle">{card.subtitle}</p>
            </div>
            <button className={`card-button ${card.buttonColor}`}>
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Layout Principal em 2 Colunas */}
      <div className="main-layout">
        {/* Coluna Esquerda - Sugestões */}
        <div className="left-column">
          <div className="suggestions-section">
            <h2 className="section-title">Sugestões da IA</h2>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  <div className="suggestion-header">
                    <div className="suggestion-icon">
                      <suggestion.icon className={suggestion.iconColor} size={20} />
                    </div>
                    <div className="suggestion-content">
                      <h4 className="suggestion-title">{suggestion.title}</h4>
                      <p className="suggestion-subtitle">{suggestion.subtitle}</p>
                    </div>
                  </div>
                  <div className="suggestion-actions">
                    {suggestion.actions.map((action, actionIndex) => (
                      <button key={actionIndex} className="action-button">
                        {action === 'Ver' ? <Eye size={16} /> : <Download size={16} />}
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="right-column">
          {/* Gerador de Scripts WhatsApp */}
          <div className="whatsapp-generator">
            <h3 className="generator-title">Gerador de Scripts WhatsApp</h3>
            
            <div className="generator-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Etapa do Funil</label>
                  <div className="custom-select">
                    <select 
                      value={selectedFunnel} 
                      onChange={(e) => setSelectedFunnel(e.target.value)}
                      className="select-input"
                    >
                      {funnelOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="select-arrow" size={16} />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Segmento do Lead</label>
                  <div className="custom-select">
                    <select 
                      value={selectedSegment} 
                      onChange={(e) => setSelectedSegment(e.target.value)}
                      className="select-input"
                    >
                      {segmentOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="select-arrow" size={16} />
                  </div>
                </div>
              </div>
              
              <button className="generate-button">
                <MessageSquare size={18} />
                Gerar Script WhatsApp
              </button>
            </div>
          </div>

          {/* Chat com IA */}
          <div className="chat-section">
            <h3 className="chat-title">Chat com IA</h3>
            
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  <div className="message-bubble">
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Digite sua pergunta..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="send-button">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ai-assistant-container {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          animation: fadeIn 0.6s ease-out;
        }

        .ai-assistant-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.02), transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.02), transparent 50%);
          pointer-events: none;
        }

        /* Cards Superiores */
        .top-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .top-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          text-align: center;
        }

        .top-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .card-header {
          margin-bottom: 1rem;
        }

        .card-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          transition: transform 0.3s ease;
        }

        .top-card:hover .card-icon {
          transform: scale(1.1);
        }

        .card-content {
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .card-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.4;
        }

        /* Cores específicas para os botões */
        .bg-yellow-500 {
          background-color: #eab308;
        }
        
        .bg-yellow-500:hover,
        .hover\\:bg-yellow-600:hover {
          background-color: #ca8a04;
        }
        
        .bg-blue-500 {
          background-color: #3b82f6;
        }
        
        .bg-blue-500:hover,
        .hover\\:bg-blue-600:hover {
          background-color: #2563eb;
        }
        
        .bg-purple-500 {
          background-color: #8b5cf6;
        }
        
        .bg-purple-500:hover,
        .hover\\:bg-purple-600:hover {
          background-color: #7c3aed;
        }
        
        .bg-green-500 {
          background-color: #22c55e;
        }
        
        .bg-green-500:hover,
        .hover\\:bg-green-600:hover {
          background-color: #16a34a;
        }
        
        .bg-indigo-500 {
          background-color: #6366f1;
        }
        
        .bg-indigo-500:hover,
        .hover\\:bg-indigo-600:hover {
          background-color: #4f46e5;
        }
        
        .bg-emerald-500 {
          background-color: #10b981;
        }
        
        .bg-emerald-500:hover,
        .hover\\:bg-emerald-600:hover {
          background-color: #059669;
        }

        .text-white {
          color: white;
        }

        /* Cores específicas para os ícones */
        .text-yellow-500 {
          color: #eab308;
        }

        .text-blue-500 {
          color: #3b82f6;
        }

        .text-purple-500 {
          color: #8b5cf6;
        }

        .text-green-600 {
          color: #16a34a;
        }

        .text-indigo-600 {
          color: #4f46e5;
        }

        .text-emerald-600 {
          color: #059669;
        }

        /* Backgrounds dos ícones */
        .bg-yellow-50 {
          background-color: #fefce8;
        }

        .bg-blue-50 {
          background-color: #eff6ff;
        }

        .bg-purple-50 {
          background-color: #faf5ff;
        }

        .bg-green-50 {
          background-color: #f0fdf4;
        }

        .bg-indigo-50 {
          background-color: #eef2ff;
        }

        .bg-emerald-50 {
          background-color: #ecfdf5;
        }

        .card-button {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .card-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Layout Principal */
        .main-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        /* Coluna Esquerda */
        .left-column {
          display: flex;
          flex-direction: column;
        }

        .suggestions-section {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          height: fit-content;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .suggestion-item {
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .suggestion-item:hover {
          background: #f1f5f9;
          transform: translateX(2px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border-color: #cbd5e1;
        }

        .suggestion-header {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .suggestion-icon {
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .suggestion-content {
          flex: 1;
        }

        .suggestion-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .suggestion-subtitle {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
        }

        .suggestion-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: #3b82f6;
          border: 1px solid #2563eb;
          border-radius: 6px;
          font-size: 0.75rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        /* Coluna Direita */
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .whatsapp-generator {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .generator-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .generator-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .custom-select {
          position: relative;
        }

        .select-input {
          width: 100%;
          padding: 0.75rem 2rem 0.75rem 0.75rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #1e293b;
          appearance: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .select-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .select-arrow {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
        }

        .generate-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .generate-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        /* Chat Section */
        .chat-section {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          flex: 1;
        }

        .chat-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .chat-messages {
          height: 200px;
          overflow-y: auto;
          margin-bottom: 1rem;
          padding: 0.5rem;
          border-radius: 8px;
          background: rgba(248, 250, 252, 0.5);
        }

        .chat-messages::-webkit-scrollbar {
          width: 4px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 2px;
        }

        .message {
          margin-bottom: 0.75rem;
          display: flex;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.ai {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .message.user .message-bubble {
          background: #3b82f6;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.ai .message-bubble {
          background: white;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        .chat-input-container {
          display: flex;
          gap: 0.5rem;
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #1e293b;
          transition: all 0.3s ease;
        }

        .chat-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .chat-input::placeholder {
          color: #9ca3af;
        }

        .send-button {
          padding: 0.75rem;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .top-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .main-layout {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .ai-assistant-container {
            padding: 1rem;
          }
          
          .top-cards-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .main-layout {
            gap: 1rem;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AssistenteIA;