import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Send, Eye, CheckCircle, ArrowRight, Users, Target, Clock, Star, TrendingUp } from 'lucide-react';

function PassagemVendas() {
  // Limpa todos os dados de teste do Firestore e localStorage ao carregar a página
  useEffect(() => {
    const limparDados = async () => {
      // Limpa localStorage
      localStorage.removeItem('negocios');
      // Limpa Firestore: leads e negocios
      try {
        const leadsSnap = await getDocs(collection(db, 'leads'));
        for (const d of leadsSnap.docs) {
          await deleteDoc(doc(db, 'leads', d.id));
        }
        const negociosSnap = await getDocs(collection(db, 'negocios'));
        for (const d of negociosSnap.docs) {
          await deleteDoc(doc(db, 'negocios', d.id));
        }
      } catch (e) {
        // Ignora erros de permissão
      }
    };
    limparDados();
  }, []);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'leads'), where('status', '==', 'Qualificado'));
        const querySnapshot = await getDocs(q);
        const leadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeads(leadsData);
      } catch (e) {
        setLeads([]);
      }
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const [checklist, setChecklist] = useState([
    { id: 1, item: 'Informações de contato completas', checked: true },
    { id: 2, item: 'BANT preenchido no CRM', checked: true },
    { id: 3, item: 'Resumo da qualificação adicionado', checked: true },
    { id: 4, item: 'Próximos passos definidos com o lead', checked: false },
    { id: 5, item: 'Vendedor responsável atribuído', checked: false },
    { id: 6, item: 'Documentos relevantes anexados', checked: false },
    { id: 7, item: 'Timeline de follow-up estabelecido', checked: true }
  ]);

  const [selectedLead, setSelectedLead] = useState(null);
  
  const toggleChecklistItem = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Função para transferir lead qualificado para negócios do vendedor
  const handlePassagemLead = async (lead) => {
    setSelectedLead(lead);
    try {
      // Cria negócio para o vendedor (coleção 'negocios' ou similar)
      const novoNegocio = {
        id: Date.now(),
        titulo: `Negócio de ${lead.nome}`,
        cliente: lead.nome,
        empresa: lead.empresa,
        contato: lead.nome,
        valor: 0,
        probabilidade: 50,
        estagio: 'Qualificação',
        responsavel: '', // pode ser preenchido com o vendedor logado
        dataCriacao: new Date().toISOString(),
        ultimaAtualizacao: new Date().toISOString(),
        origem: lead.origem,
        prioridade: 'Média',
        email: lead.email || '',
        telefone: lead.telefone || '',
        segmento: '',
        funcionarios: '',
        website: '',
        endereco: '',
        observacoes: lead.resumo || '',
        proximaAcao: '',
        tag: 'Novo',
        concorrentes: [],
        motivos: [],
        avatar: lead.nome ? lead.nome.substring(0, 2).toUpperCase() : 'NN',
        atividades: 0,
        propostas: 0
      };
      await addDoc(collection(db, 'negocios'), novoNegocio);
      // Salva também no localStorage para aparecer no Kanban imediatamente
      let negociosLS = [];
      try {
        negociosLS = JSON.parse(localStorage.getItem('negocios')) || [];
      } catch (e) {}
      negociosLS.push(novoNegocio);
      localStorage.setItem('negocios', JSON.stringify(negociosLS));
      // Atualiza status do lead para 'Transferido'
      await updateDoc(doc(db, 'leads', lead.id), { status: 'Transferido' });
      setLeads(leads.filter(l => l.id !== lead.id));
      alert(`Lead ${lead.nome} transferido com sucesso para a equipe de vendas!`);
    } catch (e) {
      alert('Erro ao transferir lead.');
    }
    setSelectedLead(null);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'score-high';
    if (score >= 80) return 'score-medium';
    return 'score-low';
  };

  const completedItems = checklist.filter(item => item.checked).length;
  const totalItems = checklist.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  const stats = [
    { label: 'Leads Prontos', value: leads.length, icon: Users, color: '#3b82f6' },
    { label: 'Taxa Conversão', value: '94%', icon: Target, color: '#10b981' },
    { label: 'Tempo Médio', value: '2.3h', icon: Clock, color: '#f59e0b' },
    { label: 'Score Médio', value: '91.7', icon: Star, color: '#8b5cf6' }
  ];

  const checklistOk = checklist.every(i => i.checked);
  return (
    <div className="passagem-vendas-page">
      {/* Header Principal */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Passagem de Leads para Vendas</h1>
            <p className="page-subtitle">Transfira leads qualificados para a equipe de vendas com qualidade e eficiência</p>
          </div>
          <div className="header-badge">
            <div className="status-indicator"></div>
            <span>Sistema Ativo</span>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-trend">
                <TrendingUp size={14} />
                <span>+12%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Layout Principal */}
      <div className="main-grid">
        {/* Coluna Esquerda - Leads Prontos */}
        <div className="leads-section">
          <div className="section-header">
            <h3 className="section-title">Leads Prontos para Passagem</h3>
            <div className="leads-count">{leads.length} prontos</div>
          </div>

      <div className="leads-list">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>
        ) : leads.length > 0 ? leads.map(lead => (
          <div key={lead.id} className="lead-card">
                <div className="lead-header">
                  <div className="lead-info">
                    <div className="lead-avatar">
                      {lead.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="lead-details">
                      <h4 className="lead-name">{lead.nome}</h4>
                      <p className="lead-company">{lead.empresa}</p>
                    </div>
                  </div>
                  <div className={`score-badge ${getScoreColor(lead.pontuacao)}`}>
                    {lead.pontuacao}
                  </div>
                </div>

                <div className="lead-metadata">
                  <div className="metadata-item">
                    <span className="metadata-label">Origem:</span>
                    <span className="metadata-value">{lead.origem}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Último contato:</span>
                    <span className="metadata-value">{lead.ultimoContato}</span>
                  </div>
                </div>

                <p className="lead-summary">{lead.resumo}</p>

                <div className="lead-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handlePassagemLead(lead)}
                    disabled={selectedLead?.id === lead.id || !checklistOk}
                  >
                    {selectedLead?.id === lead.id ? (
                      <>Transferindo...</>
                    ) : (
                      <>
                        <Send size={16} />
                        Fazer Passagem
                      </>
                    )}
                  </button>
                  <button className="action-btn secondary">
                    <Eye size={16} />
                    Ver Detalhes
                  </button>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Users size={48} />
                </div>
                <h3 className="empty-title">Nenhum lead pronto</h3>
                <p className="empty-description">
                  Leads qualificados aparecerão aqui quando estiverem prontos para passagem
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita - Checklist */}
        <div className="checklist-section">
          <div className="checklist-header">
            <h3 className="section-title">Checklist de Handoff</h3>
            <div className="progress-info">
              <span className="progress-text">{completedItems}/{totalItems} concluídos</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="checklist-items">
            {checklist.map(item => (
              <label key={item.id} className="checklist-item">
                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => toggleChecklistItem(item.id)} 
                    className="checkbox-input"
                  />
                  <div className="checkbox-custom">
                    {item.checked && <CheckCircle size={16} />}
                  </div>
                </div>
                <span className={`item-text ${item.checked ? 'completed' : ''}`}>
                  {item.item}
                </span>
              </label>
            ))}
          </div>

          <div className="checklist-actions">
            <button 
              className={`validate-btn ${checklist.every(i => i.checked) ? 'enabled' : 'disabled'}`}
              disabled={!checklist.every(i => i.checked)}
            >
              <CheckCircle size={18} />
              Validar e Enviar
              <ArrowRight size={16} />
            </button>
            
            {!checklist.every(i => i.checked) && (
              <p className="validation-message">
                Complete todos os itens do checklist para continuar
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .passagem-vendas-page {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .passagem-vendas-page::before {
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

        .header-badge {
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
          backdrop-filter: blur(10px);
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        /* Stats Grid */
        .stats-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.6s ease;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .stat-icon {
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

        .stat-card:hover .stat-icon {
          transform: scale(1.1);
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          width: fit-content;
        }

        /* Main Grid */
        .main-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        /* Leads Section */
        .leads-section {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
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
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .leads-count {
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .leads-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .lead-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .lead-card:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .lead-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .lead-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .lead-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .lead-details {
          flex: 1;
        }

        .lead-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .lead-company {
          color: #64748b;
          font-size: 0.9rem;
        }

        .score-badge {
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .score-high {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
          color: #065f46;
        }

        .score-medium {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
          color: #92400e;
        }

        .score-low {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
          color: #991b1b;
        }

        .lead-metadata {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
        }

        .metadata-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .metadata-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        .metadata-value {
          font-size: 0.8rem;
          color: #1e293b;
          font-weight: 500;
        }

        .lead-summary {
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .lead-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .action-btn:hover::before {
          left: 100%;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          flex: 1;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .action-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .action-btn.primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        /* Checklist Section */
        .checklist-section {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          height: fit-content;
        }

        .checklist-header {
          margin-bottom: 1.5rem;
        }

        .progress-info {
          margin-top: 0.75rem;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .checklist-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .checklist-item:hover {
          background: rgba(248, 250, 252, 0.8);
        }

        .checkbox-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .checkbox-input {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .checkbox-custom {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          background: white;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }

        .item-text {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.4;
          transition: all 0.3s ease;
        }

        .item-text.completed {
          color: #1e293b;
          font-weight: 600;
        }

        .checklist-actions {
          border-top: 1px solid rgba(241, 245, 249, 0.8);
          padding-top: 1.5rem;
        }

        .validate-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .validate-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .validate-btn:hover::before {
          left: 100%;
        }

        .validate-btn.enabled {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .validate-btn.enabled:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .validate-btn.disabled {
          background: rgba(148, 163, 184, 0.2);
          color: #94a3b8;
          cursor: not-allowed;
        }

        .validation-message {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: #f59e0b;
          text-align: center;
          font-weight: 500;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(248, 250, 252, 0.6);
          border-radius: 12px;
          border: 2px dashed #cbd5e1;
        }

        .empty-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          background: rgba(148, 163, 184, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .empty-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .passagem-vendas-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.875rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .lead-metadata {
            grid-template-columns: 1fr;
          }

          .lead-actions {
            flex-direction: column;
          }

          .action-btn.primary {
            flex: none;
          }
        }

        @media (max-width: 480px) {
          .page-header,
          .leads-section,
          .checklist-section {
            padding: 1.5rem;
          }

          .lead-card {
            padding: 1rem;
          }

          .stat-card {
            padding: 1rem;
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
        .action-btn:focus,
        .validate-btn:focus,
        .checkbox-input:focus + .checkbox-custom {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .leads-section,
          .checklist-section,
          .lead-card {
            border: 2px solid #1e293b;
          }
          
          .page-title,
          .section-title,
          .lead-name {
            color: #000;
          }
        }

        /* Print Styles */
        @media print {
          .passagem-vendas-page {
            background: white;
          }
          
          .page-header,
          .leads-section,
          .checklist-section,
          .lead-card {
            background: white;
            border: 1px solid #000;
            box-shadow: none;
          }
          
          .action-btn,
          .validate-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default PassagemVendas;