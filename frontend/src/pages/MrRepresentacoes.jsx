import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  MessageCircle, 
  Instagram, 
  Phone, 
  FileStack, 
  Send, 
  Clock, 
  Calendar, 
  CheckCircle, 
  ClipboardList,
  Building,
  User,
  Target,
  TrendingUp,
  AlertCircle,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

const MrRepresentacoes = () => {
  // Estado das tarefas de rotina
  const [routineTasks, setRoutineTasks] = useState([]);

  // Estado das atividades delegadas pelo representante
  const [delegatedTasks, setDelegatedTasks] = useState([]);

  // Estado das solicitações e propostas
  const [proposals, setProposals] = useState([]);

  // Estado das licitações detalhadas
  const [biddings, setBiddings] = useState([]);

  const [currentDate, setCurrentDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    text: '',
    company: '',
    priority: 'Média',
    deadline: ''
  });

  // Estados para licitações
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [showBiddingDetailModal, setShowBiddingDetailModal] = useState(false);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [selectedBidding, setSelectedBidding] = useState(null);
  
  const [newBidding, setNewBidding] = useState({
    number: '',
    title: '',
    client: '',
    value: '',
    openingDate: '',
    deliveryDate: '',
    currentStage: 'Preparando Documentação',
    nextAction: ''
  });

  // Lista de documentos padrão para licitações
  const standardDocuments = [
    { name: 'Proposta Comercial', description: 'Planilha com preços e condições comerciais' },
    { name: 'Proposta Técnica', description: 'Especificações técnicas dos produtos/serviços' },
    { name: 'Documentação de Habilitação', description: 'Documentos da empresa (CNPJ, Inscrições, etc.)' },
    { name: 'Certidões Negativas', description: 'CND Federal, Estadual, Municipal, FGTS, Trabalhista' },
    { name: 'Atestados de Capacidade Técnica', description: 'Comprovação de experiência anterior' },
    { name: 'Declarações', description: 'Declarações exigidas pelo edital' },
    { name: 'Garantia de Proposta', description: 'Seguro garantia ou caução (quando exigido)' },
    { name: 'Catálogo de Produtos', description: 'Material promocional e técnico dos produtos' }
  ];

  // Atualizar data atual
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(formattedDate);
  }, []);

  // Função para alternar status das tarefas
  const handleToggle = (id, list, setList) => {
    setList(
      list.map(task => 
        task.id === id ? { 
          ...task, 
          completed: !task.completed,
          lastCompleted: !task.completed ? new Date().toLocaleString('pt-BR') : null
        } : task
      )
    );
  };

  // Função para adicionar nova tarefa delegada
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.text.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask.text,
      company: newTask.company,
      priority: newTask.priority,
      deadline: newTask.deadline,
      completed: false,
      icon: FileStack
    };

    setDelegatedTasks([...delegatedTasks, task]);
    setNewTask({ text: '', company: '', priority: 'Média', deadline: '' });
    setShowAddModal(false);
  };

  // Função para adicionar nova licitação
  const handleAddBidding = (e) => {
    e.preventDefault();
    if (!newBidding.number.trim() || !newBidding.title.trim()) return;

    const bidding = {
      id: Date.now(),
      ...newBidding,
      progress: 10,
      documents: [
        { name: 'Proposta Comercial', status: 'pendente', required: true },
        { name: 'Documentação de Habilitação', status: 'pendente', required: true },
        { name: 'Certidões', status: 'pendente', required: true }
      ],
      timeline: [
        { stage: 'Edital Publicado', date: new Date().toISOString().split('T')[0], status: 'completed' },
        { stage: 'Proposta Enviada', date: newBidding.openingDate, status: 'pending' },
        { stage: 'Habilitação', date: '', status: 'pending' },
        { stage: 'Análise de Propostas', date: '', status: 'pending' },
        { stage: 'Resultado Final', date: '', status: 'pending' }
      ]
    };

    setBiddings([...biddings, bidding]);
    setNewBidding({
      number: '',
      title: '',
      client: '',
      value: '',
      openingDate: '',
      deliveryDate: '',
      currentStage: 'Preparando Documentação',
      nextAction: ''
    });
    setShowBiddingModal(false);
  };

  // Função para atualizar status do documento
  const updateDocumentStatus = (biddingId, documentName, newStatus) => {
    setBiddings(biddings.map(bidding => {
      if (bidding.id === biddingId) {
        const updatedDocuments = bidding.documents.map(doc => 
          doc.name === documentName ? { ...doc, status: newStatus } : doc
        );
        
        const totalDocs = updatedDocuments.filter(d => d.required).length;
        const completedDocs = updatedDocuments.filter(d => d.required && d.status === 'enviado').length;
        const newProgress = Math.round((completedDocs / totalDocs) * 100);
        
        return {
          ...bidding,
          documents: updatedDocuments,
          progress: newProgress
        };
      }
      return bidding;
    }));
  };

  // Calcular estatísticas
  const stats = {
    totalTasks: delegatedTasks.length + proposals.length,
    completedTasks: [...delegatedTasks, ...proposals].filter(t => t.completed).length,
    delegatedComplete: delegatedTasks.filter(t => t.completed).length,
    proposalsComplete: proposals.filter(t => t.completed).length
  };

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  // Função para obter cor da prioridade
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'priority-high';
      case 'Média': return 'priority-medium';
      case 'Baixa': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  return (
    <div className="mr-page">
      {/* Header Principal */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="main-title">MR Representações</h1>
            <p className="main-subtitle">Central de atividades diárias e acompanhamento de processos</p>
            <div className="date-info">
              <Calendar size={18} />
              <span>Hoje é {currentDate}</span>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-number">{completionRate}%</div>
              <div className="stat-label">Concluído</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.completedTasks}/{stats.totalTasks}</div>
              <div className="stat-label">Tarefas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.delegatedComplete}/{delegatedTasks.length}</div>
            <div className="stat-label">Atividades Delegadas</div>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${delegatedTasks.length > 0 ? (stats.delegatedComplete / delegatedTasks.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.proposalsComplete}/{proposals.length}</div>
            <div className="stat-label">Propostas/Licitações</div>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${proposals.length > 0 ? (stats.proposalsComplete / proposals.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Taxa de Conclusão</div>
            <div className="stat-trend positive">
              <TrendingUp size={14} />
              <span>+5% vs ontem</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Principal */}
      <div className="main-grid">
        {/* Coluna Principal - Tarefas */}
        <div className="tasks-column">
          
          {/* Atividades Delegadas */}
          <div className="task-section">
            <div className="section-header">
              <div className="section-title">
                <User size={22} />
                <h3>Atividades Delegadas pelo Representante</h3>
              </div>
              <div className="section-actions">
                <button 
                  className="add-task-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={16} />
                  Nova Tarefa
                </button>
              </div>
            </div>

            <div className="task-list">
              {delegatedTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-item delegated ${task.completed ? 'completed' : ''}`}
                  onClick={() => handleToggle(task.id, delegatedTasks, setDelegatedTasks)}
                >
                  <div className="task-checkbox">
                    <CheckCircle size={20} className="checkmark" />
                  </div>
                  <div className="task-content">
                    <div className="task-text">{task.text}</div>
                    <div className="task-meta">
                      <span className="company-badge">{task.company}</span>
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.deadline && (
                        <span className="deadline-badge">
                          <Calendar size={14} />
                          {new Date(task.deadline).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="task-icon">
                    <task.icon size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acompanhamento de Propostas */}
          <div className="task-section">
            <div className="section-header">
              <div className="section-title">
                <FileStack size={22} />
                <h3>Acompanhamento de Propostas e Licitações</h3>
              </div>
              <div className="section-actions">
                <button 
                  className="action-btn info"
                  onClick={() => setShowDocumentationModal(true)}
                >
                  <FileStack size={16} />
                  Documentação Padrão
                </button>
                <button 
                  className="action-btn primary"
                  onClick={() => setShowBiddingModal(true)}
                >
                  <Plus size={16} />
                  Nova Licitação
                </button>
              </div>
            </div>

            <div className="task-list">
              {proposals.map(proposal => (
                <div 
                  key={proposal.id} 
                  className={`task-item proposal ${proposal.completed ? 'completed' : ''}`}
                  onClick={() => handleToggle(proposal.id, proposals, setProposals)}
                >
                  <div className="task-checkbox">
                    <CheckCircle size={20} className="checkmark" />
                  </div>
                  <div className="task-content">
                    <div className="task-text">{proposal.text}</div>
                    <div className="task-meta">
                      <span className="client-badge">{proposal.client}</span>
                      <span className="status-badge">{proposal.status}</span>
                      <span className="value-badge">{proposal.value}</span>
                    </div>
                  </div>
                  <div className="task-icon">
                    <proposal.icon size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gestão Detalhada de Licitações */}
          <div className="task-section">
            <div className="section-header">
              <div className="section-title">
                <Target size={22} />
                <h3>Gestão Detalhada de Licitações</h3>
              </div>
              <div className="section-badge">
                {biddings.length} licitações em acompanhamento
              </div>
            </div>

            <div className="biddings-grid">
              {biddings.map(bidding => (
                <div key={bidding.id} className="bidding-card">
                  <div className="bidding-header">
                    <div className="bidding-info">
                      <h4 className="bidding-number">{bidding.number}</h4>
                      <p className="bidding-title">{bidding.title}</p>
                      <p className="bidding-client">{bidding.client}</p>
                    </div>
                    <div className="bidding-value">{bidding.value}</div>
                  </div>

                  <div className="bidding-progress">
                    <div className="progress-header">
                      <span className="current-stage">{bidding.currentStage}</span>
                      <span className="progress-percentage">{bidding.progress}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${bidding.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bidding-dates">
                    <div className="date-item">
                      <Calendar size={14} />
                      <span>Abertura: {new Date(bidding.openingDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="date-item">
                      <Clock size={14} />
                      <span>Entrega: {new Date(bidding.deliveryDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="bidding-next-action">
                    <AlertCircle size={16} />
                    <span>{bidding.nextAction}</span>
                  </div>

                  <div className="bidding-actions">
                    <button 
                      className="bidding-btn primary"
                      onClick={() => {
                        setSelectedBidding(bidding);
                        setShowBiddingDetailModal(true);
                      }}
                    >
                      <Eye size={16} />
                      Ver Detalhes
                    </button>
                    <button className="bidding-btn secondary">
                      <Edit size={16} />
                      Editar
                    </button>
                  </div>
                </div>
              ))}

              {biddings.length === 0 && (
                <div className="empty-biddings">
                  <Target size={48} />
                  <h3>Nenhuma licitação cadastrada</h3>
                  <p>Adicione licitações para acompanhar o progresso e documentação</p>
                  <button 
                    className="add-first-bidding"
                    onClick={() => setShowBiddingModal(true)}
                  >
                    <Plus size={16} />
                    Cadastrar Primeira Licitação
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Lateral - Resumo */}
        <div className="summary-column">
          
          {/* Tarefas Concluídas Hoje */}
          <div className="summary-section">
            <div className="section-header">
              <div className="section-title">
                <CheckCircle size={22} />
                <h3>Concluídas Hoje</h3>
              </div>
            </div>

            <div className="completed-list">
              {[...delegatedTasks, ...proposals]
                .filter(task => task.completed)
                .map(task => (
                  <div key={task.id} className="completed-item">
                    <div className="completed-icon">
                      <CheckCircle size={16} />
                    </div>
                    <div className="completed-text">{task.text}</div>
                  </div>
                ))}
              
              {[...delegatedTasks, ...proposals].filter(t => t.completed).length === 0 && (
                <div className="empty-state">
                  <AlertCircle size={24} />
                  <p>Nenhuma tarefa concluída ainda</p>
                  <span>Comece marcando algumas tarefas!</span>
                </div>
              )}
            </div>
          </div>

          {/* Próximas Ações */}
          <div className="summary-section">
            <div className="section-header">
              <div className="section-title">
                <Clock size={22} />
                <h3>Próximas Ações</h3>
              </div>
            </div>

            <div className="next-actions">
              <div className="action-item">
                <div className="action-time">09:00</div>
                <div className="action-text">Verificar mensagens WhatsApp</div>
              </div>
              <div className="action-item">
                <div className="action-time">10:30</div>
                <div className="action-text">Postar stories Instagram</div>
              </div>
              <div className="action-item">
                <div className="action-time">14:00</div>
                <div className="action-text">Ligações para clientes</div>
              </div>
            </div>
          </div>

          {/* Lembretes */}
          <div className="summary-section">
            <div className="section-header">
              <div className="section-title">
                <AlertCircle size={22} />
                <h3>Lembretes</h3>
              </div>
            </div>

            <div className="reminders-list">
              <div className="reminder-item">
                <div className="reminder-icon urgent">!</div>
                <div className="reminder-text">Proposta #102 vence amanhã</div>
              </div>
              <div className="reminder-item">
                <div className="reminder-icon normal">📋</div>
                <div className="reminder-text">Relatório semanal na sexta</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nova Licitação */}
      {showBiddingModal && (
        <div className="modal-overlay" onClick={() => setShowBiddingModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nova Licitação</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowBiddingModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddBidding}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Número da Licitação</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newBidding.number}
                    onChange={(e) => setNewBidding({ ...newBidding, number: e.target.value })}
                    placeholder="Ex: LIC-2025-001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Valor da Proposta</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newBidding.value}
                    onChange={(e) => setNewBidding({ ...newBidding, value: e.target.value })}
                    placeholder="Ex: R$ 25.000,00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Título/Objeto da Licitação</label>
                <input
                  type="text"
                  className="form-input"
                  value={newBidding.title}
                  onChange={(e) => setNewBidding({ ...newBidding, title: e.target.value })}
                  placeholder="Ex: Fornecimento de Embalagens..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cliente/Órgão</label>
                <input
                  type="text"
                  className="form-input"
                  value={newBidding.client}
                  onChange={(e) => setNewBidding({ ...newBidding, client: e.target.value })}
                  placeholder="Ex: Prefeitura Municipal..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Data de Abertura</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newBidding.openingDate}
                    onChange={(e) => setNewBidding({ ...newBidding, openingDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Entrega</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newBidding.deliveryDate}
                    onChange={(e) => setNewBidding({ ...newBidding, deliveryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Estágio Atual</label>
                  <select
                    className="form-select"
                    value={newBidding.currentStage}
                    onChange={(e) => setNewBidding({ ...newBidding, currentStage: e.target.value })}
                  >
                    <option value="Preparando Documentação">Preparando Documentação</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Habilitação">Habilitação</option>
                    <option value="Análise de Propostas">Análise de Propostas</option>
                    <option value="Resultado Final">Resultado Final</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Próxima Ação</label>
                <input
                  type="text"
                  className="form-input"
                  value={newBidding.nextAction}
                  onChange={(e) => setNewBidding({ ...newBidding, nextAction: e.target.value })}
                  placeholder="Ex: Finalizar proposta técnica..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowBiddingModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Cadastrar Licitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes da Licitação */}
      {showBiddingDetailModal && selectedBidding && (
        <div className="modal-overlay" onClick={() => setShowBiddingDetailModal(false)}>
          <div className="modal-content extra-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{selectedBidding.number}</h3>
                <p className="modal-subtitle">{selectedBidding.title}</p>
              </div>
              <button 
                className="close-btn" 
                onClick={() => setShowBiddingDetailModal(false)}
              >
                ×
              </button>
            </div>

            <div className="bidding-detail-content">
              {/* Timeline */}
              <div className="detail-section">
                <h4 className="detail-title">Timeline do Processo</h4>
                <div className="timeline">
                  {selectedBidding.timeline.map((stage, index) => (
                    <div key={index} className={`timeline-item ${stage.status}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h5 className="timeline-stage">{stage.stage}</h5>
                        {stage.date && (
                          <p className="timeline-date">
                            {new Date(stage.date).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentos */}
              <div className="detail-section">
                <h4 className="detail-title">Documentação</h4>
                <div className="documents-grid">
                  {selectedBidding.documents.map((doc, index) => (
                    <div key={index} className={`document-item ${doc.status}`}>
                      <div className="document-header">
                        <span className="document-name">{doc.name}</span>
                        <span className={`document-status ${doc.status}`}>
                          {doc.status === 'enviado' && <CheckCircle size={16} />}
                          {doc.status === 'pendente' && <Clock size={16} />}
                          {doc.status === 'rascunho' && <Edit size={16} />}
                          {doc.status}
                        </span>
                      </div>
                      <div className="document-actions">
                        <select
                          value={doc.status}
                          onChange={(e) => updateDocumentStatus(selectedBidding.id, doc.name, e.target.value)}
                          className="status-select"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="rascunho">Em Rascunho</option>
                          <option value="enviado">Enviado</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações Gerais */}
              <div className="detail-section">
                <h4 className="detail-title">Informações Gerais</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Cliente:</strong> {selectedBidding.client}
                  </div>
                  <div className="info-item">
                    <strong>Valor:</strong> {selectedBidding.value}
                  </div>
                  <div className="info-item">
                    <strong>Abertura:</strong> {new Date(selectedBidding.openingDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="info-item">
                    <strong>Entrega:</strong> {new Date(selectedBidding.deliveryDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="info-item">
                    <strong>Próxima Ação:</strong> {selectedBidding.nextAction}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setShowBiddingDetailModal(false)}
              >
                Fechar
              </button>
              <button className="btn-save">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Documentação Padrão */}
      {showDocumentationModal && (
        <div className="modal-overlay" onClick={() => setShowDocumentationModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Documentação Padrão para Licitações</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowDocumentationModal(false)}
              >
                ×
              </button>
            </div>

            <div className="documentation-content">
              <p className="documentation-intro">
                Lista de documentos comumente exigidos em licitações. Use como checklist para preparação:
              </p>

              <div className="documentation-list">
                {standardDocuments.map((doc, index) => (
                  <div key={index} className="documentation-item">
                    <div className="doc-header">
                      <FileStack size={20} />
                      <h4 className="doc-name">{doc.name}</h4>
                    </div>
                    <p className="doc-description">{doc.description}</p>
                  </div>
                ))}
              </div>

              <div className="documentation-tips">
                <h4>💡 Dicas Importantes:</h4>
                <ul>
                  <li>Sempre verifique o edital para documentos específicos</li>
                  <li>Mantenha certidões sempre atualizadas</li>
                  <li>Prepare documentos com antecedência</li>
                  <li>Faça cópias autenticadas quando necessário</li>
                  <li>Organize em ordem solicitada pelo edital</li>
                </ul>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-save" 
                onClick={() => setShowDocumentationModal(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Tarefa */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nova Atividade Delegada</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label className="form-label">Descrição da Tarefa</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTask.text}
                  onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                  placeholder="Ex: Enviar documentação para cliente..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Empresa/Cliente</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTask.company}
                  onChange={(e) => setNewTask({ ...newTask, company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prioridade</label>
                  <select
                    className="form-select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prazo</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Adicionar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .mr-page {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .mr-page::before {
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
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .main-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #1e293b, #475569);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .main-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .header-stats {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Stats Grid */
        .stats-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

        .stat-icon.blue {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
          color: #3b82f6;
        }

        .stat-icon.green {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
          color: #10b981;
        }

        .stat-icon.orange {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
          color: #f59e0b;
        }

        .stat-icon.purple {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
          color: #8b5cf6;
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

        .stat-progress {
          width: 100%;
          height: 6px;
          background: rgba(226, 232, 240, 0.6);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .stat-trend.positive {
          color: #10b981;
        }

        /* Main Grid */
        .main-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        /* Task Sections */
        .task-section {
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
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-title h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .section-badge {
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .section-actions {
          display: flex;
          gap: 0.75rem;
        }

        .add-task-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .add-task-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        /* Novos estilos para botões de ação */
        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .action-btn.info {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .action-btn.info:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }

        /* Task Items */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .task-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .task-item:hover::before {
          left: 100%;
        }

        .task-item:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .task-item.completed {
          opacity: 0.7;
          background: rgba(240, 253, 244, 0.8);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .task-item.completed .task-text {
          text-decoration: line-through;
        }

        .task-checkbox {
          width: 2rem;
          height: 2rem;
          border: 2px solid #cbd5e1;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          background: white;
          flex-shrink: 0;
        }

        .task-item:hover .task-checkbox {
          border-color: #3b82f6;
        }

        .task-item.completed .task-checkbox {
          background: #10b981;
          border-color: #10b981;
        }

        .checkmark {
          color: white;
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.3s ease;
        }

        .task-item.completed .checkmark {
          opacity: 1;
          transform: scale(1);
        }

        .task-content {
          flex: 1;
        }

        .task-text {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .task-meta {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .frequency-badge,
        .company-badge,
        .priority-badge,
        .deadline-badge,
        .client-badge,
        .status-badge,
        .value-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .frequency-badge {
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
        }

        .company-badge {
          background: rgba(139, 92, 246, 0.1);
          color: #7c3aed;
        }

        .priority-high {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .priority-medium {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .priority-low {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .deadline-badge {
          background: rgba(168, 85, 247, 0.1);
          color: #9333ea;
        }

        .client-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .status-badge {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .value-badge {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          font-weight: 700;
        }

        .last-completed {
          font-size: 0.75rem;
          color: #64748b;
          font-style: italic;
        }

        .task-icon {
          color: #64748b;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .task-item:hover .task-icon {
          color: #3b82f6;
          transform: scale(1.1);
        }

        /* Grid de Licitações */
        .biddings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .bidding-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .bidding-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .bidding-card:hover::before {
          left: 100%;
        }

        .bidding-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .bidding-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .bidding-number {
          font-size: 1.1rem;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 0.25rem;
        }

        .bidding-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
          line-height: 1.3;
        }

        .bidding-client {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .bidding-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #10b981;
          text-align: right;
        }

        .bidding-progress {
          margin-bottom: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .current-stage {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .progress-percentage {
          font-size: 0.875rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .bidding-dates {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .date-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: #64748b;
        }

        .bidding-next-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 3px solid #f59e0b;
        }

        .bidding-next-action span {
          font-size: 0.875rem;
          color: #92400e;
          font-weight: 500;
        }

        .bidding-actions {
          display: flex;
          gap: 0.75rem;
        }

        .bidding-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          justify-content: center;
        }

        .bidding-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .bidding-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .bidding-btn.secondary {
          background: rgba(255, 255, 255, 0.8);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .bidding-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        /* Empty State para Licitações */
        .empty-biddings {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(248, 250, 252, 0.6);
          border-radius: 16px;
          border: 2px dashed #cbd5e1;
        }

        .empty-biddings h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 1rem 0 0.5rem 0;
        }

        .empty-biddings p {
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .add-first-bidding {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .add-first-bidding:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        /* Summary Column */
        .summary-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .summary-section {
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

        .completed-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .completed-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(240, 253, 244, 0.6);
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .completed-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .completed-text {
          font-size: 0.875rem;
          color: #1e293b;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: #64748b;
        }

        .empty-state p {
          font-weight: 600;
          margin: 0.75rem 0 0.25rem 0;
        }

        .empty-state span {
          font-size: 0.875rem;
        }

        /* Next Actions */
        .next-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(248, 250, 252, 0.6);
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .action-time {
          font-size: 0.875rem;
          font-weight: 700;
          color: #3b82f6;
          min-width: 3rem;
        }

        .action-text {
          font-size: 0.875rem;
          color: #1e293b;
          font-weight: 500;
        }

        /* Reminders */
        .reminders-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .reminder-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(254, 243, 199, 0.6);
          border-radius: 8px;
          border-left: 3px solid #f59e0b;
        }

        .reminder-icon {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .reminder-icon.urgent {
          background: #fee2e2;
          color: #dc2626;
        }

        .reminder-icon.normal {
          background: #dbeafe;
          color: #2563eb;
        }

        .reminder-text {
          font-size: 0.875rem;
          color: #1e293b;
          font-weight: 500;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .modal-content.large {
          max-width: 700px;
        }

        .modal-content.extra-large {
          max-width: 900px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .modal-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          color: #1e293b;
          transform: scale(1.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #1e293b;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel,
        .btn-save {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.8);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .btn-save {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        /* Conteúdo do Modal de Detalhes */
        .bidding-detail-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .detail-section {
          background: rgba(248, 250, 252, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .detail-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Timeline */
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 0.75rem;
          top: 2rem;
          bottom: -1rem;
          width: 2px;
          background: #e2e8f0;
        }

        .timeline-marker {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          border: 3px solid #e2e8f0;
          background: white;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .timeline-item.completed .timeline-marker {
          background: #10b981;
          border-color: #10b981;
        }

        .timeline-item.current .timeline-marker {
          background: #3b82f6;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .timeline-stage {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .timeline-date {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .timeline-item.completed .timeline-stage {
          color: #10b981;
        }

        .timeline-item.current .timeline-stage {
          color: #3b82f6;
        }

        /* Grid de Documentos */
        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .document-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .document-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .document-item.enviado {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .document-item.pendente {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }

        .document-item.rascunho {
          border-color: #64748b;
          background: rgba(100, 116, 139, 0.05);
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .document-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        .document-status {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          text-transform: capitalize;
        }

        .document-status.enviado {
          background: rgba(16, 185, 129, 0.1);
          color: #065f46;
        }

        .document-status.pendente {
          background: rgba(245, 158, 11, 0.1);
          color: #92400e;
        }

        .document-status.rascunho {
          background: rgba(100, 116, 139, 0.1);
          color: #334155;
        }

        .status-select {
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
          font-size: 0.8rem;
          cursor: pointer;
        }

        /* Grid de Informações */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .info-item {
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 0.875rem;
        }

        .info-item strong {
          color: #1e293b;
          display: block;
          margin-bottom: 0.25rem;
        }

        /* Documentação Padrão */
        .documentation-content {
          max-height: 70vh;
          overflow-y: auto;
        }

        .documentation-intro {
          color: #64748b;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .documentation-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .documentation-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .documentation-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .doc-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .doc-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .doc-description {
          color: #64748b;
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.4;
        }

        .documentation-tips {
          background: rgba(251, 191, 36, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          border-left: 3px solid #f59e0b;
        }

        .documentation-tips h4 {
          color: #92400e;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .documentation-tips ul {
          color: #92400e;
          padding-left: 1.5rem;
        }

        .documentation-tips li {
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        /* Scrollbar Customization */
        .completed-list::-webkit-scrollbar {
          width: 4px;
        }

        .completed-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .completed-list::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 2px;
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
          .main-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .mr-page {
            padding: 1rem;
          }

          .main-title {
            font-size: 1.875rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1rem;
          }

          .task-section {
            padding: 1.5rem;
          }

          .task-item {
            padding: 1rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .task-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .biddings-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .page-header,
          .task-section,
          .summary-section {
            padding: 1rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .header-stats {
            flex-direction: column;
            gap: 1rem;
          }
        }

        /* Accessibility */
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
        .task-item:focus,
        .add-task-btn:focus,
        .btn-save:focus,
        .btn-cancel:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .task-section,
          .summary-section,
          .task-item {
            border: 2px solid #1e293b;
          }
          
          .main-title,
          .section-title h3,
          .task-text {
            color: #000;
          }
        }

        /* Print Styles */
        @media print {
          .mr-page {
            background: white;
          }
          
          .page-header,
          .task-section,
          .summary-section,
          .task-item {
            background: white;
            border: 1px solid #000;
            box-shadow: none;
          }
          
          .add-task-btn,
          .btn-save,
          .btn-cancel {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MrRepresentacoes;