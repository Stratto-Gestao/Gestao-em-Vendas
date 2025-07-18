import React, { useState, useEffect, useContext } from 'react';
import * as XLSX from 'xlsx';
import { AuthContext } from '../../contexts/AuthContextDef';
import { 
  Plus, CheckCircle, Clock, Target, Calendar, User, Filter, Search,
  MoreVertical, Edit, Trash2, AlertCircle, Star, Flag, TrendingUp,
  Play, Pause, RotateCcw, ArrowRight, Users, Phone, Mail, FileText,
  ChevronDown, Eye, Copy, RefreshCw, Award, Zap, Timer, Activity,
  Save, X, Archive, History, Download
} from 'lucide-react';

function TarefasDiarias() {
  // Contexto de autenticação
  const { currentUser, userRole, canWrite } = useContext(AuthContext);
  
  // Verificar se o usuário é SUPER_ADMIN (única role com acesso total)
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  
  // Dados iniciais (serão carregados do localStorage se existirem)
  const tarefasIniciais = [];

  const [tarefas, setTarefas] = useState(() => {
    const savedTarefas = localStorage.getItem('tarefas');
    return savedTarefas ? JSON.parse(savedTarefas) : tarefasIniciais;
  });

  const [historicoTarefas, setHistoricoTarefas] = useState(() => {
    const savedHistorico = localStorage.getItem('historicoTarefas');
    return savedHistorico ? JSON.parse(savedHistorico) : [];
  });

  const [historicoSemana, setHistoricoSemana] = useState(() => {
    const savedHistoricoSemana = localStorage.getItem('historicoSemana');
    return savedHistoricoSemana ? JSON.parse(savedHistoricoSemana) : [];
  });

  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    tipo: 'Ligações',
    prioridade: 'Média',
    tempoEstimado: '',
    prazo: '',
    categoria: 'Prospecção'
  });

  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);
  const [tarefaComProblema, setTarefaComProblema] = useState(null);
  const [problemaDescricao, setProblemaDescricao] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timers, setTimers] = useState({});

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  useEffect(() => {
    localStorage.setItem('historicoTarefas', JSON.stringify(historicoTarefas));
  }, [historicoTarefas]);

  useEffect(() => {
    localStorage.setItem('historicoSemana', JSON.stringify(historicoSemana));
  }, [historicoSemana]);

  // Gerenciar timers das tarefas
  useEffect(() => {
    const intervals = {};
    
    tarefas.forEach(tarefa => {
      if (tarefa.status === 'Em andamento' && timers[tarefa.id]) {
        intervals[tarefa.id] = setInterval(() => {
          setTarefas(prev => prev.map(t => 
            t.id === tarefa.id 
              ? { ...t, tempoGasto: incrementarTempo(t.tempoGasto) }
              : t
          ));
        }, 60000); // Atualiza a cada minuto
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [tarefas, timers]);

  // Função para incrementar tempo
  const incrementarTempo = (tempoAtual) => {
    const regex = /(\d+)h?\s*(\d+)?min/;
    const match = tempoAtual.match(regex);
    
    if (match) {
      const horas = parseInt(match[1]) || 0;
      const minutos = parseInt(match[2]) || 0;
      const totalMinutos = horas * 60 + minutos + 1;
      const novasHoras = Math.floor(totalMinutos / 60);
      const novosMinutos = totalMinutos % 60;
      
      return novasHoras > 0 ? `${novasHoras}h ${novosMinutos}min` : `${novosMinutos}min`;
    }
    
    return '1min';
  };

  // Estatísticas calculadas
  const stats = {
    total: tarefas.length,
    concluidas: tarefas.filter(t => t.status === 'Concluída').length,
    emAndamento: tarefas.filter(t => t.status === 'Em andamento').length,
    pendentes: tarefas.filter(t => t.status === 'Pendente').length,
    comProblema: tarefas.filter(t => t.status === 'Com Problema').length,
    atrasadas: tarefas.filter(t => new Date(t.prazo) < new Date() && t.status !== 'Concluída').length
  };

  const produtividade = Math.round((stats.concluidas / stats.total) * 100) || 0;

  // Filtrar tarefas
  const tarefasFiltradas = tarefas.filter(tarefa => {
    const matchesSearch = tarefa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarefa.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filtroStatus === '' || tarefa.status === filtroStatus;
    const matchesPrioridade = filtroPrioridade === '' || tarefa.prioridade === filtroPrioridade;
    
    return matchesSearch && matchesStatus && matchesPrioridade;
  });

  // Funções auxiliares
  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluída': return 'text-green-600 bg-green-50 border-green-200';
      case 'Em andamento': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Pendente': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Agendada': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Com Problema': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'Alta': return 'text-red-600 bg-red-50';
      case 'Média': return 'text-yellow-600 bg-yellow-50';
      case 'Baixa': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatarTempo = (minutos) => {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const handleAdicionarTarefa = (e) => {
    e.preventDefault();
    const novaTask = {
      id: Date.now(),
      ...novaTarefa,
      status: 'Pendente',
      progresso: 0,
      tempoGasto: '0min',
      criadoEm: new Date().toISOString(),
      responsavel: 'Você',
      tags: [],
      criadoPor: 'usuario' // Usuário comum cria tarefas
    };
    
    setTarefas([...tarefas, novaTask]);
    setNovaTarefa({
      titulo: '',
      descricao: '',
      tipo: 'Ligações',
      prioridade: 'Média',
      tempoEstimado: '',
      prazo: '',
      categoria: 'Prospecção'
    });
    setShowNewTaskModal(false);
  };

  const handleEditarTarefa = (tarefa) => {
    setTarefaEditando(tarefa);
    setShowEditModal(true);
  };

  const handleSalvarEdicao = (e) => {
    e.preventDefault();
    setTarefas(tarefas.map(t => 
      t.id === tarefaEditando.id ? tarefaEditando : t
    ));
    setTarefaEditando(null);
    setShowEditModal(false);
  };

  const handleExcluirTarefa = (tarefa) => {
    if (!isSuperAdmin) {
      alert('Apenas SUPER_ADMIN pode excluir tarefas!');
      return;
    }
    setTarefaParaExcluir(tarefa);
    setShowDeleteModal(true);
  };

  const confirmarExclusao = () => {
    if (!isSuperAdmin) {
      alert('Apenas SUPER_ADMIN pode excluir tarefas!');
      return;
    }
    setTarefas(tarefas.filter(t => t.id !== tarefaParaExcluir.id));
    setTarefaParaExcluir(null);
    setShowDeleteModal(false);
  };

  const handleMarcarConcluida = (id) => {
    const tarefaConcluida = tarefas.find(t => t.id === id);
    if (tarefaConcluida) {
      // Adicionar ao histórico do dia
      const novoHistorico = {
        id: tarefaConcluida.id,
        titulo: tarefaConcluida.titulo,
        descricao: tarefaConcluida.descricao,
        status: 'Concluída',
        tempoGasto: tarefaConcluida.tempoGasto,
        concluida: new Date().toISOString(),
        resultado: 'Tarefa concluída com sucesso',
        categoria: tarefaConcluida.categoria
      };
      
      setHistoricoTarefas([novoHistorico, ...historicoTarefas]);
      
      // Atualizar tarefa
      setTarefas(tarefas.map(tarefa => 
        tarefa.id === id 
          ? { ...tarefa, status: 'Concluída', progresso: 100 }
          : tarefa
      ));
    }
  };

  const handleReportarProblema = (tarefa) => {
    setTarefaComProblema(tarefa);
    setShowProblemModal(true);
  };

  const handleSalvarProblema = () => {
    if (tarefaComProblema && problemaDescricao.trim()) {
      // Adicionar problema ao histórico
      const problemaRegistrado = {
        id: Date.now(),
        titulo: `Problema: ${tarefaComProblema.titulo}`,
        descricao: problemaDescricao,
        status: 'Problema',
        tempoGasto: '0min',
        concluida: new Date().toISOString(),
        resultado: `Problema reportado: ${problemaDescricao}`,
        categoria: 'Problema'
      };
      
      setHistoricoTarefas([problemaRegistrado, ...historicoTarefas]);
      
      // Marcar tarefa como com problema
      setTarefas(tarefas.map(tarefa => 
        tarefa.id === tarefaComProblema.id 
          ? { ...tarefa, status: 'Com Problema', problema: problemaDescricao }
          : tarefa
      ));
      
      setProblemaDescricao('');
      setTarefaComProblema(null);
      setShowProblemModal(false);
    }
  };

  const isTaskOverdue = (prazo, status) => {
    if (status === 'Concluída') return false;
    return new Date(prazo) < new Date();
  };

  const handleIniciarPausarTarefa = (id) => {
    setTarefas(tarefas.map(tarefa => {
      if (tarefa.id === id) {
        const novoStatus = tarefa.status === 'Em andamento' ? 'Pendente' : 'Em andamento';
        return { ...tarefa, status: novoStatus };
      }
      return tarefa;
    }));
    
    setTimers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleResetarTarefas = () => {
    setShowResetModal(true);
  };

  const confirmarReset = () => {
    // Apenas tarefas concluídas podem ser resetadas
    const tarefasConcluidas = tarefas.filter(t => t.status === 'Concluída');
    
    if (tarefasConcluidas.length === 0) {
      alert('Não há tarefas concluídas para resetar!');
      setShowResetModal(false);
      return;
    }

    // Mover tarefas concluídas para o histórico da semana
    const novasHistoricoSemana = tarefasConcluidas.map(t => ({
      id: t.id,
      titulo: t.titulo,
      descricao: t.descricao,
      status: 'Concluída',
      tempoGasto: t.tempoGasto,
      concluida: new Date().toISOString(),
      resultado: t.resultado || 'Tarefa concluída com sucesso',
      categoria: t.categoria,
      tipo: t.tipo,
      prioridade: t.prioridade,
      problemas: t.problemas || []
    }));

    // Mover histórico do dia para histórico da semana
    const novoHistoricoSemana = [...historicoSemana, ...historicoTarefas, ...novasHistoricoSemana];
    
    setHistoricoSemana(novoHistoricoSemana);
    setHistoricoTarefas([]);
    setTarefas(tarefas.filter(t => t.status !== 'Concluída'));
    setShowResetModal(false);
  };

  const handleDuplicarTarefa = (tarefa) => {
    const novaTarefaDuplicada = {
      ...tarefa,
      id: Date.now(),
      titulo: `${tarefa.titulo} (Cópia)`,
      status: 'Pendente',
      progresso: 0,
      tempoGasto: '0min',
      criadoEm: new Date().toISOString()
    };
    
    setTarefas([...tarefas, novaTarefaDuplicada]);
  };

  const handleLimparHistoricoDia = () => {
    if (historicoTarefas.length === 0) {
      alert('Não há tarefas no histórico do dia para limpar!');
      return;
    }
    
    // Mover histórico do dia para histórico da semana
    const novoHistoricoSemana = [...historicoSemana, ...historicoTarefas];
    setHistoricoSemana(novoHistoricoSemana);
    setHistoricoTarefas([]);
    
    alert('Histórico do dia transferido para o histórico da semana!');
  };

  const handleLimparHistoricoSemana = () => {
    if (!isSuperAdmin) {
      alert('Apenas SUPER_ADMIN pode limpar o histórico da semana!');
      return;
    }
    
    if (historicoSemana.length === 0) {
      alert('Não há tarefas no histórico da semana para limpar!');
      return;
    }
    
    const confirmacao = confirm(
      `Tem certeza que deseja limpar o histórico da semana?\n\n` +
      `Isso irá remover permanentemente ${historicoSemana.length} tarefa(s) do histórico.\n\n` +
      `Esta ação não pode ser desfeita!`
    );
    
    if (confirmacao) {
      setHistoricoSemana([]);
      alert('Histórico da semana limpo com sucesso!');
    }
  };

  const handleExportarRelatorio = () => {
    // Combinar todas as tarefas concluídas (histórico do dia + histórico da semana + tarefas concluídas)
    const tarefasConcluidas = tarefas.filter(t => t.status === 'Concluída');
    const todasTarefasConcluidas = [
      ...tarefasConcluidas.map(t => ({
        ...t,
        concluida: new Date().toISOString(),
        origem: 'Tarefas Atuais'
      })),
      ...historicoTarefas.map(h => ({
        ...h,
        origem: 'Histórico do Dia'
      })),
      ...historicoSemana.map(h => ({
        ...h,
        origem: 'Histórico da Semana'
      }))
    ];

    if (todasTarefasConcluidas.length === 0) {
      alert('Não há tarefas concluídas para exportar!');
      return;
    }

    // Preparar dados para o Excel
    const dadosExcel = todasTarefasConcluidas.map((tarefa, index) => ({
      'Nº': index + 1,
      'Título': tarefa.titulo,
      'Descrição': tarefa.descricao,
      'Categoria': tarefa.categoria,
      'Tipo': tarefa.tipo || 'N/A',
      'Prioridade': tarefa.prioridade || 'N/A',
      'Tempo Gasto': tarefa.tempoGasto,
      'Tempo Estimado': tarefa.tempoEstimado || 'N/A',
      'Data Conclusão': new Date(tarefa.concluida).toLocaleDateString('pt-BR'),
      'Hora Conclusão': new Date(tarefa.concluida).toLocaleTimeString('pt-BR'),
      'Status Final': tarefa.status || 'Concluída',
      'Problemas Relatados': tarefa.problemas && tarefa.problemas.length > 0 ? 'Sim' : 'Não',
      'Detalhes dos Problemas': tarefa.problemas && tarefa.problemas.length > 0 ? 
        tarefa.problemas.map(p => `${p.tipo}: ${p.descricao}`).join('; ') : 'N/A',
      'Resultado': tarefa.resultado || 'Tarefa concluída com sucesso',
      'Responsável': tarefa.responsavel || 'Você',
      'Origem': tarefa.origem
    }));

    // Criar planilha Excel
    const ws = XLSX.utils.json_to_sheet(dadosExcel);
    
    // Adicionar estatísticas resumidas
    const estatisticas = [
      {},
      { 'Nº': 'RESUMO ESTATÍSTICO' },
      { 'Nº': 'Total de Tarefas:', 'Título': todasTarefasConcluidas.length },
      { 'Nº': 'Com Problemas:', 'Título': todasTarefasConcluidas.filter(t => t.problemas && t.problemas.length > 0).length },
      { 'Nº': 'Sem Problemas:', 'Título': todasTarefasConcluidas.filter(t => !t.problemas || t.problemas.length === 0).length },
      { 'Nº': 'Tarefas Atuais:', 'Título': todasTarefasConcluidas.filter(t => t.origem === 'Tarefas Atuais').length },
      { 'Nº': 'Histórico do Dia:', 'Título': todasTarefasConcluidas.filter(t => t.origem === 'Histórico do Dia').length },
      { 'Nº': 'Histórico da Semana:', 'Título': todasTarefasConcluidas.filter(t => t.origem === 'Histórico da Semana').length },
      { 'Nº': 'Gerado em:', 'Título': new Date().toLocaleString('pt-BR') }
    ];
    
    XLSX.utils.sheet_add_json(ws, estatisticas, { origin: -1, skipHeader: true });
    
    // Configurar largura das colunas
    const colWidths = [
      { wch: 5 },   // Nº
      { wch: 25 },  // Título
      { wch: 35 },  // Descrição
      { wch: 15 },  // Categoria
      { wch: 15 },  // Tipo
      { wch: 12 },  // Prioridade
      { wch: 12 },  // Tempo Gasto
      { wch: 15 },  // Tempo Estimado
      { wch: 12 },  // Data Conclusão
      { wch: 12 },  // Hora Conclusão
      { wch: 12 },  // Status Final
      { wch: 18 },  // Problemas Relatados
      { wch: 50 },  // Detalhes dos Problemas
      { wch: 30 },  // Resultado
      { wch: 15 },  // Responsável
      { wch: 18 }   // Origem
    ];
    ws['!cols'] = colWidths;

    // Criar workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tarefas Concluídas');

    // Adicionar metadados
    const metadados = {
      'A1': { v: 'RELATÓRIO DE TAREFAS CONCLUÍDAS', t: 's' }
    };

    // Gerar nome do arquivo com data atual
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `Relatorio_Tarefas_Concluidas_${dataAtual}.xlsx`;

    // Fazer download
    XLSX.writeFile(wb, nomeArquivo);
  };

  const tipoOptions = ['Ligações', 'Emails', 'Reunião', 'Proposta', 'Qualificação', 'Follow-up', 'Administrativo'];
  const prioridadeOptions = ['Alta', 'Média', 'Baixa'];
  const categoriaOptions = ['Prospecção', 'Vendas', 'Marketing', 'Administrativo', 'Análise'];

  return (
    <div className="tarefas-diarias-page">
      {/* Header Principal */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Tarefas Diárias</h1>
            <p className="page-subtitle">Gerencie suas atividades e maximize sua produtividade</p>
            <div className="current-time">
              <Clock size={16} />
              <span>{currentTime.toLocaleString('pt-BR')}</span>
            </div>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <User size={16} />
              <span className={`user-role ${isSuperAdmin ? 'super-admin' : 'regular-user'}`}>
                {isSuperAdmin ? 'SUPER_ADMIN' : (userRole || 'USER')}
              </span>
            </div>
            <button 
              className="action-btn secondary" 
              onClick={handleResetarTarefas}
              title="Resetar tarefas do dia"
            >
              <RotateCcw size={16} />
              Resetar Dia
            </button>
            <button className="action-btn secondary" onClick={() => window.location.reload()}>
              <RefreshCw size={16} />
              Atualizar
            </button>
            <button 
              className="action-btn primary"
              onClick={() => setShowNewTaskModal(true)}
            >
              <Plus size={16} />
              Nova Tarefa
            </button>
            <button 
              className="action-btn success"
              onClick={handleExportarRelatorio}
              title="Exportar relatório de tarefas concluídas"
            >
              <Download size={16} />
              Exportar Relatório
            </button>
            {isSuperAdmin && (
              <button 
                className="action-btn danger"
                onClick={handleLimparHistoricoSemana}
                title="Limpar histórico da semana (Apenas SUPER_ADMIN)"
              >
                <Archive size={16} />
                Limpar Histórico Semana
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total de Tarefas</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +3 hoje
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.concluidas}</div>
            <div className="stat-label">Concluídas</div>
            <div className="stat-trend positive">
              <Award size={12} />
              {produtividade}% produtividade
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.emAndamento}</div>
            <div className="stat-label">Em Andamento</div>
            <div className="stat-trend">
              <Zap size={12} />
              Ativas agora
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Timer size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendentes}</div>
            <div className="stat-label">Pendentes</div>
            <div className="stat-trend warning">
              <Clock size={12} />
              Aguardando
            </div>
          </div>
        </div>

        {stats.comProblema > 0 && (
          <div className="stat-card">
            <div className="stat-icon red">
              <AlertCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.comProblema}</div>
              <div className="stat-label">Com Problema</div>
              <div className="stat-trend negative">
                <AlertCircle size={12} />
                Requer atenção
              </div>
            </div>
          </div>
        )}

        {stats.atrasadas > 0 && (
          <div className="stat-card">
            <div className="stat-icon red">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.atrasadas}</div>
              <div className="stat-label">Atrasadas</div>
              <div className="stat-trend negative">
                <AlertCircle size={12} />
                Prazo vencido
              </div>
            </div>
          </div>
        )}

        {isSuperAdmin && (
          <div className="stat-card">
            <div className="stat-icon orange">
              <Archive size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{historicoSemana.length}</div>
              <div className="stat-label">Histórico Semana</div>
              <div className="stat-trend">
                <History size={12} />
                SUPER_ADMIN
              </div>
            </div>
          </div>
        )}

        {isSuperAdmin && historicoTarefas.length > 0 && (
          <div className="stat-card">
            <div className="stat-icon teal">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{historicoTarefas.length}</div>
              <div className="stat-label">Histórico Dia</div>
              <div className="stat-trend">
                <Calendar size={12} />
                SUPER_ADMIN
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controles e Filtros */}
      <div className="controls-section">
        <div className="search-filters">
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em andamento">Em Andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Agendada">Agendada</option>
            <option value="Com Problema">Com Problema</option>
          </select>

          <select
            value={filtroPrioridade}
            onChange={(e) => setFiltroPrioridade(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </div>

        <div className="view-options">
          <button className="view-btn active">
            <Target size={16} />
            Lista
          </button>
          <button className="view-btn">
            <Calendar size={16} />
            Calendário
          </button>
        </div>
      </div>

      {/* Layout Principal */}
      <div className="main-layout">
        {/* Coluna Principal - Lista de Tarefas */}
        <div className="tasks-section">
          <div className="section-header">
            <h3 className="section-title">Tarefas de Hoje</h3>
            <div className="progress-overview">
              <span className="progress-text">{stats.concluidas} de {stats.total} concluídas</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${produtividade}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="tasks-list">
            {tarefasFiltradas.length > 0 ? tarefasFiltradas.map(tarefa => (
              <div key={tarefa.id} className={`task-card ${isTaskOverdue(tarefa.prazo, tarefa.status) ? 'overdue' : ''}`}>
                {/* Indicador de atraso */}
                {isTaskOverdue(tarefa.prazo, tarefa.status) && (
                  <div className="overdue-indicator">
                    <AlertCircle size={16} />
                    <span>Tarefa em atraso</span>
                  </div>
                )}
                
                <div className="task-header">
                  <div className="task-info">
                    <div className="task-checkbox">
                      <input 
                        type="checkbox" 
                        checked={tarefa.status === 'Concluída'}
                        onChange={() => handleMarcarConcluida(tarefa.id)}
                        className="checkbox-input"
                      />
                      <CheckCircle 
                        className={`checkbox-icon ${tarefa.status === 'Concluída' ? 'checked' : ''}`}
                        size={20}
                      />
                    </div>
                    <div className="task-details">
                      <h4 className={`task-title ${tarefa.status === 'Concluída' ? 'completed' : ''}`}>
                        {tarefa.titulo}
                      </h4>
                      <p className="task-description">{tarefa.descricao}</p>
                      
                      {/* Indicador de problema */}
                      {tarefa.status === 'Com Problema' && tarefa.problema && (
                        <div className="problem-indicator">
                          <AlertCircle size={14} />
                          <span className="problem-text">
                            <strong>Problema:</strong> {tarefa.problema}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="task-meta">
                    <span className={`priority-badge ${getPrioridadeColor(tarefa.prioridade)}`}>
                      {tarefa.prioridade}
                    </span>
                    <span className={`status-badge ${getStatusColor(tarefa.status)}`}>
                      {tarefa.status}
                    </span>
                  </div>
                </div>

                <div className="task-progress">
                  <div className="progress-info">
                    <span className="progress-label">Progresso</span>
                    <span className="progress-percentage">{tarefa.progresso}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${tarefa.progresso}%` }}
                    ></div>
                  </div>
                </div>

                <div className="task-footer">
                  <div className="task-stats">
                    <div className="stat-item">
                      <Clock size={14} />
                      <span>Tempo: {tarefa.tempoGasto} / {tarefa.tempoEstimado}</span>
                    </div>
                    <div className="stat-item">
                      <Calendar size={14} />
                      <span>Prazo: {new Date(tarefa.prazo).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="stat-item">
                      <User size={14} />
                      <span>{tarefa.responsavel}</span>
                    </div>
                  </div>

                  <div className="task-actions">
                    {/* Todos os botões em uma linha */}
                    {tarefa.status !== 'Concluída' && (
                      <button 
                        className="task-action-btn success" 
                        title="Concluir Tarefa"
                        onClick={() => handleMarcarConcluida(tarefa.id)}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {tarefa.status !== 'Concluída' && (
                      <button 
                        className="task-action-btn warning" 
                        title="Reportar Problema"
                        onClick={() => handleReportarProblema(tarefa)}
                      >
                        <AlertCircle size={16} />
                      </button>
                    )}
                    <button 
                      className="task-action-btn" 
                      title={tarefa.status === 'Em andamento' ? 'Pausar' : 'Iniciar'}
                      onClick={() => handleIniciarPausarTarefa(tarefa.id)}
                    >
                      {tarefa.status === 'Em andamento' ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button 
                      className="task-action-btn" 
                      title="Editar"
                      onClick={() => handleEditarTarefa(tarefa)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="task-action-btn" 
                      title="Duplicar"
                      onClick={() => handleDuplicarTarefa(tarefa)}
                    >
                      <Copy size={16} />
                    </button>
                    {isSuperAdmin && (
                      <button 
                        className="task-action-btn danger" 
                        title="Excluir (Apenas SUPER_ADMIN)"
                        onClick={() => handleExcluirTarefa(tarefa)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {tarefa.tags && tarefa.tags.length > 0 && (
                  <div className="task-tags">
                    {tarefa.tags.map((tag, index) => (
                      <span key={index} className="task-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <div className="empty-state">
                <Target size={48} />
                <h3>Nenhuma tarefa encontrada</h3>
                <p>Tente ajustar os filtros ou criar uma nova tarefa</p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Lateral - Histórico */}
        <div className="history-section">
          <div className="section-header">
            <h3 className="section-title">Histórico do Dia</h3>
            <div className="header-actions">
              {historicoTarefas.length > 0 && (
                <button 
                  className="clear-history-btn"
                  onClick={handleLimparHistoricoDia}
                  title="Limpar histórico do dia"
                >
                  <Trash2 size={14} />
                  Limpar
                </button>
              )}
              <button className="view-all-btn">
                <Eye size={14} />
                Ver Tudo
              </button>
            </div>
          </div>

          <div className="history-list">
            {historicoTarefas.length > 0 ? historicoTarefas.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-status">
                  <CheckCircle className="status-icon completed" size={16} />
                </div>
                <div className="history-content">
                  <h5 className="history-title">{item.titulo}</h5>
                  <p className="history-description">{item.descricao}</p>
                  <div className="history-meta">
                    <span className="history-time">
                      <Clock size={12} />
                      {item.tempoGasto}
                    </span>
                    <span className="history-result">{item.resultado}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-history">
                <History size={32} />
                <p>Nenhuma tarefa concluída hoje</p>
              </div>
            )}
          </div>

          {/* Histórico da Semana */}
          <div className="section-header">
            <h3 className="section-title">Histórico da Semana</h3>
            <button className="view-all-btn">
              <Archive size={14} />
              Ver Tudo
            </button>
          </div>

          <div className="history-list">
            {historicoSemana.length > 0 ? historicoSemana.slice(0, 5).map(item => (
              <div key={item.id} className="history-item">
                <div className="history-status">
                  <CheckCircle className="status-icon completed" size={16} />
                </div>
                <div className="history-content">
                  <h5 className="history-title">{item.titulo}</h5>
                  <p className="history-description">{item.descricao}</p>
                  <div className="history-meta">
                    <span className="history-time">
                      <Clock size={12} />
                      {item.tempoGasto}
                    </span>
                    <span className="history-result">{item.resultado}</span>
                  </div>
                  <div className="history-date">
                    <Calendar size={10} />
                    <span>{new Date(item.concluida).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-history">
                <Archive size={32} />
                <p>Nenhuma tarefa no histórico da semana</p>
              </div>
            )}
          </div>

          {/* Widget de Produtividade */}
          <div className="productivity-widget">
            <h4 className="widget-title">Produtividade Hoje</h4>
            <div className="productivity-chart">
              <div className="chart-circle">
                <span className="chart-percentage">{produtividade}%</span>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color green"></div>
                  <span>Concluídas ({stats.concluidas})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color gray"></div>
                  <span>Pendentes ({stats.pendentes})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nova Tarefa */}
      {showNewTaskModal && (
        <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nova Tarefa</h3>
              <button 
                className="close-btn"
                onClick={() => setShowNewTaskModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAdicionarTarefa} className="task-form">
              <div className="form-group">
                <label className="form-label">Título da Tarefa</label>
                <input
                  type="text"
                  value={novaTarefa.titulo}
                  onChange={(e) => setNovaTarefa({...novaTarefa, titulo: e.target.value})}
                  className="form-input"
                  placeholder="Ex: Ligar para leads quentes"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  value={novaTarefa.descricao}
                  onChange={(e) => setNovaTarefa({...novaTarefa, descricao: e.target.value})}
                  className="form-textarea"
                  placeholder="Descreva os detalhes da tarefa..."
                  rows="3"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select
                    value={novaTarefa.tipo}
                    onChange={(e) => setNovaTarefa({...novaTarefa, tipo: e.target.value})}
                    className="form-select"
                  >
                    {tipoOptions.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prioridade</label>
                  <select
                    value={novaTarefa.prioridade}
                    onChange={(e) => setNovaTarefa({...novaTarefa, prioridade: e.target.value})}
                    className="form-select"
                  >
                    {prioridadeOptions.map(prioridade => (
                      <option key={prioridade} value={prioridade}>{prioridade}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select
                    value={novaTarefa.categoria}
                    onChange={(e) => setNovaTarefa({...novaTarefa, categoria: e.target.value})}
                    className="form-select"
                  >
                    {categoriaOptions.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tempo Estimado</label>
                  <input
                    type="text"
                    value={novaTarefa.tempoEstimado}
                    onChange={(e) => setNovaTarefa({...novaTarefa, tempoEstimado: e.target.value})}
                    className="form-input"
                    placeholder="Ex: 2h, 30min"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Prazo</label>
                <input
                  type="datetime-local"
                  value={novaTarefa.prazo}
                  onChange={(e) => setNovaTarefa({...novaTarefa, prazo: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowNewTaskModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <Plus size={16} />
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Tarefa */}
      {showEditModal && tarefaEditando && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Tarefa</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="task-form">
              <div className="form-group">
                <label className="form-label">Título da Tarefa</label>
                <input
                  type="text"
                  value={tarefaEditando.titulo}
                  onChange={(e) => setTarefaEditando({...tarefaEditando, titulo: e.target.value})}
                  className="form-input"
                  placeholder="Ex: Ligar para leads quentes"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  value={tarefaEditando.descricao}
                  onChange={(e) => setTarefaEditando({...tarefaEditando, descricao: e.target.value})}
                  className="form-textarea"
                  placeholder="Descreva os detalhes da tarefa..."
                  rows="3"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select
                    value={tarefaEditando.tipo}
                    onChange={(e) => setTarefaEditando({...tarefaEditando, tipo: e.target.value})}
                    className="form-select"
                  >
                    {tipoOptions.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prioridade</label>
                  <select
                    value={tarefaEditando.prioridade}
                    onChange={(e) => setTarefaEditando({...tarefaEditando, prioridade: e.target.value})}
                    className="form-select"
                  >
                    {prioridadeOptions.map(prioridade => (
                      <option key={prioridade} value={prioridade}>{prioridade}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={tarefaEditando.status}
                    onChange={(e) => setTarefaEditando({...tarefaEditando, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Agendada">Agendada</option>
                    <option value="Com Problema">Com Problema</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Progresso (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tarefaEditando.progresso}
                    onChange={(e) => setTarefaEditando({...tarefaEditando, progresso: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select
                    value={tarefaEditando.categoria}
                    onChange={(e) => setTarefaEditando({...tarefaEditando, categoria: e.target.value})}
                    className="form-select"
                  >
                    {categoriaOptions.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tempo Estimado</label>
                  <input
                    type="text"
                    value={tarefaEditando.tempoEstimado}
                    onChange={(e) => setTarefaEditando({...tarefaEditando, tempoEstimado: e.target.value})}
                    className="form-input"
                    placeholder="Ex: 2h, 30min"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Prazo</label>
                <input
                  type="datetime-local"
                  value={tarefaEditando.prazo}
                  onChange={(e) => setTarefaEditando({...tarefaEditando, prazo: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <Save size={16} />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {showDeleteModal && tarefaParaExcluir && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirmar Exclusão</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <div className="delete-confirmation">
              <div className="delete-icon">
                <Trash2 size={48} />
              </div>
              <h4>Tem certeza que deseja excluir esta tarefa?</h4>
              <p>
                <strong>{tarefaParaExcluir.titulo}</strong>
              </p>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-danger"
                onClick={confirmarExclusao}
              >
                <Trash2 size={16} />
                Excluir Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Reset */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Resetar Tarefas do Dia</h3>
              <button 
                className="close-btn"
                onClick={() => setShowResetModal(false)}
              >
                ×
              </button>
            </div>

            <div className="reset-confirmation">
              <div className="reset-icon">
                <RotateCcw size={48} />
              </div>
              <h4>Resetar todas as tarefas do dia?</h4>
              <p>Esta ação irá:</p>
              <ul className="reset-actions">
                <li>Mover tarefas concluídas para o histórico da semana</li>
                <li>Mover histórico do dia para o histórico da semana</li>
                <li>Limpar tarefas concluídas da lista atual</li>
              </ul>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowResetModal(false)}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-warning"
                onClick={confirmarReset}
              >
                <RotateCcw size={16} />
                Resetar Dia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reportar Problema */}
      {showProblemModal && tarefaComProblema && (
        <div className="modal-overlay" onClick={() => setShowProblemModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reportar Problema na Tarefa</h3>
              <button 
                className="close-btn"
                onClick={() => setShowProblemModal(false)}
              >
                ×
              </button>
            </div>

            <div className="problem-form">
              <div className="task-info-summary">
                <h4>Tarefa: {tarefaComProblema.titulo}</h4>
                <p>{tarefaComProblema.descricao}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Descreva o problema encontrado:</label>
                <textarea
                  value={problemaDescricao}
                  onChange={(e) => setProblemaDescricao(e.target.value)}
                  className="form-textarea"
                  placeholder="Explique qual é o problema para realizar esta tarefa, obstáculos encontrados, recursos necessários, etc."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="problem-examples">
                <h5>Exemplos de problemas:</h5>
                <ul>
                  <li>Falta de informações do cliente</li>
                  <li>Sistema indisponível</li>
                  <li>Recurso necessário não disponível</li>
                  <li>Dependência de terceiros</li>
                  <li>Prazo muito apertado</li>
                </ul>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowProblemModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-warning"
                onClick={handleSalvarProblema}
                disabled={!problemaDescricao.trim()}
              >
                <AlertCircle size={16} />
                Reportar Problema
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tarefas-diarias-page {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .tarefas-diarias-page::before {
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

        .header-left {
          flex: 1;
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
          margin-bottom: 1rem;
        }

        .current-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 500;
          background: rgba(59, 130, 246, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          width: fit-content;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-role.super-admin {
          color: #dc2626;
          font-weight: 700;
        }

        .user-role.regular-user {
          color: #64748b;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
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
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .action-btn.success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .action-btn.success:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .action-btn.danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .action-btn.danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
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
          transition: all 0.4s ease;
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

        .stat-icon.teal {
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(20, 184, 166, 0.1));
          color: #14b8a6;
        }

        .stat-icon.purple {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
          color: #8b5cf6;
        }

        .stat-icon.red {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(220, 38, 38, 0.1));
          color: #dc2626;
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
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          width: fit-content;
        }

        .stat-trend.positive {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .stat-trend.warning {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .stat-trend.negative {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.1);
        }

        .stat-trend {
          color: #6b7280;
          background: rgba(107, 114, 128, 0.1);
        }

        /* Controles */
        .controls-section {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .search-filters {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex: 1;
        }

        .search-box {
          position: relative;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #1e293b;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #1e293b;
          font-size: 0.875rem;
          min-width: 150px;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        .view-options {
          display: flex;
          gap: 0.5rem;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #64748b;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .view-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        /* Layout Principal */
        .main-layout {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        /* Seção de Tarefas */
        .tasks-section {
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

        .progress-overview {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
        }

        .progress-bar {
          width: 200px;
          height: 8px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .task-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .task-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .task-card:hover::before {
          left: 100%;
        }

        .task-card:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .task-info {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          flex: 1;
        }

        .task-checkbox {
          position: relative;
          margin-top: 0.25rem;
        }

        .checkbox-input {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .checkbox-icon {
          color: #cbd5e1;
          transition: all 0.3s ease;
        }

        .checkbox-icon.checked {
          color: #10b981;
        }

        .task-details {
          flex: 1;
        }

        .task-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
          transition: all 0.3s ease;
        }

        .task-title.completed {
          text-decoration: line-through;
          color: #64748b;
        }

        .task-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .task-meta {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .priority-badge, .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid;
        }

        .task-progress {
          margin-bottom: 1rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .progress-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        .progress-percentage {
          font-size: 0.8rem;
          color: #1e293b;
          font-weight: 700;
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .task-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: #64748b;
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
        }

        .task-action-btn {
          width: 2rem;
          height: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .task-action-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .task-action-btn.danger {
          color: #dc2626;
        }

        .task-action-btn.danger:hover {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }

        .task-action-btn.success {
          color: #16a34a;
        }

        .task-action-btn.success:hover {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .task-action-btn.warning {
          color: #d97706;
        }

        .task-action-btn.warning:hover {
          background: rgba(217, 119, 6, 0.1);
          color: #d97706;
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .primary-actions {
          display: flex;
          gap: 0.5rem;
        }

        .secondary-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* Indicador de problema */
        .problem-indicator {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 0.5rem;
          margin-top: 0.5rem;
          color: #dc2626;
          font-size: 0.8rem;
        }

        .problem-text {
          flex: 1;
          line-height: 1.4;
        }

        .problem-text strong {
          font-weight: 600;
        }

        /* Botões do cabeçalho */
        .header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .clear-history-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-history-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          transform: translateY(-1px);
        }

        /* Indicador de atraso */
        .overdue-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          margin-bottom: 1rem;
          color: #dc2626;
          font-size: 0.875rem;
          font-weight: 600;
          animation: pulse-red 2s infinite;
        }

        @keyframes pulse-red {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
        }

        /* Card com atraso */
        .task-card.overdue {
          border-left: 4px solid #dc2626;
          background: linear-gradient(135deg, #fef2f2, #fef7f7);
        }

        /* Estilos do modal de problema */
        .problem-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .task-info-summary {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          padding: 1rem;
        }

        .task-info-summary h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .task-info-summary p {
          color: #64748b;
          margin: 0;
        }

        .problem-examples {
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.1);
          border-radius: 8px;
          padding: 1rem;
        }

        .problem-examples h5 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .problem-examples ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .problem-examples li {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .task-tags {
          margin-top: 1rem;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .task-tag {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* Estados vazios */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(248, 250, 252, 0.6);
          border-radius: 12px;
          border: 2px dashed #cbd5e1;
          color: #64748b;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 1rem 0 0.5rem 0;
        }

        .empty-state p {
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .empty-history {
          text-align: center;
          padding: 2rem 1rem;
          color: #64748b;
          background: rgba(248, 250, 252, 0.4);
          border-radius: 8px;
          border: 1px dashed #cbd5e1;
        }

        .empty-history p {
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        /* Histórico da semana */
        .history-date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }

        /* Estilos dos modais */
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
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .modal-content.small {
          max-width: 400px;
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

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          color: #1e293b;
          transform: scale(1.1);
        }

        .task-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .form-input, .form-textarea, .form-select {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #1e293b;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
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
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel, .btn-save, .btn-danger, .btn-warning {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
        }

        .btn-save {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }

        .btn-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          color: #1e293b;
          transform: scale(1.1);
        }

        .task-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .form-input, .form-textarea, .form-select {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #1e293b;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
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
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel, .btn-save, .btn-danger, .btn-warning {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
        }

        .btn-save {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }

        .btn-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        /* Confirmações dos modais */
        .delete-confirmation,
        .reset-confirmation {
          text-align: center;
          padding: 1rem 0;
        }

        .delete-icon,
        .reset-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          color: #ef4444;
        }

        .reset-icon {
          color: #f59e0b;
        }

        .delete-confirmation h4,
        .reset-confirmation h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .delete-confirmation p,
        .reset-confirmation p {
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .warning-text {
          color: #ef4444 !important;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .reset-actions {
          text-align: left;
          margin: 1rem 0;
          padding-left: 1rem;
        }

        .reset-actions li {
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        /* Seção de Histórico */
        .history-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .history-list {
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

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        .history-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
        }

        .history-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .history-status {
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .status-icon.completed {
          color: #10b981;
        }

        .history-content {
          flex: 1;
        }

        .history-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .history-description {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .history-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .history-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .history-result {
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 600;
        }

        /* Widget de Produtividade */
        .productivity-widget {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          text-align: center;
        }

        .widget-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .productivity-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .chart-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: conic-gradient(#10b981 0deg, #10b981 var(--percentage, 75deg), #e2e8f0 var(--percentage, 75deg));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .chart-circle::before {
          content: '';
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          position: absolute;
        }

        .chart-percentage {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1e293b;
          position: relative;
          z-index: 1;
        }

        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #64748b;
        }

        .legend-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-color.green {
          background: #10b981;
        }

        .legend-color.gray {
          background: #e2e8f0;
        }

        /* Estado Vazio */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(248, 250, 252, 0.6);
          border-radius: 12px;
          border: 2px dashed #cbd5e1;
          color: #64748b;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 1rem 0 0.5rem 0;
        }

        .empty-state p {
          font-size: 0.9rem;
          line-height: 1.4;
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
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
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

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          color: #1e293b;
          transform: scale(1.1);
        }

        .task-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .form-input, .form-textarea, .form-select {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #1e293b;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
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
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel, .btn-save {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
        }

        .btn-save {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        /* Animações */
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
        @media (max-width: 1024px) {
          .main-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .tarefas-diarias-page {
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

          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-filters {
            flex-direction: column;
          }

          .search-box {
            min-width: auto;
          }

          .task-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .task-stats {
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .page-header,
          .tasks-section,
          .history-list,
          .productivity-widget {
            padding: 1.5rem;
          }

          .task-card {
            padding: 1rem;
          }

          .stat-card {
            padding: 1rem;
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
        .action-btn:focus,
        .view-btn:focus,
        .task-action-btn:focus,
        .btn-save:focus,
        .btn-cancel:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .tasks-section,
          .history-list,
          .productivity-widget,
          .task-card {
            border: 2px solid #1e293b;
          }
          
          .page-title,
          .section-title,
          .task-title,
          .widget-title {
            color: #000;
          }
        }

        /* Print Styles */
        @media print {
          .tarefas-diarias-page {
            background: white;
          }
          
          .page-header,
          .tasks-section,
          .history-list,
          .productivity-widget,
          .task-card {
            background: white;
            border: 1px solid #000;
            box-shadow: none;
          }
          
          .action-btn,
          .view-btn,
          .task-action-btn {
            display: none;
          }
        }

        /* Customização de cores específicas */
        .text-blue-600 { color: #2563eb; }
        .text-green-600 { color: #16a34a; }
        .text-yellow-600 { color: #ca8a04; }
        .text-red-600 { color: #dc2626; }
        .text-purple-600 { color: #9333ea; }
        .text-gray-600 { color: #4b5563; }

        .bg-blue-50 { background-color: #eff6ff; }
        .bg-green-50 { background-color: #f0fdf4; }
        .bg-yellow-50 { background-color: #fefce8; }
        .bg-red-50 { background-color: #fef2f2; }
        .bg-purple-50 { background-color: #faf5ff; }
        .bg-gray-50 { background-color: #f9fafb; }

        .border-blue-200 { border-color: #bfdbfe; }
        .border-green-200 { border-color: #bbf7d0; }
        .border-yellow-200 { border-color: #fef08a; }
        .border-red-200 { border-color: #fecaca; }
        .border-purple-200 { border-color: #e9d5ff; }
        .border-gray-200 { border-color: #e5e7eb; }

        /* Efeitos especiais para glassmorphism */
        .task-card,
        .stat-card,
        .productivity-widget,
        .history-list {
          position: relative;
        }

        .task-card::after,
        .stat-card::after,
        .productivity-widget::after,
        .history-list::after {
          content: '';
          position: absolute;
          top: 1px;
          left: 1px;
          right: 1px;
          bottom: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          border-radius: inherit;
          pointer-events: none;
        }

        /* Configuração dinâmica do gráfico circular */
        .chart-circle {
          --percentage: ${produtividade * 3.6}deg;
        }

        /* Estilos para scrollbar customizada */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }

        /* Melhorias na tipografia */
        .task-title,
        .history-title,
        .widget-title,
        .section-title {
          letter-spacing: -0.025em;
        }

        .page-title {
          letter-spacing: -0.05em;
        }

        /* Efeito de hover para badges */
        .priority-badge,
        .status-badge {
          transition: all 0.3s ease;
          cursor: default;
        }

        .priority-badge:hover,
        .status-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Animação de entrada escalonada para tarefas */
        .task-card:nth-child(1) { animation-delay: 0.1s; }
        .task-card:nth-child(2) { animation-delay: 0.2s; }
        .task-card:nth-child(3) { animation-delay: 0.3s; }
        .task-card:nth-child(4) { animation-delay: 0.4s; }
        .task-card:nth-child(5) { animation-delay: 0.5s; }

        /* Melhorias no widget de produtividade */
        .productivity-widget:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .chart-circle {
          transition: all 0.5s ease;
        }

        .productivity-widget:hover .chart-circle {
          transform: scale(1.05);
        }

        /* Estados de loading para ações */
        .action-btn:disabled,
        .task-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Indicador de tarefa atrasada */
        .task-card.overdue {
          border-left: 4px solid #ef4444;
        }

        .task-card.overdue .task-title::after {
          content: '⚠️';
          margin-left: 0.5rem;
          font-size: 0.8em;
        }

        /* Micro-interações */
        .checkbox-input:checked + .checkbox-icon {
          animation: checkmark 0.3s ease;
        }

        @keyframes checkmark {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Indicadores de status em tempo real */
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 0.5rem;
        }

        .status-indicator.active {
          background: #10b981;
          animation: pulse 2s infinite;
        }

        .status-indicator.pending {
          background: #f59e0b;
        }

        .status-indicator.completed {
          background: #6b7280;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Melhorias no layout móvel */
        @media (max-width: 640px) {
          .task-meta {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .priority-badge,
          .status-badge {
            font-size: 0.7rem;
            padding: 0.2rem 0.6rem;
          }

          .current-time {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }

          .modal-content {
            margin: 0.5rem;
            padding: 1.5rem;
          }

          .task-actions {
            justify-content: center;
            gap: 0.25rem;
          }

          .task-action-btn {
            min-width: 2rem;
            padding: 0.5rem;
          }

          .problem-indicator {
            font-size: 0.75rem;
            padding: 0.4rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 0.25rem;
          }

          .clear-history-btn {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
          }
        }

        /* Tema escuro (se necessário no futuro) */
        @media (prefers-color-scheme: dark) {
          .tarefas-diarias-page {
            --glass-bg: rgba(30, 41, 59, 0.8);
            --glass-border: rgba(148, 163, 184, 0.2);
          }
        }
      `}</style>
    </div>
  );
}

export default TarefasDiarias;