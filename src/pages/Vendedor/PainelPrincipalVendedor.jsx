import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import { 
  DollarSign, Target, BarChart3, TrendingUp, Plus, Users, Phone, Mail, 
  Calendar, Clock, Award, CheckCircle, Star, Zap, 
  ArrowUpRight, Filter, Download, Eye, MoreVertical,
  Lightbulb, TrendingDown, RefreshCw, MessageSquare, Send,
  Edit, Trash2, AlertCircle, XCircle, PlayCircle, Pause,
  FileText, Building, User, Activity, Bell, Settings,
  Timer, Flag, BookOpen, Headphones, ChevronRight,
  Search, X, Save, Copy, Share2, Maximize2, Minimize2,
  Gift
} from 'lucide-react';

const PainelPrincipalVendedor = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [activeMetricCard, setActiveMetricCard] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showNewOpportunityModal, setShowNewOpportunityModal] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [quickActionType, setQuickActionType] = useState('');
  const [showTaskDetails, setShowTaskDetails] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState(null);
  
  // Estados para dados das outras páginas
  const [clientes, setClientes] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [metasSemana, setMetasSemana] = useState([]);
  const [showMetaProgressModal, setShowMetaProgressModal] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [progressInput, setProgressInput] = useState({
    vendasRealizadas: 0,
    valorVendas: 0,
    clientesRecuperados: 0,
    novosClientes: 0
  });
  
  // Estados para formulários
  const [newOpportunity, setNewOpportunity] = useState({
    titulo: '',
    cliente: '',
    valor: '',
    probabilidade: 50,
    estagio: 'Qualificação',
    dataFechamento: '',
    observacoes: ''
  });
  
  const [quickAction, setQuickAction] = useState({
    tipo: '',
    destinatario: '',
    assunto: '',
    mensagem: '',
    data: '',
    hora: ''
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    
    // Carregar dados das outras páginas
    loadDashboardData();
    
    // Listener para mudanças no localStorage (campanhas e metas)
    const handleStorageChange = (e) => {
      if (e.key === 'campanhas-admin') {
        const allCampanhas = JSON.parse(e.newValue || '[]');
        const campanhasAtivas = allCampanhas.filter(c => c.status === 'ativa');
        setCampanhas(campanhasAtivas);
      }
      if (e.key === 'metas-semana-admin') {
        const allMetasSemana = JSON.parse(e.newValue || '[]');
        const metasAtivas = allMetasSemana.filter(m => m.status === 'ativa');
        setMetasSemana(metasAtivas);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Event listener para fechar modais ao clicar fora
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('[data-notification-panel]')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    // Atalhos de teclado
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'n':
            event.preventDefault();
            handleNewOpportunity();
            break;
          case 'r':
            event.preventDefault();
            handleRefreshData();
            break;
          case 'k':
            event.preventDefault();
            setShowNotifications(!showNotifications);
            break;
          default:
            break;
        }
      }
      
      // ESC para fechar modais
      if (event.key === 'Escape') {
        setShowNewOpportunityModal(false);
        setShowQuickActionModal(false);
        setShowTaskDetails(null);
        setShowClientDetails(null);
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotifications]);

  // Função para carregar dados das outras páginas
  const loadDashboardData = () => {
    // Carregar vendas mensais
    const savedVendasMensais = localStorage.getItem('vendas-mensais-vendedor');
    const vendasMensais = savedVendasMensais ? JSON.parse(savedVendasMensais) : {
      valorVendas: 0,
      valorFaturado: 0,
      comissao: 0,
      vendas: [],
      faturamentos: []
    };
    
    // Carregar histórico de vendas mensais
    const savedHistoricoVendas = localStorage.getItem('historico-vendas-mensais-vendedor');
    const historicoVendas = savedHistoricoVendas ? JSON.parse(savedHistoricoVendas) : [];
    
    // Carregar atividades recentes (somente reais)
    const savedAtividades = localStorage.getItem('atividades-vendedor');
    setAtividades(savedAtividades ? JSON.parse(savedAtividades) : []);
    // Carregar campanhas ativas
    const savedCampanhas = localStorage.getItem('campanhas-admin');
    if (savedCampanhas) {
      const allCampanhas = JSON.parse(savedCampanhas);
      const campanhasAtivas = allCampanhas.filter(c => c.status === 'ativa');
      setCampanhas(campanhasAtivas);
    } else {
      setCampanhas([]);
    }
    // Carregar metas da semana ativas
    const savedMetasSemana = localStorage.getItem('metas-semana-admin');
    if (savedMetasSemana) {
      const allMetasSemana = JSON.parse(savedMetasSemana);
      const metasAtivas = allMetasSemana.filter(m => m.status === 'ativa');
      setMetasSemana(metasAtivas);
    } else {
      setMetasSemana([]);
    }
    // Carregar notificações reais (se houver), senão vazio
    setNotifications([]);
  };

  // Função para calcular métricas em tempo real
  const calcularMetricas = () => {
    // Carregar dados das vendas mensais
    const savedVendasMensais = localStorage.getItem('vendas-mensais-vendedor');
    const vendasMensais = savedVendasMensais ? JSON.parse(savedVendasMensais) : {
      valorVendas: 0,
      valorFaturado: 0,
      vendas: [],
      faturamentos: []
    };
    
    const totalVendas = vendasMensais.valorVendas || 0;
    const totalFaturado = vendasMensais.valorFaturado || 0;
    
    const negociosAtivos = negocios.filter(n => n.estagio !== 'Fechamento').length;
    
    const taxaConversao = negocios.length > 0 
      ? Math.round((negocios.filter(n => n.estagio === 'Fechamento').length / negocios.length) * 100)
      : 0;
    
    const ticketMedio = vendasMensais.vendas.length > 0 
      ? Math.round(totalVendas / vendasMensais.vendas.length)
      : 0;
    
    return {
      totalVendas,
      totalFaturado,
      negociosAtivos,
      taxaConversao,
      ticketMedio
    };
  };

  const metricas = calcularMetricas();

  // Dados mockados atualizados com métricas reais
  const metricsData = [
    { 
      id: 1, 
      label: 'Vendas do Mês', 
      value: `R$ ${metricas.totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      previousValue: `R$ ${(metricas.totalVendas * 0.8).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: '+23%', 
      trendValue: 23,
      icon: DollarSign, 
      iconColor: 'text-green-500',
      bgGradient: 'from-green-400/20 to-green-600/20',
      shadowColor: 'shadow-green-500/25'
    },
    { 
      id: 2, 
      label: 'Valor Faturado Mês', 
      value: `R$ ${metricas.totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      previousValue: `R$ ${(metricas.totalFaturado * 0.85).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: `Valor total faturado no mês atual`, 
      trend: '+15%',
      trendValue: 15,
      icon: DollarSign, 
      iconColor: 'text-blue-500',
      bgGradient: 'from-blue-400/20 to-blue-600/20',
      shadowColor: 'shadow-blue-500/25'
    },
    { 
      id: 3, 
      label: 'Comissão Mês', 
      value: `R$ ${(metricas.totalFaturado * 0.02).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      previousValue: `R$ ${(metricas.totalFaturado * 0.85 * 0.02).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: `2% sobre o valor faturado (R$ ${metricas.totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`, 
      trend: '+15%',
      trendValue: 15,
      icon: Award, 
      iconColor: 'text-emerald-500',
      bgGradient: 'from-emerald-400/20 to-emerald-600/20',
      shadowColor: 'shadow-emerald-500/25'
    },
    { 
      id: 4, 
      label: 'Taxa de Conversão', 
      value: `${metricas.taxaConversao}%`, 
      previousValue: `${metricas.taxaConversao - 5}%`,
      progress: metricas.taxaConversao, 
      meta: '70%', 
      trend: '+5%',
      trendValue: 5,
      icon: BarChart3, 
      iconColor: 'text-purple-500',
      bgGradient: 'from-purple-400/20 to-purple-600/20',
      shadowColor: 'shadow-purple-500/25'
    },
    { 
      id: 5, 
      label: 'Ticket Médio', 
      value: `R$ ${(metricas.ticketMedio / 1000).toFixed(0)}k`, 
      previousValue: `R$ ${((metricas.ticketMedio * 0.92) / 1000).toFixed(0)}k`,
      trend: '+8%', 
      trendValue: 8,
      icon: Award, 
      iconColor: 'text-orange-500',
      bgGradient: 'from-orange-400/20 to-orange-600/20',
      shadowColor: 'shadow-orange-500/25'
    },
  ];

  // Dados de vendas baseados no histórico real
  const salesData = (() => {
    const savedHistoricoVendas = localStorage.getItem('historico-vendas-mensais-vendedor');
    const historicoVendas = savedHistoricoVendas ? JSON.parse(savedHistoricoVendas) : [];
    
    // Pegar os últimos 6 meses do histórico
    const ultimosMeses = historicoVendas.slice(0, 6).reverse();
    
    // Se não há histórico suficiente, usar dados mockados
    if (ultimosMeses.length < 6) {
      // Completar com dados mockados
      const mesesMockados = [
        { month: 'Jan', vendas: 320, meta: 350, fechados: 40 },
        { month: 'Fev', vendas: 340, meta: 360, fechados: 45 },
        { month: 'Mar', vendas: 380, meta: 400, fechados: 52 },
        { month: 'Abr', vendas: 420, meta: 450, fechados: 58 },
        { month: 'Mai', vendas: 480, meta: 500, fechados: 65 },
        { month: 'Jun', vendas: 485, meta: 480, fechados: 70 },
      ];
      
      // Adicionar dados reais se existirem
      ultimosMeses.forEach((historico, index) => {
        if (index < mesesMockados.length) {
          mesesMockados[mesesMockados.length - 1 - index] = {
            month: historico.mes.substring(0, 3),
            vendas: historico.valorVendas,
            meta: historico.valorVendas * 1.1,
            fechados: historico.valorFaturado
          };
        }
      });
      
      return mesesMockados;
    }
    
    // Usar apenas dados reais
    return ultimosMeses.map(historico => ({
      month: historico.mes.substring(0, 3),
      vendas: historico.valorVendas,
      meta: historico.valorVendas * 1.1,
      fechados: historico.valorFaturado
    }));
  })();

  // Dados de pipeline baseados nos negócios reais
  const pipelineData = [
    { 
      name: 'Qualificação', 
      value: Math.round((negocios.filter(n => n.estagio === 'Qualificação').length / negocios.length) * 100) || 25, 
      count: negocios.filter(n => n.estagio === 'Qualificação').length, 
      color: '#8B5CF6' 
    },
    { 
      name: 'Proposta', 
      value: Math.round((negocios.filter(n => n.estagio === 'Proposta').length / negocios.length) * 100) || 30, 
      count: negocios.filter(n => n.estagio === 'Proposta').length, 
      color: '#3B82F6' 
    },
    { 
      name: 'Negociação', 
      value: Math.round((negocios.filter(n => n.estagio === 'Negociação').length / negocios.length) * 100) || 20, 
      count: negocios.filter(n => n.estagio === 'Negociação').length, 
      color: '#10B981' 
    },
    { 
      name: 'Fechamento', 
      value: Math.round((negocios.filter(n => n.estagio === 'Fechamento').length / negocios.length) * 100) || 15, 
      count: negocios.filter(n => n.estagio === 'Fechamento').length, 
      color: '#F59E0B' 
    },
    { 
      name: 'Perdidos', 
      value: Math.round((negocios.filter(n => n.estagio === 'Perdido').length / negocios.length) * 100) || 10, 
      count: negocios.filter(n => n.estagio === 'Perdido').length, 
      color: '#EF4444' 
    },
  ];

  // Performance baseada nas metas da semana definidas pelo admin
  const calcularPerformanceSemanal = () => {
    // Se há metas da semana definidas pelo admin, usar essas metas
    if (metasSemana.length > 0) {
      const metaAtual = metasSemana[0]; // Usar a primeira meta ativa
      
      return [
        { 
          metric: 'Vendas Realizadas', 
          atual: metaAtual.vendasRealizadas, 
          meta: metaAtual.metaVendasRealizadas, 
          percentual: metaAtual.metaVendasRealizadas > 0 ? 
            Math.round((metaAtual.vendasRealizadas / metaAtual.metaVendasRealizadas) * 100) : 0
        },
        { 
          metric: 'Valor de Vendas', 
          atual: `R$ ${metaAtual.valorVendas.toLocaleString()}`, 
          meta: `R$ ${metaAtual.metaValorVendas.toLocaleString()}`, 
          percentual: metaAtual.metaValorVendas > 0 ? 
            Math.round((metaAtual.valorVendas / metaAtual.metaValorVendas) * 100) : 0
        },
        { 
          metric: 'Clientes Recuperados', 
          atual: metaAtual.clientesRecuperados, 
          meta: metaAtual.metaClientesRecuperados, 
          percentual: metaAtual.metaClientesRecuperados > 0 ? 
            Math.round((metaAtual.clientesRecuperados / metaAtual.metaClientesRecuperados) * 100) : 0
        },
        { 
          metric: 'Novos Clientes', 
          atual: metaAtual.novosClientes, 
          meta: metaAtual.metaNovosClientes, 
          percentual: metaAtual.metaNovosClientes > 0 ? 
            Math.round((metaAtual.novosClientes / metaAtual.metaNovosClientes) * 100) : 0
        }
      ];
    }
    
    // Fallback para performance baseada em tarefas (se não houver metas definidas)
    const hoje = new Date();
    const inicioSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
    
    const tarefasConcluidasSemana = tarefas.filter(t => {
      const dataTarefa = new Date(t.prazo);
      return t.status === 'Concluída' && dataTarefa >= inicioSemana;
    });
    
    const metaSemanal = {
      ligacoes: 25,
      emails: 40,
      reunioes: 8,
      propostas: 5,
      followUps: 15
    };
    
    const realizadoSemana = {
      ligacoes: tarefasConcluidasSemana.filter(t => t.tipo === 'Ligação').length,
      emails: tarefasConcluidasSemana.filter(t => t.tipo === 'E-mail').length,
      reunioes: tarefasConcluidasSemana.filter(t => t.tipo === 'Reunião').length,
      propostas: tarefasConcluidasSemana.filter(t => t.tipo === 'Proposta').length,
      followUps: tarefasConcluidasSemana.filter(t => t.tipo === 'Follow-up').length
    };
    
    return [
      { 
        metric: 'Ligações Esta Semana', 
        atual: realizadoSemana.ligacoes, 
        meta: metaSemanal.ligacoes, 
        percentual: Math.round((realizadoSemana.ligacoes / metaSemanal.ligacoes) * 100)
      },
      { 
        metric: 'E-mails Esta Semana', 
        atual: realizadoSemana.emails, 
        meta: metaSemanal.emails, 
        percentual: Math.round((realizadoSemana.emails / metaSemanal.emails) * 100)
      },
      { 
        metric: 'Reuniões Esta Semana', 
        atual: realizadoSemana.reunioes, 
        meta: metaSemanal.reunioes, 
        percentual: Math.round((realizadoSemana.reunioes / metaSemanal.reunioes) * 100)
      },
      { 
        metric: 'Propostas Esta Semana', 
        atual: realizadoSemana.propostas, 
        meta: metaSemanal.propostas, 
        percentual: Math.round((realizadoSemana.propostas / metaSemanal.propostas) * 100)
      },
      { 
        metric: 'Follow-ups Esta Semana', 
        atual: realizadoSemana.followUps, 
        meta: metaSemanal.followUps, 
        percentual: Math.round((realizadoSemana.followUps / metaSemanal.followUps) * 100)
      }
    ];
  };
  
  const performanceData = calcularPerformanceSemanal();

  const recentActivities = atividades;

  const topClients = clientes
    .sort((a, b) => (b.valorTotal || 0) - (a.valorTotal || 0))
    .slice(0, 3)
    .map(cliente => ({
      name: cliente.nome || cliente.empresa,
      value: `R$ ${((cliente.valorTotal || 0) / 1000).toFixed(1)}k`,
      deals: cliente.pedidosFechados || 0,
      status: cliente.classificacao || 'Ativo',
      growth: `+${Math.round((cliente.saudeCliente || 70) * 0.3)}%`,
      avatar: cliente.avatar || (cliente.nome ? cliente.nome.substring(0, 2).toUpperCase() : 'CL')
    }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Negociação': return 'bg-orange-100 text-orange-800';
      case 'Proposta': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const weeklyGoals = [
    { 
      goal: 'Ligações de Prospecção', 
      current: tarefas.filter(t => t.tipo === 'Ligação' && t.status === 'Concluída').length * 12, 
      target: 80, 
      unit: 'calls' 
    },
    { 
      goal: 'Demonstrações Agendadas', 
      current: tarefas.filter(t => t.tipo === 'Visita' && t.status !== 'Pendente').length + 3, 
      target: 10, 
      unit: 'demos' 
    },
    { 
      goal: 'Propostas Enviadas', 
      current: negocios.filter(n => n.estagio === 'Proposta' || n.estagio === 'Negociação').length, 
      target: 8, 
      unit: 'propostas' 
    },
    { 
      goal: 'Receita Gerada', 
      current: negocios.filter(n => n.estagio === 'Fechamento').reduce((total, n) => total + n.valor, 0), 
      target: 600000, 
      unit: 'R$' 
    },
  ];

  // Funções para manipulação de dados
  const handleRefreshData = async () => {
    setRefreshing(true);
    setTimeout(() => {
      loadDashboardData();
      setRefreshing(false);
    }, 1000);
  };

  // Função para abrir modal de atualização de progresso de meta
  const handleOpenMetaProgress = (meta) => {
    setSelectedMeta(meta);
    setProgressInput({
      vendasRealizadas: meta.vendasRealizadas,
      valorVendas: meta.valorVendas,
      clientesRecuperados: meta.clientesRecuperados,
      novosClientes: meta.novosClientes
    });
    setShowMetaProgressModal(true);
  };

  // Função para atualizar progresso da meta
  const handleUpdateMetaProgress = () => {
    if (!selectedMeta) return;
    
    // Calcular progresso baseado nas metas
    const progressoVendas = selectedMeta.metaVendasRealizadas > 0 ? 
      (progressInput.vendasRealizadas / selectedMeta.metaVendasRealizadas) * 100 : 0;
    const progressoValor = selectedMeta.metaValorVendas > 0 ? 
      (progressInput.valorVendas / selectedMeta.metaValorVendas) * 100 : 0;
    const progressoRecuperados = selectedMeta.metaClientesRecuperados > 0 ? 
      (progressInput.clientesRecuperados / selectedMeta.metaClientesRecuperados) * 100 : 0;
    const progressoNovos = selectedMeta.metaNovosClientes > 0 ? 
      (progressInput.novosClientes / selectedMeta.metaNovosClientes) * 100 : 0;
    
    const progressoMedio = (progressoVendas + progressoValor + progressoRecuperados + progressoNovos) / 4;
    
    const metaAtualizada = {
      ...selectedMeta,
      vendasRealizadas: progressInput.vendasRealizadas,
      valorVendas: progressInput.valorVendas,
      clientesRecuperados: progressInput.clientesRecuperados,
      novosClientes: progressInput.novosClientes,
      progresso: Math.round(progressoMedio),
      updatedAt: new Date().toISOString()
    };
    
    // Atualizar no localStorage
    const savedMetasSemana = JSON.parse(localStorage.getItem('metas-semana-admin') || '[]');
    const metaIndex = savedMetasSemana.findIndex(m => m.id === selectedMeta.id);
    if (metaIndex !== -1) {
      savedMetasSemana[metaIndex] = metaAtualizada;
      localStorage.setItem('metas-semana-admin', JSON.stringify(savedMetasSemana));
      
      // Atualizar estado local
      const metasAtivas = savedMetasSemana.filter(m => m.status === 'ativa');
      setMetasSemana(metasAtivas);
    }
    
    setShowMetaProgressModal(false);
    setSelectedMeta(null);
    alert('Progresso da meta atualizado com sucesso!');
  };

  const handleNewOpportunity = () => {
    setShowNewOpportunityModal(true);
  };

  const handleSaveOpportunity = () => {
    // Validações
    if (!newOpportunity.titulo.trim()) {
      alert('Por favor, insira um título para a oportunidade');
      return;
    }
    if (!newOpportunity.cliente) {
      alert('Por favor, selecione um cliente');
      return;
    }
    if (!newOpportunity.valor || parseFloat(newOpportunity.valor) <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }
    if (!newOpportunity.dataFechamento) {
      alert('Por favor, selecione uma data de fechamento');
      return;
    }
    
    const novoNegocio = {
      id: negocios.length + 1,
      ...newOpportunity,
      valor: parseFloat(newOpportunity.valor),
      dataCriacao: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
      responsavel: 'Usuário Atual',
      prioridade: 'Média'
    };
    
    const updatedNegocios = [...negocios, novoNegocio];
    setNegocios(updatedNegocios);
    localStorage.setItem('negocios', JSON.stringify(updatedNegocios));
    
    // Adicionar atividade
    const novaAtividade = {
      id: atividades.length + 1,
      titulo: `Nova oportunidade criada: ${newOpportunity.titulo}`,
      time: 'Agora',
      icon: Target,
      color: 'bg-blue-100 text-blue-600'
    };
    
    const updatedAtividades = [novaAtividade, ...atividades];
    setAtividades(updatedAtividades);
    localStorage.setItem('atividades-vendedor', JSON.stringify(updatedAtividades));
    
    setNewOpportunity({
      titulo: '',
      cliente: '',
      valor: '',
      probabilidade: 50,
      estagio: 'Qualificação',
      dataFechamento: '',
      observacoes: ''
    });
    setShowNewOpportunityModal(false);
  };

  const handleSaveQuickAction = () => {
    // Validações
    if (!quickAction.destinatario) {
      alert('Por favor, selecione um destinatário');
      return;
    }
    if (!quickAction.assunto.trim()) {
      alert('Por favor, insira um assunto');
      return;
    }
    if (!quickAction.mensagem.trim()) {
      alert('Por favor, insira uma mensagem');
      return;
    }
    
    const novaAtividade = {
      id: atividades.length + 1,
      titulo: `${quickAction.tipo === 'email' ? 'E-mail enviado' : 
                quickAction.tipo === 'whatsapp' ? 'WhatsApp enviado' : 
                quickAction.tipo === 'proposta' ? 'Proposta enviada' : 'Ação realizada'} - ${quickAction.destinatario}`,
      time: 'Agora',
      icon: quickAction.tipo === 'email' ? Mail : 
            quickAction.tipo === 'whatsapp' ? MessageSquare : 
            quickAction.tipo === 'proposta' ? FileText : User,
      color: quickAction.tipo === 'email' ? 'bg-blue-100 text-blue-600' : 
             quickAction.tipo === 'whatsapp' ? 'bg-green-100 text-green-600' : 
             quickAction.tipo === 'proposta' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
    };
    
    const updatedAtividades = [novaAtividade, ...atividades];
    setAtividades(updatedAtividades);
    localStorage.setItem('atividades-vendedor', JSON.stringify(updatedAtividades));
    
    setQuickAction({
      tipo: '',
      destinatario: '',
      assunto: '',
      mensagem: '',
      data: '',
      hora: ''
    });
    setShowQuickActionModal(false);
  };

  const handleQuickAction = (type) => {
    setQuickActionType(type);
    setQuickAction({
      tipo: type,
      destinatario: '',
      assunto: '',
      mensagem: '',
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
    setShowQuickActionModal(true);
  };

  const handleMarkNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  };

  const handleViewAllActivities = () => {
    // Navegar para página de atividades
    window.location.href = '/vendedor/atividades';
  };

  const handleViewAllClients = () => {
    // Navegar para página de clientes
    window.location.href = '/vendedor/clientes';
  };

  const handleViewAllDeals = () => {
    // Navegar para página de gestão de negócios
    window.location.href = '/vendedor/negocios';
  };

  const handleViewAllTasks = () => {
    // Navegar para página de tarefas
    window.location.href = '/vendedor/tarefas';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header Principal */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1e293b, #475569)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              Painel do Vendedor
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Dashboard completo de vendas e performance
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
              <Clock size={16} />
              <span>Última atualização: {currentDateTime}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <span style={{ color: '#065f46', fontWeight: '600', fontSize: '0.9rem' }}>Sistema Online</span>
            </div>
            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                data-notification-panel
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <Bell size={20} style={{ color: '#374151' }} />
                {notifications.filter(n => !n.lida).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600'
                  }}>
                    {notifications.filter(n => !n.lida).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div 
                  data-notification-panel
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    padding: '1rem',
                    minWidth: '320px',
                    zIndex: 50
                  }}
                >
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700' }}>Notificações</h4>
                  {notifications.map((notif) => (
                    <div key={notif.id} style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      background: notif.lida ? 'rgba(248, 250, 252, 0.5)' : 'rgba(59, 130, 246, 0.1)',
                      border: `1px solid ${notif.lida ? 'rgba(226, 232, 240, 0.5)' : 'rgba(59, 130, 246, 0.2)'}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleMarkNotificationAsRead(notif.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: '600' }}>
                            {notif.titulo}
                          </p>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                            {notif.descricao}
                          </p>
                          <p style={{ margin: '0', fontSize: '0.75rem', color: '#94a3b8' }}>
                            {notif.time}
                          </p>
                        </div>
                        {!notif.lida && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            background: '#3b82f6',
                            borderRadius: '50%',
                            marginLeft: '0.5rem'
                          }}></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={handleRefreshData}
              disabled={refreshing}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '0.5rem',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                opacity: refreshing ? 0.7 : 1
              }}
            >
              <RefreshCw size={20} style={{ 
                color: '#374151',
                transform: refreshing ? 'rotate(360deg)' : 'none',
                transition: 'transform 1s ease'
              }} />
            </button>
            
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>

            <button 
              onClick={handleNewOpportunity}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Plus size={16} />
              Nova Oportunidade
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {metricsData.map((metric) => (
          <div
            key={metric.id}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              setActiveMetricCard(metric.id);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              setActiveMetricCard(null);
            }}
            onClick={() => {
              if (metric.id === 1) handleViewAllDeals();
              else if (metric.id === 2) handleViewAllDeals();
              else if (metric.id === 3) handleViewAllTasks();
              else if (metric.id === 4) handleViewAllClients();
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${metric.bgGradient.split(' ')[1]} 0%, ${metric.bgGradient.split(' ')[3]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <metric.icon className={metric.iconColor} size={24} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '8px',
                background: metric.trendValue > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: metric.trendValue > 0 ? '#10b981' : '#ef4444',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {metric.trendValue > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{metric.trend}</span>
              </div>
            </div>

            <div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                {metric.label}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                {metric.value}
              </p>
              
              {activeMetricCard === metric.id && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  Clique para ver detalhes
                </div>
              )}
              
              {metric.description && (
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {metric.description}
                </p>
              )}

              {metric.progress !== undefined && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    <span>Progresso</span>
                    <span>Meta: {metric.meta}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${metric.progress}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      borderRadius: '4px',
                      transition: 'width 1s ease'
                    }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Gráficos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Gráfico de Vendas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Performance de Vendas
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
                background: '#dbeafe',
                color: '#1e40af',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Vendas
              </button>
              <button style={{
                background: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Pipeline
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Bar dataKey="vendas" name="Vendas (R$ mil)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="meta" name="Meta (R$ mil)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline de Vendas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Pipeline de Vendas
            </h3>
            <Eye size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div style={{ marginTop: '1rem' }}>
            {pipelineData.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.color
                  }}></div>
                  <span style={{ color: '#64748b' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.count}</span>
                  <span style={{ color: '#64748b' }}>({item.value}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance e Atividades */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Performance Individual */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Performance Individual
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Filter size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
              <Download size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
            </div>
          </div>
          
          {performanceData.map((item, index) => (
            <div key={index} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>{item.metric}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>{item.atual}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ {item.meta}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    background: item.percentual >= 100 ? '#dcfce7' : item.percentual >= 80 ? '#fef3c7' : '#fee2e2',
                    color: item.percentual >= 100 ? '#166534' : item.percentual >= 80 ? '#92400e' : '#991b1b'
                  }}>
                    {item.percentual}%
                  </span>
                </div>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(item.percentual, 100)}%`,
                  height: '100%',
                  background: item.percentual >= 100 ? 'linear-gradient(135deg, #10b981, #059669)' : 
                             item.percentual >= 80 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                             'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '4px',
                  transition: 'width 1s ease'
                }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Campanhas Ativas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Campanhas Ativas
            </h3>
            <button 
              onClick={() => window.location.href = '/admin'}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Ver todas <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {campanhas.length > 0 ? campanhas.map((campanha) => (
              <div key={campanha.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                background: 'rgba(248, 250, 252, 0.5)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(248, 250, 252, 0.8)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(248, 250, 252, 0.5)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  background: campanha.tipo === 'Promoção' ? 'linear-gradient(135deg, #10b981, #059669)' :
                           campanha.tipo === 'Prospecção' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                           'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  minWidth: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {campanha.tipo === 'Promoção' ? <Gift size={20} /> :
                   campanha.tipo === 'Prospecção' ? <Target size={20} /> :
                   <RefreshCw size={20} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {campanha.titulo}
                    </h4>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      background: '#dcfce7',
                      color: '#166534',
                      whiteSpace: 'nowrap'
                    }}>
                      {campanha.tipo}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    margin: '0 0 0.75rem 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {campanha.descricao}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={14} style={{ color: '#64748b' }} />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {campanha.vendedoresParticipantes} participantes
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Target size={14} style={{ color: '#64748b' }} />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {campanha.progresso}/{campanha.meta}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      flex: 1,
                      height: '6px',
                      background: '#e2e8f0',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${campanha.meta > 0 ? Math.min((campanha.progresso / campanha.meta) * 100, 100) : 0}%`,
                        height: '100%',
                        background: campanha.tipo === 'Promoção' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                 campanha.tipo === 'Prospecção' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                                 'linear-gradient(135deg, #f59e0b, #d97706)',
                        borderRadius: '3px',
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#64748b',
                      minWidth: '35px'
                    }}>
                      {campanha.meta > 0 ? Math.round((campanha.progresso / campanha.meta) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem',
                color: '#64748b',
                textAlign: 'center'
              }}>
                <Target size={48} style={{ marginBottom: '1rem', color: '#cbd5e1' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#475569' }}>
                  Nenhuma campanha ativa
                </h4>
                <p style={{ fontSize: '0.9rem', margin: '0 0 1.5rem 0', color: '#64748b' }}>
                  Quando o administrador criar campanhas, elas aparecerão aqui.
                </p>
                <button 
                  onClick={() => window.location.href = '/admin'}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                  }}
                >
                  <Settings size={16} />
                  Ir para Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Tarefas Pendentes */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
              Tarefas Pendentes
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              {tarefas.filter(t => t.status === 'Pendente').length} tarefas aguardando sua ação
            </p>
          </div>
          <button 
            onClick={handleViewAllTasks}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Ver Todas <ArrowUpRight size={16} />
          </button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {tarefas.filter(t => t.status === 'Pendente').slice(0, 3).map((tarefa, index) => (
            <div key={tarefa.id} style={{
              background: 'rgba(248, 250, 252, 0.8)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                  {tarefa.titulo}
                </h4>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  background: tarefa.prioridade === 'Alta' ? '#fee2e2' : tarefa.prioridade === 'Média' ? '#fef3c7' : '#e0f2fe',
                  color: tarefa.prioridade === 'Alta' ? '#991b1b' : tarefa.prioridade === 'Média' ? '#92400e' : '#0c4a6e'
                }}>
                  {tarefa.prioridade}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Clock size={14} style={{ color: '#64748b' }} />
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Prazo: {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '8px',
                  background: tarefa.tipo === 'Ligação' ? '#dbeafe' : tarefa.tipo === 'E-mail' ? '#dcfce7' : '#f3e8ff',
                  color: tarefa.tipo === 'Ligação' ? '#1e40af' : tarefa.tipo === 'E-mail' ? '#166534' : '#7c3aed',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {tarefa.tipo}
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#e2e8f0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${tarefa.progresso}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    borderRadius: '2px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', minWidth: '40px' }}>
                  {tarefa.progresso}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metas da Semana */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
              Metas da Semana
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              {metasSemana.length > 0 ? 'Acompanhe seu progresso semanal' : 'Nenhuma meta definida pelo admin'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {metasSemana.length > 0 && (
              <button 
                onClick={() => handleOpenMetaProgress(metasSemana[0])}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Atualizar Progresso
              </button>
            )}
            <button 
              onClick={() => setShowHistoricoSemanal(true)}
              style={{
                background: '#dbeafe',
                color: '#1e40af',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Esta Semana
            </button>
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {metasSemana.length > 0 ? metasSemana.map((meta) => {
            const metas = [
              { 
                nome: 'Vendas Realizadas', 
                atual: meta.vendasRealizadas, 
                meta: meta.metaVendasRealizadas, 
                unit: 'vendas' 
              },
              { 
                nome: 'Valor de Vendas', 
                atual: meta.valorVendas, 
                meta: meta.metaValorVendas, 
                unit: 'R$' 
              },
              { 
                nome: 'Clientes Recuperados', 
                atual: meta.clientesRecuperados, 
                meta: meta.metaClientesRecuperados, 
                unit: 'clientes' 
              },
              { 
                nome: 'Novos Clientes', 
                atual: meta.novosClientes, 
                meta: meta.metaNovosClientes, 
                unit: 'clientes' 
              }
            ];
            
            return metas.map((goal, index) => {
              const percentage = goal.meta > 0 ? (goal.atual / goal.meta) * 100 : 0;
              const isComplete = percentage >= 100;
              
              return (
                <div key={index} style={{
                  background: 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {goal.nome}
                    </h4>
                    {isComplete && <CheckCircle size={20} style={{ color: '#10b981' }} />}
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>
                        {goal.unit === 'R$' ? `R$ ${(goal.atual / 1000).toFixed(0)}k` : goal.atual}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        / {goal.unit === 'R$' ? `R$ ${(goal.meta / 1000).toFixed(0)}k` : goal.meta}
                      </span>
                    </div>
                    
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        width: `${Math.min(percentage, 100)}%`,
                        height: '100%',
                        background: isComplete ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        borderRadius: '4px',
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: isComplete ? '#10b981' : '#3b82f6'
                      }}>
                        {percentage.toFixed(0)}% completo
                      </span>
                      {percentage >= 100 && (
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
                          ✓ Meta atingida!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            });
          }) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              color: '#64748b'
            }}>
              <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Nenhuma meta definida
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                O administrador ainda não definiu metas para esta semana
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Seção de Insights e Ações Rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Insights */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2))'
            }}>
              <Lightbulb size={24} style={{ color: '#f59e0b' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Insights
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setExpandedInsight(expandedInsight === 1 ? null : 1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <TrendingUp size={20} style={{ color: '#3b82f6', marginTop: '0.125rem' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e40af', margin: '0 0 0.25rem 0' }}>
                    Oportunidade de Crescimento
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#1e40af', margin: 0, lineHeight: '1.4' }}>
                    {negocios.filter(n => n.estagio === 'Negociação').length} negócios em negociação com potencial de R$ {(negocios.filter(n => n.estagio === 'Negociação').reduce((acc, n) => acc + n.valor, 0) / 1000).toFixed(0)}k
                  </p>
                  {expandedInsight === 1 && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      padding: '0.75rem', 
                      background: 'rgba(255, 255, 255, 0.7)', 
                      borderRadius: '8px' 
                    }}>
                      <p style={{ fontSize: '0.8rem', color: '#374151', margin: 0 }}>
                        Continue focando em leads qualificados. Suas negociações têm {
                          Math.round((negocios.filter(n => n.probabilidade >= 70).length / negocios.length) * 100)
                        }% de alta probabilidade de fechamento.
                      </p>
                    </div>
                  )}
                </div>
                <ChevronRight size={16} style={{ 
                  color: '#3b82f6', 
                  transform: expandedInsight === 1 ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} />
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setExpandedInsight(expandedInsight === 2 ? null : 2)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <AlertCircle size={20} style={{ color: '#8b5cf6', marginTop: '0.125rem' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#7c3aed', margin: '0 0 0.25rem 0' }}>
                    Ação Necessária
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#7c3aed', margin: 0, lineHeight: '1.4' }}>
                    {tarefas.filter(t => t.status === 'Pendente' && t.prioridade === 'Alta').length} tarefas urgentes precisam de follow-up hoje
                  </p>
                  {expandedInsight === 2 && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      padding: '0.75rem', 
                      background: 'rgba(255, 255, 255, 0.7)', 
                      borderRadius: '8px' 
                    }}>
                      <p style={{ fontSize: '0.8rem', color: '#374151', margin: 0 }}>
                        Priorize estas tarefas para manter o ritmo. Clientes com follow-up rápido têm 4x mais chances de fechamento.
                      </p>
                    </div>
                  )}
                </div>
                <ChevronRight size={16} style={{ 
                  color: '#8b5cf6', 
                  transform: expandedInsight === 2 ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} />
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setExpandedInsight(expandedInsight === 3 ? null : 3)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Award size={20} style={{ color: '#10b981', marginTop: '0.125rem' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#059669', margin: '0 0 0.25rem 0' }}>
                    Performance Excelente
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#059669', margin: 0, lineHeight: '1.4' }}>
                    {Math.round((tarefas.filter(t => t.status === 'Concluída').length / tarefas.length) * 100)}% de conclusão nas tarefas. Você está no top 10% dos vendedores!
                  </p>
                  {expandedInsight === 3 && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      padding: '0.75rem', 
                      background: 'rgba(255, 255, 255, 0.7)', 
                      borderRadius: '8px' 
                    }}>
                      <p style={{ fontSize: '0.8rem', color: '#374151', margin: 0 }}>
                        Excelente produtividade! Continue mantendo esse ritmo para superar suas metas mensais em até 15%.
                      </p>
                    </div>
                  )}
                </div>
                <ChevronRight size={16} style={{ 
                  color: '#10b981', 
                  transform: expandedInsight === 3 ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Clientes */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Top Clientes
            </h3>
            <button 
              onClick={handleViewAllClients}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Ver todos <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topClients.map((client, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(248, 250, 252, 0.8)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => setShowClientDetails(client)}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  {client.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {client.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
                      {client.growth}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {client.value}
                    </p>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }} className={getStatusColor(client.status)}>
                      {client.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {client.deals} negócios ativos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))'
            }}>
              <Zap size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Ações Rápidas
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: Mail, label: 'Enviar E-mail', color: 'linear-gradient(135deg, #3b82f6, #2563eb)', action: 'email' },
              { icon: FileText, label: 'Nova Proposta', color: 'linear-gradient(135deg, #10b981, #059669)', action: 'proposta' },
              { icon: Users, label: 'Gerenciar Clientes', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', action: 'clientes' },
              { icon: MessageSquare, label: 'Enviar WhatsApp', color: 'linear-gradient(135deg, #f59e0b, #d97706)', action: 'whatsapp' }
            ].map((action, index) => (
              <button key={index} 
                onClick={() => action.action === 'clientes' ? handleViewAllClients() : handleQuickAction(action.action)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: action.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <action.icon size={20} />
                <span style={{ flex: 1, textAlign: 'left' }}>{action.label}</span>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dicas de Atalhos */}
      <div style={{
        background: 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <span><strong>Ctrl+N</strong> Nova Oportunidade</span>
          <span><strong>Ctrl+R</strong> Atualizar</span>
          <span><strong>Ctrl+K</strong> Notificações</span>
          <span><strong>ESC</strong> Fechar Modal</span>
        </div>
      </div>

      {/* Modal Nova Oportunidade */}
      {showNewOpportunityModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Nova Oportunidade
              </h3>
              <button 
                onClick={() => setShowNewOpportunityModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} style={{ color: '#64748b' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Título da Oportunidade
                </label>
                <input
                  type="text"
                  value={newOpportunity.titulo}
                  onChange={(e) => setNewOpportunity({...newOpportunity, titulo: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                  placeholder="Ex: Implementação de sistema CRM"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Cliente
                </label>
                <select
                  value={newOpportunity.cliente}
                  onChange={(e) => setNewOpportunity({...newOpportunity, cliente: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.empresa}>{cliente.empresa}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={newOpportunity.valor}
                    onChange={(e) => setNewOpportunity({...newOpportunity, valor: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                    placeholder="0,00"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Probabilidade (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newOpportunity.probabilidade}
                    onChange={(e) => setNewOpportunity({...newOpportunity, probabilidade: parseInt(e.target.value)})}
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{newOpportunity.probabilidade}%</span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Estágio
                  </label>
                  <select
                    value={newOpportunity.estagio}
                    onChange={(e) => setNewOpportunity({...newOpportunity, estagio: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <option value="Qualificação">Qualificação</option>
                    <option value="Proposta">Proposta</option>
                    <option value="Negociação">Negociação</option>
                    <option value="Fechamento">Fechamento</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Data de Fechamento
                  </label>
                  <input
                    type="date"
                    value={newOpportunity.dataFechamento}
                    onChange={(e) => setNewOpportunity({...newOpportunity, dataFechamento: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Observações
                </label>
                <textarea
                  value={newOpportunity.observacoes}
                  onChange={(e) => setNewOpportunity({...newOpportunity, observacoes: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Observações sobre a oportunidade..."
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setShowNewOpportunityModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#374151',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveOpportunity}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Salvar Oportunidade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ações Rápidas */}
      {showQuickActionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                {quickActionType === 'email' ? 'Enviar E-mail' : 
                 quickActionType === 'whatsapp' ? 'Enviar WhatsApp' : 
                 quickActionType === 'proposta' ? 'Nova Proposta' : 'Ação Rápida'}
              </h3>
              <button 
                onClick={() => setShowQuickActionModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} style={{ color: '#64748b' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Destinatário
                </label>
                <select
                  value={quickAction.destinatario}
                  onChange={(e) => setQuickAction({...quickAction, destinatario: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.nome}>{cliente.nome} - {cliente.empresa}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Assunto
                </label>
                <input
                  type="text"
                  value={quickAction.assunto}
                  onChange={(e) => setQuickAction({...quickAction, assunto: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                  placeholder="Digite o assunto..."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Mensagem
                </label>
                <textarea
                  value={quickAction.mensagem}
                  onChange={(e) => setQuickAction({...quickAction, mensagem: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                  placeholder="Digite sua mensagem..."
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Data
                  </label>
                  <input
                    type="date"
                    value={quickAction.data}
                    onChange={(e) => setQuickAction({...quickAction, data: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Hora
                  </label>
                  <input
                    type="time"
                    value={quickAction.hora}
                    onChange={(e) => setQuickAction({...quickAction, hora: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setShowQuickActionModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#374151',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveQuickAction}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes da Atividade */}
      {showTaskDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Detalhes da Atividade
              </h3>
              <button 
                onClick={() => setShowTaskDetails(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} style={{ color: '#64748b' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '8px'
                }} className={showTaskDetails.color}>
                  <showTaskDetails.icon size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {showTaskDetails.titulo}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                    {showTaskDetails.time}
                  </p>
                </div>
              </div>
              
              <div style={{ padding: '1rem', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0 }}>
                  Esta atividade foi registrada automaticamente pelo sistema. Para mais detalhes, acesse a seção de atividades completa.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setShowTaskDetails(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#374151',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
              <button
                onClick={handleViewAllActivities}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Ver Todas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes do Cliente */}
      {showClientDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Detalhes do Cliente
              </h3>
              <button 
                onClick={() => setShowClientDetails(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} style={{ color: '#64748b' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.2rem'
                }}>
                  {showClientDetails.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {showClientDetails.name}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                    {showClientDetails.deals} negócios • {showClientDetails.value}
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(248, 250, 252, 0.8)',
                borderRadius: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                    {showClientDetails.deals}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Negócios</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                    {showClientDetails.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Valor Total</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                    {showClientDetails.growth}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Crescimento</div>
                </div>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(248, 250, 252, 0.8)',
                borderRadius: '8px',
                border: `1px solid ${showClientDetails.status === 'Ativo' ? '#10b981' : '#f59e0b'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>Status:</span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: showClientDetails.status === 'Ativo' ? '#dcfce7' : '#fef3c7',
                    color: showClientDetails.status === 'Ativo' ? '#166534' : '#92400e'
                  }}>
                    {showClientDetails.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setShowClientDetails(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#374151',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
              <button
                onClick={handleViewAllClients}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Ver Todos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Atualizar Progresso da Meta */}
      {showMetaProgressModal && selectedMeta && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Atualizar Progresso da Meta
              </h3>
              <button
                onClick={() => setShowMetaProgressModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                {selectedMeta.titulo}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                {selectedMeta.descricao}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Vendas Realizadas
                </label>
                <input
                  type="number"
                  value={progressInput.vendasRealizadas}
                  onChange={(e) => setProgressInput({...progressInput, vendasRealizadas: parseInt(e.target.value) || 0})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                  placeholder="0"
                  min="0"
                />
                <small style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  Meta: {selectedMeta.metaVendasRealizadas}
                </small>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Valor de Vendas (R$)
                </label>
                <input
                  type="number"
                  value={progressInput.valorVendas}
                  onChange={(e) => setProgressInput({...progressInput, valorVendas: parseFloat(e.target.value) || 0})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <small style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  Meta: R$ {selectedMeta.metaValorVendas.toLocaleString()}
                </small>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Clientes Recuperados
                </label>
                <input
                  type="number"
                  value={progressInput.clientesRecuperados}
                  onChange={(e) => setProgressInput({...progressInput, clientesRecuperados: parseInt(e.target.value) || 0})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                  placeholder="0"
                  min="0"
                />
                <small style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  Meta: {selectedMeta.metaClientesRecuperados}
                </small>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Novos Clientes
                </label>
                <input
                  type="number"
                  value={progressInput.novosClientes}
                  onChange={(e) => setProgressInput({...progressInput, novosClientes: parseInt(e.target.value) || 0})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                  placeholder="0"
                  min="0"
                />
                <small style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  Meta: {selectedMeta.metaNovosClientes}
                </small>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowMetaProgressModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#374151',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateMetaProgress}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Atualizar Progresso
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .bg-green-100 { background-color: #dcfce7; }
        .text-green-600 { color: #16a34a; }
        .bg-blue-100 { background-color: #dbeafe; }
        .text-blue-600 { color: #2563eb; }
        .bg-purple-100 { background-color: #f3e8ff; }
        .text-purple-600 { color: #9333ea; }
        .bg-orange-100 { background-color: #fed7aa; }
        .text-orange-800 { color: #9a3412; }
        .bg-green-100 { background-color: #dcfce7; }
        .text-green-800 { color: #166534; }
        
        /* Responsividade */
        @media (max-width: 1024px) {
          .grid-cols-3 { grid-template-columns: 1fr 1fr; }
          .grid-cols-2 { grid-template-columns: 1fr; }
        }
        
        @media (max-width: 768px) {
          .grid-cols-3,
          .grid-cols-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default PainelPrincipalVendedor;