import React, { useState, useEffect, useContext } from 'react';
import * as XLSX from 'xlsx';
import { AuthContext } from '../contexts/AuthContextDef';
import { useMrRepresentacoes } from '../hooks/useMrRepresentacoes';
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
  Eye,
  X,
  Flag,
  AlertTriangle,
  Trash2
} from 'lucide-react';

const MrRepresentacoes = () => {
  const { userRole } = useContext(AuthContext);
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  // Hook do Firebase para MR Representações
  const {
    delegatedTasks,
    biddings,
    weekHistory,
    proposals,
    routineTasks,
    wonBiddings,
    lostBiddings,
    loading,
    error,
    addDelegatedTask,
    updateDelegatedTask,
    completeDelegatedTask,
    reportTaskProblem,
    addProposal,
    updateProposal,
    completeProposal,
    addBidding,
    updateBidding,
    markBiddingAsWon,
    markBiddingAsLost,
    deleteBidding,
    updateDocumentStatus,
    archiveCompletedTasks,
    clearWeeklyHistory
  } = useMrRepresentacoes();

  // Estados locais para UI e formulários
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date()); // Para forçar re-renderização
  const [overdueTasks, setOverdueTasks] = useState(new Set()); // Para rastrear tarefas que ficaram em atraso
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskWithProblem, setTaskWithProblem] = useState(null);
  const [problemDescription, setProblemDescription] = useState('');
  
  // Estados adicionais para controles da UI
  const [expandedTask, setExpandedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Média',
    deadline: '',
    deadlineTime: '',
    representada: '',
    acao: ''
  });

  // Estados para licitações
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [showBiddingDetailModal, setShowBiddingDetailModal] = useState(false);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [showBiddingEditModal, setShowBiddingEditModal] = useState(false);
  const [showBiddingLostModal, setShowBiddingLostModal] = useState(false);
  const [showBiddingHistoryModal, setShowBiddingHistoryModal] = useState(false);
  const [selectedBidding, setSelectedBidding] = useState(null);
  const [editingBidding, setEditingBidding] = useState(null);
  const [lostReason, setLostReason] = useState('');
  const [showBiddingDetails, setShowBiddingDetails] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState('won'); // 'won' ou 'lost'
  
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

  // Verificar tarefas em atraso em tempo real
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Verificar se alguma tarefa ficou em atraso agora
      const newOverdueTasks = new Set();
      
      delegatedTasks.forEach(task => {
        if (!task.completed && task.deadline) {
          const taskDeadline = new Date(`${task.deadline}T${task.deadlineTime || '23:59'}`);
          const isOverdueNow = taskDeadline < now;
          
          if (isOverdueNow) {
            newOverdueTasks.add(task.id);
            
            // Se a tarefa não estava em atraso antes, mostrar notificação
            if (!overdueTasks.has(task.id)) {
              // Notificação simples (você pode melhorar isso com um sistema de toast)
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Tarefa em Atraso!', {
                  body: `A tarefa "${task.title}" está atrasada!`,
                  icon: '/favicon.ico'
                });
              }
              
              // Log no console para debug
              console.log(`⚠️ Tarefa em atraso: ${task.title}`);
            }
          }
        }
      });
      
      // Só atualizar se houver mudança real
      if (newOverdueTasks.size !== overdueTasks.size || 
          ![...newOverdueTasks].every(id => overdueTasks.has(id))) {
        setOverdueTasks(newOverdueTasks);
      }
    };

    // Configurar intervalo para verificar a cada minuto
    const interval = setInterval(checkOverdueTasks, 60000);

    // Verificar imediatamente na primeira execução
    if (delegatedTasks.length > 0) {
      checkOverdueTasks();
    }

    return () => clearInterval(interval);
  }, []); // Remover delegatedTasks das dependências para evitar loop

  // Separar a verificação inicial das tarefas
  useEffect(() => {
    if (delegatedTasks.length > 0) {
      const now = new Date();
      const newOverdueTasks = new Set();
      
      delegatedTasks.forEach(task => {
        if (!task.completed && task.deadline) {
          const taskDeadline = new Date(`${task.deadline}T${task.deadlineTime || '23:59'}`);
          if (taskDeadline < now) {
            newOverdueTasks.add(task.id);
          }
        }
      });
      
      setOverdueTasks(newOverdueTasks);
    }
  }, [delegatedTasks]); // Manter apenas para verificação inicial

  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Função para concluir o dia: arquiva tarefas concluídas no histórico e remove das listas ativas
  const handleFinishDay = async () => {
    try {
      await archiveCompletedTasks();
      console.log('Tarefas concluídas arquivadas com sucesso!');
    } catch (error) {
      console.error('Erro ao concluir o dia:', error);
      alert('Erro ao concluir o dia: ' + error.message);
    }
  };

  // Função para exportar histórico semanal para Excel e limpar histórico
  const handleExportAndClearHistory = async () => {
    if (weekHistory.length === 0) return;
    // Monta os dados para a planilha
    const data = weekHistory.map((t, idx) => ({
      'Nº': idx + 1,
      'Tipo': t.type === 'delegada' ? 'Delegada' : 'Proposta',
      'Título': t.title || t.text || '',
      'Descrição': t.description || '',
      'Representada': t.representada || t.company || '',
      'Ação': t.acao || '',
      'Prioridade': t.priority || '',
      'Prazo': t.deadline ? new Date(t.deadline).toLocaleDateString('pt-BR') : '',
      'Horário Prazo': t.deadlineTime || '',
      'Problemas Encontrados': t.problems && t.problems.length > 0 ? 
        t.problems.map(p => p.description).join('; ') : 'Nenhum',
      'Tempo para Conclusão (dias)': t.timeToComplete || 0,
      'Data Finalização': t.finishedAt || '',
      'Data Criação': t.createdAt ? new Date(t.createdAt).toLocaleString('pt-BR') : ''
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HistoricoSemana');
    XLSX.writeFile(wb, `Historico_Semanal_${new Date().toISOString().slice(0,10)}.xlsx`);
    
    try {
      await clearWeeklyHistory();
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  };

  // Função para verificar se a tarefa está atrasada
  const isTaskOverdue = (deadline, deadlineTime, completed) => {
    if (completed) return false;
    if (!deadline) return false;
    
    // Usar currentTime para garantir re-renderização quando o tempo muda
    const now = currentTime;
    const taskDeadline = new Date(`${deadline}T${deadlineTime || '23:59'}`);
    return taskDeadline < now;
  };

  // Função para adicionar nova tarefa delegada
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      console.log('Adicionando tarefa:', newTask);
      await addDelegatedTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        deadline: newTask.deadline,
        deadlineTime: newTask.deadlineTime,
        representada: newTask.representada,
        acao: newTask.acao
      });
      
      console.log('Tarefa adicionada com sucesso!');
      setNewTask({ 
        title: '', 
        description: '', 
        priority: 'Média', 
        deadline: '', 
        deadlineTime: '',
        representada: '',
        acao: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      alert('Erro ao adicionar tarefa: ' + error.message);
    }
  };

  // Função para editar tarefa (apenas SUPER_ADMIN)
  const handleEditTask = (task) => {
    if (!isSuperAdmin) return;
    setEditingTask({
      ...task,
      deadlineTime: task.deadlineTime || ''
    });
    setShowEditModal(true);
  };

  // Função para salvar edição da tarefa
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    try {
      await updateDelegatedTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        deadline: editingTask.deadline,
        deadlineTime: editingTask.deadlineTime,
        representada: editingTask.representada,
        acao: editingTask.acao
      });
      
      setShowEditModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  // Função para concluir tarefa
  const handleCompleteTask = async (taskId) => {
    try {
      await completeDelegatedTask(taskId);
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
    }
  };

  // Função para reportar problema
  const handleReportProblem = (task) => {
    setTaskWithProblem(task);
    setProblemDescription('');
    setShowProblemModal(true);
  };

  // Função para salvar problema reportado
  const handleSaveProblem = async () => {
    if (!problemDescription.trim()) return;

    try {
      await reportTaskProblem(taskWithProblem.id, problemDescription);
      setShowProblemModal(false);
      setTaskWithProblem(null);
      setProblemDescription('');
    } catch (error) {
      console.error('Erro ao reportar problema:', error);
    }
  };

  // Função para adicionar nova licitação
  const handleAddBidding = async (e) => {
    e.preventDefault();
    if (!newBidding.number.trim() || !newBidding.title.trim()) return;

    try {
      await addBidding(newBidding);
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
    } catch (error) {
      console.error('Erro ao adicionar licitação:', error);
    }
  };

  // Função para editar licitação
  const handleEditBidding = (bidding) => {
    setEditingBidding({ ...bidding });
    setShowBiddingEditModal(true);
  };

  // Função para salvar edição da licitação
  const handleSaveBiddingEdit = async (e) => {
    e.preventDefault();
    if (!editingBidding.number.trim() || !editingBidding.title.trim()) return;

    try {
      await updateBidding(editingBidding.id, editingBidding);
      setShowBiddingEditModal(false);
      setEditingBidding(null);
    } catch (error) {
      console.error('Erro ao atualizar licitação:', error);
    }
  };

  // Função para marcar licitação como ganha
  const handleBiddingWon = async (bidding) => {
    const wonReason = prompt('Motivo da vitória (opcional):');
    if (wonReason !== null) { // null significa que cancelou
      try {
        await markBiddingAsWon(bidding.id, wonReason || 'Licitação ganha');
        alert('Licitação marcada como ganha com sucesso!');
      } catch (error) {
        console.error('Erro ao marcar licitação como ganha:', error);
        alert('Erro ao marcar licitação como ganha. Tente novamente.');
      }
    }
  };

  // Função para marcar licitação como perdida
  const handleBiddingLost = (bidding) => {
    setSelectedBidding(bidding);
    setLostReason('');
    setShowBiddingLostModal(true);
  };

  // Função para salvar motivo da perda
  const handleSaveLostReason = async () => {
    if (!lostReason.trim() || !selectedBidding?.id) {
      alert('Por favor, informe o motivo da perda.');
      return;
    }

    try {
      await markBiddingAsLost(selectedBidding.id, lostReason);
      setShowBiddingLostModal(false);
      setSelectedBidding(null);
      setLostReason('');
      alert('Licitação marcada como perdida com sucesso!');
    } catch (error) {
      console.error('Erro ao marcar licitação como perdida:', error);
      alert('Erro ao marcar licitação como perdida. Tente novamente.');
    }
  };

  // Função para excluir licitação
  const handleDeleteBidding = async (biddingId) => {
    if (window.confirm('Tem certeza que deseja excluir esta licitação?')) {
      try {
        await deleteBidding(biddingId);
      } catch (error) {
        console.error('Erro ao excluir licitação:', error);
      }
    }
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

  // Função para obter cor da ação
  const getAcaoColor = (acao) => {
    switch (acao) {
      case 'Email': return 'acao-email';
      case 'Mensagem': return 'acao-mensagem';
      case 'Ligação': return 'acao-ligacao';
      case 'Pesquisa': return 'acao-pesquisa';
      case 'Licitação': return 'acao-licitacao';
      default: return 'acao-default';
    }
  };

  // Função para obter ícone da ação
  const getAcaoIcon = (acao) => {
    const iconProps = { size: 12 };
    switch (acao) {
      case 'Email': return <Send {...iconProps} />;
      case 'Mensagem': return <MessageCircle {...iconProps} />;
      case 'Ligação': return <Phone {...iconProps} />;
      case 'Pesquisa': return <Eye {...iconProps} />;
      case 'Licitação': return <FileStack {...iconProps} />;
      default: return <AlertCircle {...iconProps} />;
    }
  };

  // Função para calcular dias de atraso
  const calculateDaysOverdue = (deadline, deadlineTime) => {
    if (!deadline) return 0;
    
    const now = new Date();
    const taskDeadline = new Date(`${deadline}T${deadlineTime || '23:59'}`);
    const diffTime = now - taskDeadline;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Função para obter tarefas atrasadas há mais de 24h
  const getOverdueTasksOver24h = () => {
    return delegatedTasks.filter(task => {
      if (task.completed) return false;
      const daysOverdue = calculateDaysOverdue(task.deadline, task.deadlineTime);
      return daysOverdue >= 1; // Mais de 24h = 1 dia ou mais
    });
  };

  return (
    <div className="mr-page">
      {/* Loading state */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>Erro ao carregar dados: {error.message}</span>
        </div>
      )}

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
              {delegatedTasks
                .filter(task => !task.completed) // Filtrar tarefas não concluídas
                .map(task => {
                const isOverdue = isTaskOverdue(task.deadline, task.deadlineTime, task.completed);
                return (
                  <div 
                    key={task.id} 
                    className={`task-item delegated ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
                  >
                    {/* Indicador de atraso */}
                    {isOverdue && (
                      <div className="overdue-indicator">
                        <AlertTriangle size={16} />
                        <span>Tarefa em atraso</span>
                      </div>
                    )}

                    <div className="task-main-content">
                      <div className="task-checkbox" onClick={() => handleCompleteTask(task.id)}>
                        <CheckCircle size={20} className="checkmark" />
                      </div>
                      
                      <div className="task-content">
                        <div className="task-title">{task.title}</div>
                        {task.description && (
                          <div className="task-description">{task.description}</div>
                        )}
                        <div className="task-meta">
                          <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                            <Flag size={12} />
                            {task.priority}
                          </span>
                          {task.representada && (
                            <span className="representada-badge">
                              <Building size={12} />
                              {task.representada}
                            </span>
                          )}
                          {task.acao && (
                            <span className={`acao-badge ${getAcaoColor(task.acao)}`}>
                              {getAcaoIcon(task.acao)}
                              {task.acao}
                            </span>
                          )}
                          {task.deadline && (
                            <span className="deadline-badge">
                              <Calendar size={14} />
                              {new Date(task.deadline).toLocaleDateString('pt-BR')}
                              {task.deadlineTime && ` às ${task.deadlineTime}`}
                            </span>
                          )}
                        </div>

                        {/* Problemas reportados */}
                        {task.problems && task.problems.length > 0 && (
                          <div className="task-problems">
                            <div className="problems-header">
                              <AlertCircle size={14} />
                              <span>Problemas reportados ({task.problems.length})</span>
                            </div>
                            {task.problems.map(problem => (
                              <div key={problem.id} className="problem-item">
                                <div className="problem-description">{problem.description}</div>
                                <div className="problem-meta">
                                  Reportado em {new Date(problem.reportedAt).toLocaleString('pt-BR')}
                                  {problem.reportedBy && ` por ${problem.reportedBy}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="task-icon">
                        {/* Ícone foi removido para corrigir erro, precisa ser reimplementado se necessário */}
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="task-actions">
                      {isSuperAdmin && (
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEditTask(task)}
                          title="Editar tarefa"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      
                      {!task.completed && (
                        <button 
                          className="action-btn complete"
                          onClick={() => handleCompleteTask(task.id)}
                          title="Concluir tarefa"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      
                      {!task.completed && (
                        <button 
                          className="action-btn problem"
                          onClick={() => handleReportProblem(task)}
                          title="Reportar problema"
                        >
                          <AlertCircle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gestão Detalhada de Licitações */}
          <div className="task-section">
            <div className="section-header">
              <div className="section-title">
                <Target size={22} />
                <h3>Gestão Detalhada de Licitações</h3>
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
              <div className="section-badge">
                {biddings?.length || 0} licitações em acompanhamento
              </div>
            </div>

            <div className="biddings-grid">
              {biddings && biddings.length > 0 ? (
                biddings.map(bidding => (
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
                    <button 
                      className="bidding-btn secondary"
                      onClick={() => handleEditBidding(bidding)}
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button 
                      className="bidding-btn success"
                      onClick={() => handleBiddingWon(bidding)}
                      title="Marcar como ganha"
                    >
                      <CheckCircle size={16} />
                      Ganha
                    </button>
                    <button 
                      className="bidding-btn warning"
                      onClick={() => handleBiddingLost(bidding)}
                      title="Marcar como perdida"
                    >
                      <AlertCircle size={16} />
                      Perdida
                    </button>
                    <button 
                      className="bidding-btn danger"
                      onClick={() => handleDeleteBidding(bidding.id)}
                      title="Excluir licitação"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>
              ))
              ) : (
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
                    <div className="completed-text">{task.title || task.text}</div>
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
            {/* Botão Concluir Dia */}
            {[...delegatedTasks, ...proposals].filter(t => t.completed).length > 0 && (
              <button onClick={handleFinishDay} className="btn btn-primary" style={{marginTop:8, width:'100%'}}>Concluir dia</button>
            )}
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
              {getOverdueTasksOver24h().length === 0 ? (
                <div className="reminder-item">
                  <div className="reminder-icon normal">✅</div>
                  <div className="reminder-text">Nenhuma tarefa em atraso há mais de 24h</div>
                </div>
              ) : (
                getOverdueTasksOver24h().map(task => {
                  const daysOverdue = calculateDaysOverdue(task.deadline, task.deadlineTime);
                  return (
                    <div key={task.id} className="reminder-item">
                      <div className="reminder-icon urgent">!</div>
                      <div className="reminder-text">
                        <strong>{task.title}</strong> - em atraso há {daysOverdue} {daysOverdue === 1 ? 'dia' : 'dias'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Histórico da Semana */}
          <div className="summary-section" style={{marginTop:16}}>
            <div className="section-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div className="section-title">
                <ClipboardList size={22} />
                <h3>Histórico da Semana</h3>
              </div>
              <button 
                className="btn btn-secondary"
                style={{fontSize:13, padding:'4px 10px'}}
                onClick={handleExportAndClearHistory}
                disabled={weekHistory.length === 0}
                title="Exportar e limpar histórico semanal"
              >
                Exportar & Limpar
              </button>
            </div>
            <div className="history-list">
              {weekHistory.length === 0 ? (
                <div className="empty-state">
                  <span style={{color:'#888'}}>Nenhuma tarefa finalizada nesta semana.</span>
                </div>
              ) : (
                weekHistory.map((t, idx) => (
                  <div key={t.id + '-' + idx} className="history-item">
                    <div className="history-text">
                      <strong>{t.title || t.text}</strong>
                      {t.representada && (
                        <span style={{fontSize:12, color:'#888'}}> ({t.representada})</span>
                      )}
                      {t.problems && t.problems.length > 0 && (
                        <span style={{fontSize:11, color:'#e74c3c'}}> - {t.problems.length} problema(s)</span>
                      )}
                      <span style={{fontSize:11, color:'#aaa'}}> - {t.finishedAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Histórico de Licitações */}
          <div className="summary-section" style={{marginTop:16}}>
            <div className="section-header">
              <div className="section-title">
                <Target size={22} />
                <h3>Histórico de Licitações</h3>
              </div>
              <div className="section-badge">
                {wonBiddings.length + lostBiddings.length} finalizadas
              </div>
            </div>

            <div className="history-tabs">
              <button 
                className={`tab-btn ${activeHistoryTab === 'won' ? 'active' : ''}`}
                onClick={() => setActiveHistoryTab('won')}
              >
                <CheckCircle size={16} />
                Ganhas ({wonBiddings.length})
              </button>
              <button 
                className={`tab-btn ${activeHistoryTab === 'lost' ? 'active' : ''}`}
                onClick={() => setActiveHistoryTab('lost')}
              >
                <AlertCircle size={16} />
                Perdidas ({lostBiddings.length})
              </button>
            </div>

            <div className="history-content">
              {activeHistoryTab === 'won' && (
                <div className="history-list">
                  {wonBiddings.length > 0 ? (
                    wonBiddings.map(bidding => (
                      <div key={bidding.id} className="history-item won">
                        <div className="history-info">
                          <h4 className="history-number">{bidding.number}</h4>
                          <p className="history-title">{bidding.title}</p>
                          <p className="history-client">{bidding.client}</p>
                        </div>
                        <div className="history-details">
                          <div className="history-value">{bidding.value}</div>
                          <div className="history-date">
                            {bidding.wonDate ? new Date(bidding.wonDate).toLocaleDateString('pt-BR') : 'N/A'}
                          </div>
                        </div>
                        <button 
                          className="history-view-btn"
                          onClick={() => {
                            setSelectedBidding(bidding);
                            setShowBiddingHistoryModal(true);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-history">
                      <CheckCircle size={32} />
                      <p>Nenhuma licitação ganha ainda</p>
                    </div>
                  )}
                </div>
              )}

              {activeHistoryTab === 'lost' && (
                <div className="history-list">
                  {lostBiddings.length > 0 ? (
                    lostBiddings.map(bidding => (
                      <div key={bidding.id} className="history-item lost">
                        <div className="history-info">
                          <h4 className="history-number">{bidding.number}</h4>
                          <p className="history-title">{bidding.title}</p>
                          <p className="history-client">{bidding.client}</p>
                        </div>
                        <div className="history-details">
                          <div className="history-value">{bidding.value}</div>
                          <div className="history-date">
                            {bidding.lostDate ? new Date(bidding.lostDate).toLocaleDateString('pt-BR') : 'N/A'}
                          </div>
                        </div>
                        <button 
                          className="history-view-btn"
                          onClick={() => {
                            setSelectedBidding(bidding);
                            setShowBiddingHistoryModal(true);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-history">
                      <AlertCircle size={32} />
                      <p>Nenhuma licitação perdida ainda</p>
                    </div>
                  )}
                </div>
              )}
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
                <h3 className="modal-title">{selectedBidding?.number || 'Licitação'}</h3>
                <p className="modal-subtitle">{selectedBidding?.title || 'Título não disponível'}</p>
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
                  {selectedBidding?.timeline?.map((stage, index) => (
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
                  )) || <p>Nenhuma timeline disponível</p>}
                </div>
              </div>

              {/* Documentos */}
              <div className="detail-section">
                <h4 className="detail-title">Documentação</h4>
                <div className="documents-grid">
                  {standardDocuments.map((standardDoc, index) => {
                    const existingDoc = selectedBidding?.documents?.find(d => d.name === standardDoc.name);
                    const docStatus = existingDoc ? existingDoc.status : 'pendente';
                    
                    return (
                      <div key={index} className={`document-item ${docStatus}`}>
                        <div className="document-header">
                          <span className="document-name">{standardDoc.name}</span>
                          <span className={`document-status ${docStatus}`}>
                            {docStatus === 'enviado' && <CheckCircle size={16} />}
                            {docStatus === 'pendente' && <Clock size={16} />}
                            {docStatus === 'rascunho' && <Edit size={16} />}
                            {docStatus}
                          </span>
                        </div>
                        <div className="document-description">
                          {standardDoc.description}
                        </div>
                        <div className="document-actions">
                          <select
                            value={docStatus}
                            onChange={(e) => updateDocumentStatus(selectedBidding?.id, standardDoc.name, e.target.value)}
                            className="status-select"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="rascunho">Em Rascunho</option>
                            <option value="enviado">Enviado</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informações Gerais */}
              <div className="detail-section">
                <h4 className="detail-title">Informações Gerais</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Cliente:</strong> {selectedBidding?.client || 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Valor:</strong> {selectedBidding?.value || 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Abertura:</strong> {selectedBidding?.openingDate ? new Date(selectedBidding.openingDate).toLocaleDateString('pt-BR') : 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Entrega:</strong> {selectedBidding?.deliveryDate ? new Date(selectedBidding.deliveryDate).toLocaleDateString('pt-BR') : 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Próxima Ação:</strong> {selectedBidding?.nextAction || 'N/A'}
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

      {/* Modal Editar Licitação */}
      {showBiddingEditModal && editingBidding && (
        <div className="modal-overlay" onClick={() => setShowBiddingEditModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Licitação</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowBiddingEditModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveBiddingEdit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Número/Processo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBidding.number}
                    onChange={(e) => setEditingBidding({ ...editingBidding, number: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Título/Objeto</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBidding.title}
                    onChange={(e) => setEditingBidding({ ...editingBidding, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cliente/Órgão</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBidding.client}
                    onChange={(e) => setEditingBidding({ ...editingBidding, client: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Valor Estimado</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBidding.value}
                    onChange={(e) => setEditingBidding({ ...editingBidding, value: e.target.value })}
                    placeholder="Ex: R$ 50.000,00"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Data de Abertura</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingBidding.openingDate}
                    onChange={(e) => setEditingBidding({ ...editingBidding, openingDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Entrega</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingBidding.deliveryDate}
                    onChange={(e) => setEditingBidding({ ...editingBidding, deliveryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Estágio Atual</label>
                  <select
                    className="form-select"
                    value={editingBidding.currentStage}
                    onChange={(e) => setEditingBidding({ ...editingBidding, currentStage: e.target.value })}
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
                  value={editingBidding.nextAction}
                  onChange={(e) => setEditingBidding({ ...editingBidding, nextAction: e.target.value })}
                  placeholder="Ex: Finalizar proposta técnica..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowBiddingEditModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Licitação Perdida */}
      {showBiddingLostModal && selectedBidding && (
        <div className="modal-overlay" onClick={() => setShowBiddingLostModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Marcar Licitação como Perdida</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowBiddingLostModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p><strong>Licitação:</strong> {selectedBidding?.number || 'N/A'} - {selectedBidding?.title || 'N/A'}</p>
              
              <div className="form-group">
                <label className="form-label">Motivo da Perda</label>
                <textarea
                  className="form-textarea"
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  placeholder="Descreva o motivo pelo qual a licitação foi perdida..."
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowBiddingLostModal(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-danger" onClick={handleSaveLostReason}>
                Confirmar Perda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Histórico de Licitação */}
      {showBiddingHistoryModal && selectedBidding && (
        <div className="modal-overlay" onClick={() => setShowBiddingHistoryModal(false)}>
          <div className="modal bidding-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">
                  {selectedBidding?.number || 'Licitação'} - 
                  {selectedBidding.status === 'won' ? ' GANHA' : ' PERDIDA'}
                </h3>
                <p className="modal-subtitle">{selectedBidding?.title || 'Título não disponível'}</p>
              </div>
              <button 
                className="modal-close"
                onClick={() => setShowBiddingHistoryModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="bidding-history-content">
              {/* Status Badge */}
              <div className={`status-badge-large ${selectedBidding.status}`}>
                {selectedBidding.status === 'won' ? (
                  <>
                    <CheckCircle size={24} />
                    <span>LICITAÇÃO GANHA</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={24} />
                    <span>LICITAÇÃO PERDIDA</span>
                  </>
                )}
              </div>

              {/* Informações Gerais */}
              <div className="detail-section">
                <h4 className="detail-title">Informações da Licitação</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Cliente:</strong> {selectedBidding?.client || 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Valor:</strong> {selectedBidding?.value || 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Data de Abertura:</strong> {selectedBidding?.openingDate ? new Date(selectedBidding.openingDate).toLocaleDateString('pt-BR') : 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Data de Entrega:</strong> {selectedBidding?.deliveryDate ? new Date(selectedBidding.deliveryDate).toLocaleDateString('pt-BR') : 'N/A'}
                  </div>
                  {selectedBidding.status === 'won' && (
                    <>
                      <div className="info-item">
                        <strong>Data da Vitória:</strong> {selectedBidding?.wonDate ? new Date(selectedBidding.wonDate).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                      {selectedBidding.wonReason && (
                        <div className="info-item full-width">
                          <strong>Motivo da Vitória:</strong> {selectedBidding.wonReason}
                        </div>
                      )}
                    </>
                  )}
                  {selectedBidding.status === 'lost' && (
                    <>
                      <div className="info-item">
                        <strong>Data da Perda:</strong> {selectedBidding?.lostDate ? new Date(selectedBidding.lostDate).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                      {selectedBidding.lostReason && (
                        <div className="info-item full-width">
                          <strong>Motivo da Perda:</strong> {selectedBidding.lostReason}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Timeline se existir */}
              {selectedBidding?.timeline && (
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
              )}

              {/* Documentos se existir */}
              {selectedBidding?.documents && (
                <div className="detail-section">
                  <h4 className="detail-title">Documentação</h4>
                  <div className="documents-grid-readonly">
                    {selectedBidding.documents.map((doc, index) => (
                      <div key={index} className={`document-item-readonly ${doc.status}`}>
                        <div className="document-header">
                          <span className="document-name">{doc.name}</span>
                          <span className={`document-status ${doc.status}`}>
                            {doc.status === 'enviado' && <CheckCircle size={16} />}
                            {doc.status === 'pendente' && <Clock size={16} />}
                            {doc.status === 'rascunho' && <Edit size={16} />}
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setShowBiddingHistoryModal(false)}
              >
                Fechar
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
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label className="form-label">Título da Tarefa *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Ex: Enviar documentação para cliente..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição da Tarefa</label>
                <textarea
                  className="form-textarea"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Descreva os detalhes da tarefa..."
                  rows="3"
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
                  <label className="form-label">Representada</label>
                  <select
                    className="form-select"
                    value={newTask.representada}
                    onChange={(e) => setNewTask({ ...newTask, representada: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Harald">Harald</option>
                    <option value="BWB">BWB</option>
                    <option value="Libreplast">Libreplast</option>
                    <option value="Liplast">Liplast</option>
                    <option value="Embalagens Conceito">Embalagens Conceito</option>
                    <option value="Caparroz">Caparroz</option>
                    <option value="Dacolônia">Dacolônia</option>
                    <option value="SugarArt">SugarArt</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ação</label>
                  <select
                    className="form-select"
                    value={newTask.acao}
                    onChange={(e) => setNewTask({ ...newTask, acao: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Email">Email</option>
                    <option value="Mensagem">Mensagem</option>
                    <option value="Ligação">Ligação</option>
                    <option value="Pesquisa">Pesquisa</option>
                    <option value="Licitação">Licitação</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Data do Prazo</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hora do Prazo</label>
                  <input
                    type="time"
                    className="form-input"
                    value={newTask.deadlineTime}
                    onChange={(e) => setNewTask({ ...newTask, deadlineTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Tarefa */}
      {showEditModal && editingTask && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Tarefa</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Título da Tarefa *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Ex: Enviar documentação para cliente..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição da Tarefa</label>
                <textarea
                  className="form-textarea"
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Descreva os detalhes da tarefa..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prioridade</label>
                  <select
                    className="form-select"
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Representada</label>
                  <select
                    className="form-select"
                    value={editingTask.representada || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, representada: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Harald">Harald</option>
                    <option value="BWB">BWB</option>
                    <option value="Libreplast">Libreplast</option>
                    <option value="Liplast">Liplast</option>
                    <option value="Embalagens Conceito">Embalagens Conceito</option>
                    <option value="Caparroz">Caparroz</option>
                    <option value="Dacolônia">Dacolônia</option>
                    <option value="SugarArt">SugarArt</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ação</label>
                  <select
                    className="form-select"
                    value={editingTask.acao || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, acao: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Email">Email</option>
                    <option value="Mensagem">Mensagem</option>
                    <option value="Ligação">Ligação</option>
                    <option value="Pesquisa">Pesquisa</option>
                    <option value="Licitação">Licitação</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Data do Prazo</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingTask.deadline || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hora do Prazo</label>
                  <input
                    type="time"
                    className="form-input"
                    value={editingTask.deadlineTime || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, deadlineTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reportar Problema */}
      {showProblemModal && taskWithProblem && (
        <div className="modal-overlay" onClick={() => setShowProblemModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reportar Problema</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowProblemModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="task-info">
              <h4>Tarefa: {taskWithProblem.title}</h4>
              {taskWithProblem.description && (
                <p className="task-description">{taskWithProblem.description}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Descrição do Problema *</label>
              <textarea
                className="form-textarea"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Descreva o problema encontrado..."
                rows="4"
                required
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setShowProblemModal(false)}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-save btn-problem" 
                onClick={handleSaveProblem}
                disabled={!problemDescription.trim()}
              >
                Reportar Problema
              </button>
            </div>
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
        .value-badge,
        .representada-badge,
        .acao-badge {
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

        .representada-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #047857;
        }

        .acao-email {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .acao-mensagem {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .acao-ligacao {
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
        }

        .acao-pesquisa {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .acao-licitacao {
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

        /* Novos estilos para tarefas atrasadas */
        .task-item.overdue {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border-color: #fca5a5;
          border-width: 2px;
          animation: pulse-red 2s infinite;
        }

        @keyframes pulse-red {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }

        .overdue-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          animation: blink 1s infinite alternate;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        @keyframes blink {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }

        /* Estrutura melhorada do task-item */
        .task-main-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          width: 100%;
        }

        .task-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .task-description {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          max-height: 4.2rem; /* Aproximadamente 3 linhas */
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        /* Ações da tarefa */
        .task-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .task-item:hover .task-actions {
          opacity: 1;
        }

        .action-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .action-btn.edit {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
        }

        .action-btn.edit:hover {
          background: rgba(59, 130, 246, 0.2);
          transform: scale(1.1);
        }

        .action-btn.complete {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .action-btn.complete:hover {
          background: rgba(34, 197, 94, 0.2);
          transform: scale(1.1);
        }

        .action-btn.problem {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .action-btn.problem:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.1);
        }

        /* Problemas reportados */
        .task-problems {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
        }

        .problems-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #dc2626;
          margin-bottom: 0.5rem;
        }

        .problem-item {
          background: white;
          padding: 0.5rem;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          border-left: 3px solid #dc2626;
        }

        .problem-item:last-child {
          margin-bottom: 0;
        }

        .problem-description {
          font-size: 0.85rem;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .problem-meta {
          font-size: 0.75rem;
          color: #64748b;
          font-style: italic;
        }

        /* Melhorias nos formulários dos modais */
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
          min-height: 80px;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .task-info {
          background: rgba(241, 245, 249, 0.8);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .task-info h4 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1rem;
        }

        .task-info .task-description {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          max-height: 3.4rem; /* Aproximadamente 2-3 linhas para contexto menor */
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .btn-problem {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .btn-problem:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .btn-problem:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Ajustes no form-row para 5 colunas */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
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
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .bidding-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.4rem 0.6rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.75rem;
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

        .bidding-btn.warning {
          background: rgba(245, 158, 11, 0.8);
          color: white;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .bidding-btn.warning:hover {
          background: rgba(245, 158, 11, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .bidding-btn.danger {
          background: rgba(239, 68, 68, 0.8);
          color: white;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .bidding-btn.danger:hover {
          background: rgba(239, 68, 68, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
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
          color: #475569;
          font-size: 1rem;
          margin: 0;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(229, 231, 235, 0.5);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
        }

        .detail-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          border-bottom: 2px solid rgba(229, 231, 235, 0.8);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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

        .timeline-content {
          background: rgba(255, 255, 255, 0.8);
          padding: 0.75rem;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(229, 231, 235, 0.5);
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

        .document-description {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0.5rem 0;
          line-height: 1.4;
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
          background: rgba(255, 255, 255, 0.95);
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 0.875rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(8px);
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

        /* Loading e Error States */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Estilo para botão de sucesso */
        .bidding-btn.success {
          background: #10b981;
          color: white;
        }

        .bidding-btn.success:hover {
          background: #059669;
        }

        /* Estilos para o histórico de licitações */
        .history-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .tab-btn {
          padding: 8px 12px;
          border: none;
          background: none;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .tab-btn.active {
          color: #1f2937;
          border-bottom-color: #3b82f6;
        }

        .tab-btn:hover {
          color: #1f2937;
          background: #f9fafb;
        }

        .history-content {
          min-height: 150px;
          max-height: 300px;
          overflow-y: auto;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background: white;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          font-size: 13px;
        }

        .history-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }

        .history-item.won {
          border-left: 3px solid #10b981;
        }

        .history-item.lost {
          border-left: 3px solid #ef4444;
        }

        .history-info {
          flex: 1;
        }

        .history-number {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 2px 0;
        }

        .history-title {
          font-size: 11px;
          color: #4b5563;
          margin: 0 0 1px 0;
          line-height: 1.3;
        }

        .history-client {
          font-size: 10px;
          color: #6b7280;
          margin: 0;
        }

        .history-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .history-value {
          font-weight: 600;
          color: #1f2937;
          font-size: 12px;
        }

        .history-date {
          font-size: 10px;
          color: #6b7280;
        }

        .history-view-btn {
          padding: 6px;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 8px;
          transition: all 0.2s ease;
        }

        .history-view-btn:hover {
          background: #3b82f6;
          color: white;
        }

        .empty-history {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 15px;
          color: #6b7280;
          text-align: center;
        }

        .empty-history svg {
          margin-bottom: 8px;
          opacity: 0.5;
        }

        .empty-history p {
          font-size: 12px;
          margin: 0;
        }

        /* Modal de histórico */
        .bidding-history-modal {
          max-width: 700px;
          max-height: 80vh;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
        }

        .bidding-history-content {
          background: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          padding: 1rem;
          backdrop-filter: blur(5px);
        }

        .status-badge-large {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 24px;
        }

        .status-badge-large.won {
          background: rgba(209, 250, 229, 0.95);
          color: #065f46;
          border: 1px solid #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
          backdrop-filter: blur(10px);
        }

        .status-badge-large.lost {
          background: rgba(254, 226, 226, 0.95);
          color: #991b1b;
          border: 1px solid #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
          backdrop-filter: blur(10px);
        }

        .documents-grid-readonly {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
        }

        .document-item-readonly {
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(5px);
        }

        .document-item-readonly.enviado {
          border-color: #10b981;
          background: #ecfdf5;
        }

        .document-item-readonly.pendente {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .document-item-readonly.rascunho {
          border-color: #6b7280;
          background: #f3f4f6;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
};

export default MrRepresentacoes;