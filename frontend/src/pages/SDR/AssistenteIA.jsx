import React, { useState, useEffect, useRef } from 'react';

function AssistenteIA() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Sou seu assistente de vendas com I.A. Como posso ajudar você hoje? Posso auxiliar com qualificação de leads, criação de propostas ou análise de pipeline.",
      sender: 'ai'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      setIsTyping(true);
      
      // Simular resposta da IA
      setTimeout(() => {
        const aiResponses = [
          "Entendi! Vou analisar isso para você. Com base nos dados históricos, recomendo focar nos leads que mostraram engajamento nos últimos 3 dias.",
          "Excelente pergunta! Posso criar um relatório detalhado sobre isso. Que período você gostaria de analisar?",
          "Baseado no seu histórico, identifiquei 3 oportunidades de alto valor. Gostaria que eu crie um plano de ação?",
          "Perfeito! Vou preparar uma análise preditiva personalizada. Isso pode levar alguns minutos para processar todos os dados.",
          "Ótima estratégia! Com base nas suas métricas atuais, essa abordagem pode aumentar sua conversão em até 25%."
        ];
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        const aiMessage = {
          id: Date.now() + 1,
          text: randomResponse,
          sender: 'ai'
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const startLeadGeneration = () => {
    alert('Iniciando geração de leads inteligente...');
  };

  const openEmailComposer = () => {
    alert('Abrindo composer de email com I.A...');
  };

  const analyzeDeals = () => {
    alert('Analisando pipeline de vendas...');
  };

  const openCallAssistant = () => {
    alert('Iniciando assistente de chamadas...');
  };

  const toggleQuickMenu = () => {
    alert('Menu rápido - Em desenvolvimento');
  };

  return (
    <div className="assistente-ia-container">
      {/* Header */}
      <header className="header glass">
        <div className="header-content">
          <div className="logo">
            🤖 Assistente I.A Vendas
          </div>
          <div className="user-info">
            <span>Bem-vindo, João Silva</span>
            <div className="user-avatar">JS</div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <h1>Acelere suas Vendas com I.A</h1>
          <p>Potencialize sua equipe de vendas com inteligência artificial avançada. Geração de leads, automação de follow-ups e insights preditivos em uma única plataforma.</p>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="action-card glass" onClick={startLeadGeneration}>
            <span className="action-icon">🎯</span>
            <div className="action-title">Geração de Leads</div>
            <div className="action-desc">Encontre prospects qualificados automaticamente</div>
          </div>
          <div className="action-card glass" onClick={openEmailComposer}>
            <span className="action-icon">✉️</span>
            <div className="action-title">Email Inteligente</div>
            <div className="action-desc">Crie emails personalizados com I.A</div>
          </div>
          <div className="action-card glass" onClick={analyzeDeals}>
            <span className="action-icon">📊</span>
            <div className="action-title">Análise de Deals</div>
            <div className="action-desc">Insights preditivos para fechamento</div>
          </div>
          <div className="action-card glass" onClick={openCallAssistant}>
            <span className="action-icon">📞</span>
            <div className="action-title">Assistente de Chamadas</div>
            <div className="action-desc">Coaching em tempo real durante calls</div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="main-grid">
          {/* Chat Interface */}
          <section className="chat-section glass-strong">
            <div className="chat-header">
              <h3>Chat com I.A</h3>
              <div className="chat-status">
                <span className="status-dot"></span>
                Online
              </div>
            </div>
            
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                  {message.text}
                </div>
              ))}
              {isTyping && (
                <div className="message ai">
                  <div className="loading"></div>
                  Digitando...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input">
              <input 
                type="text" 
                className="input-field" 
                placeholder="Digite sua mensagem..." 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="send-btn" onClick={sendMessage}>📩</button>
            </div>
          </section>

          {/* Analytics Panel */}
          <section className="analytics-panel glass-strong">
            <div className="analytics-header">
              <h3>Dashboard de Performance</h3>
              <p>Métricas em tempo real da sua equipe</p>
            </div>
            
            <div className="metric-cards">
              <div className="metric-card">
                <div className="metric-value">247</div>
                <div className="metric-label">Leads Gerados (mês)</div>
                <div className="metric-trend trend-up">↗ +23% vs mês anterior</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">18%</div>
                <div className="metric-label">Taxa de Conversão</div>
                <div className="metric-trend trend-up">↗ +5.2% vs mês anterior</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">R$ 89k</div>
                <div className="metric-label">Receita Gerada</div>
                <div className="metric-trend trend-up">↗ +12% vs mês anterior</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">4.2</div>
                <div className="metric-label">Score de Qualidade</div>
                <div className="metric-trend trend-up">↗ +0.3 vs mês anterior</div>
              </div>
            </div>
            
            <div className="glass pipeline-widget">
              <h4>Pipeline Inteligente</h4>
              <div className="pipeline-item">
                <span>Prospects</span>
                <span>34</span>
              </div>
              <div className="pipeline-item">
                <span>Qualificados</span>
                <span>12</span>
              </div>
              <div className="pipeline-item">
                <span>Proposta</span>
                <span>8</span>
              </div>
              <div className="pipeline-item">
                <span>Fechamento</span>
                <span>3</span>
              </div>
            </div>
          </section>
        </div>

        {/* Tools Section */}
        <section className="tools-section">
          <div className="section-header">
            <h2>Ferramentas Avançadas de I.A</h2>
            <p>Soluções completas para maximizar sua performance em vendas</p>
          </div>
          
          <div className="tools-grid">
            <div className="tool-card glass">
              <div className="tool-header">
                <span className="tool-icon">🔍</span>
                <div className="tool-title">Lead Scoring Inteligente</div>
              </div>
              <div className="tool-description">
                Algoritmo avançado que analisa comportamento, perfil e histórico para pontuar e priorizar leads automaticamente.
              </div>
              <ul className="tool-features">
                <li>Análise comportamental em tempo real</li>
                <li>Scoring preditivo baseado em ML</li>
                <li>Integração com CRM existente</li>
                <li>Alertas de alta prioridade</li>
              </ul>
            </div>

            <div className="tool-card glass">
              <div className="tool-header">
                <span className="tool-icon">🎨</span>
                <div className="tool-title">Gerador de Propostas</div>
              </div>
              <div className="tool-description">
                Crie propostas comerciais personalizadas e persuasivas usando templates inteligentes e dados do cliente.
              </div>
              <ul className="tool-features">
                <li>Templates adaptativos por segmento</li>
                <li>Personalização automática</li>
                <li>Análise de precificação</li>
                <li>Assinatura digital integrada</li>
              </ul>
            </div>

            <div className="tool-card glass">
              <div className="tool-header">
                <span className="tool-icon">📈</span>
                <div className="tool-title">Previsão de Vendas</div>
              </div>
              <div className="tool-description">
                Machine learning avançado para prever resultados de vendas e identificar oportunidades de crescimento.
              </div>
              <ul className="tool-features">
                <li>Previsões precisas por território</li>
                <li>Identificação de tendências</li>
                <li>Alertas de risco em deals</li>
                <li>Relatórios executivos automáticos</li>
              </ul>
            </div>

            <div className="tool-card glass">
              <div className="tool-header">
                <span className="tool-icon">🤖</span>
                <div className="tool-title">Chatbot Qualificador</div>
              </div>
              <div className="tool-description">
                Bot inteligente que qualifica leads 24/7, agenda reuniões e nutri prospects até estarem prontos para vendas.
              </div>
              <ul className="tool-features">
                <li>Qualificação automática BANT</li>
                <li>Agendamento inteligente</li>
                <li>Nutrição personalizada</li>
                <li>Handoff perfeito para SDRs</li>
              </ul>
            </div>

            <div className="tool-card glass">
              <div className="tool-header">
                <span className="tool-icon">📞</span>
                <div className="tool-title">Call Intelligence</div>
              </div>
              <div className="tool-description">
                Análise em tempo real de chamadas com insights sobre sentimento, objeções e momentos-chave para fechamento.
              </div>
              <ul className="tool-features">
                <li>Transcrição em tempo real</li>
                <li>Análise de sentimento</li>
                <li>Detecção de objeções</li>
                <li>Coaching automático</li>
              </ul>
            </div>

            <div className="tool-card glass">
              <div className="tool-header">
                <span className="tool-icon">🎯</span>
                <div className="tool-title">Sequências de Follow-up</div>
              </div>
              <div className="tool-description">
                Automação inteligente de follow-ups personalizados baseados no comportamento e estágio do prospect no funil.
              </div>
              <ul className="tool-features">
                <li>Sequências adaptativas</li>
                <li>A/B testing automático</li>
                <li>Timing otimizado por I.A</li>
                <li>Multi-canal (email, SMS, LinkedIn)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={toggleQuickMenu}>⚡</button>

      <style jsx>{`
        .assistente-ia-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          min-height: 100vh;
          color: #fff;
          overflow-x: hidden;
          position: relative;
        }

        .assistente-ia-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(255, 118, 117, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%);
          animation: gradientShift 15s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .glass-strong {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .header {
          padding: 1.5rem 2rem;
          border-radius: 0 0 24px 24px;
          margin-bottom: 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hero {
          text-align: center;
          margin-bottom: 3rem;
        }

        .hero h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fff, #f8fafc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .action-card {
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .action-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
        }

        .action-card:hover::before {
          opacity: 1;
        }

        .action-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .action-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .action-desc {
          opacity: 0.8;
          font-size: 0.95rem;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .chat-section {
          border-radius: 24px;
          padding: 2rem;
          height: 600px;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-header h3 {
          font-size: 1.4rem;
          font-weight: 600;
        }

        .chat-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 1rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) transparent;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }

        .message {
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 16px;
          max-width: 80%;
          animation: fadeInUp 0.3s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.ai {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          margin-right: auto;
        }

        .message.user {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          margin-left: auto;
        }

        .chat-input {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .input-field {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: #fff;
          font-size: 1rem;
          outline: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .send-btn {
          padding: 1rem;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .analytics-panel {
          border-radius: 24px;
          padding: 2rem;
        }

        .analytics-header {
          margin-bottom: 2rem;
        }

        .analytics-header h3 {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .metric-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          padding: 1.5rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          text-align: center;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.12);
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .metric-trend {
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        .trend-up {
          color: #10b981;
        }

        .trend-down {
          color: #ef4444;
        }

        .pipeline-widget {
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
        }

        .pipeline-widget h4 {
          margin-bottom: 1rem;
        }

        .pipeline-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .tools-section {
          margin-bottom: 3rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .tool-card {
          padding: 2rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .tool-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tool-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }

        .tool-card:hover::before {
          opacity: 1;
        }

        .tool-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .tool-icon {
          font-size: 2.5rem;
        }

        .tool-title {
          font-size: 1.3rem;
          font-weight: 600;
        }

        .tool-description {
          opacity: 0.9;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .tool-features {
          list-style: none;
          padding: 0;
        }

        .tool-features li {
          padding: 0.3rem 0;
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .tool-features li::before {
          content: '✓ ';
          color: #10b981;
          font-weight: 600;
        }

        .fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
        }

        .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.2rem;
          }
          
          .hero p {
            font-size: 1rem;
          }
          
          .quick-actions {
            grid-template-columns: 1fr;
          }
          
          .tools-grid {
            grid-template-columns: 1fr;
          }
          
          .container {
            padding: 0 1rem;
          }
          
          .header {
            padding: 1rem;
          }
          
          .metric-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AssistenteIA;