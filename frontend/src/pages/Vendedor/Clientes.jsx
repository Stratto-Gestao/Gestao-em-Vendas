import React, { useState, useEffect } from 'react';
import { 
  Plus, Phone, Mail, Edit, User, Building, Target, Clock, Search, 
  Filter, MoreVertical, Star, Calendar, TrendingUp, Eye, Trash2,
  Download, Upload, RefreshCw, ArrowUpDown, ChevronDown, MessageSquare,
  DollarSign, Users, BarChart3, Award, CheckCircle, AlertCircle,
  MapPin, Briefcase, Globe, ChevronRight, Activity, FileText,
  Settings, Heart, Share2, Bookmark, Camera, Video, Headphones,
  Send, UserCheck, UserX, Zap, Shield, Layers, PieChart, X, PlayCircle,
  Save
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

const ClientesPage = () => {
  const { currentUser: user } = useAuth();
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');
  const [classificacaoFilter, setClassificacaoFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  
  // Suprimir erros do Firebase WebChannel
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('WebChannelConnection') || 
          message.includes('Missing or insufficient permissions') ||
          message.includes('Firebase') ||
          message.includes('firestore') ||
          message.includes('Firestore') ||
          message.includes('FirebaseError') ||
          message.includes('permissions') ||
          message.includes('carregar clientes')) {
        // Suprimir esses erros do Firebase
        return;
      }
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);
  
  // Estado para detalhes do cliente
  const [clientDetails, setClientDetails] = useState({
    pedidosTotal: 0,
    atividades: '',
    numerosPedidos: '',
    valorTotalPedidos: 0,
    anexos: []
  });
  
  // Estado para novo cliente
  const [newClient, setNewClient] = useState({
    nome: '',
    empresa: '',
    cargo: '',
    ativo: true,
    tipoCliente: 'lojista', // lojista ou consumidor_final
    classificacao: 'Ativo', // Ativo, Inativo, Novo, Recuperado
    email: '',
    telefone: '',
    endereco: '',
    website: '',
    linkedin: '',
    observacoes: '',
    segmento: '',
    valorTotal: 0,
    tempoCliente: '',
    pedidosFechados: 0,
    ultimoContato: '',
    saudeCliente: 0
  });
  
  // Dados dos clientes - carregados do Firebase
  const [clientes, setClientes] = useState([]);

  // Funções para Firebase
  const loadClients = async () => {
    // Primeiro, tentar carregar do localStorage como fallback
    const savedClientes = localStorage.getItem('clientes-vendedor');
    if (savedClientes) {
      try {
        const clientesData = JSON.parse(savedClientes);
        if (Array.isArray(clientesData) && clientesData.length > 0) {
          setClientes(clientesData);
          setIsOnlineMode(false);
        } else {
          // Se não há dados no localStorage, usar dados mock
          loadMockClientes();
        }
      } catch (error) {
        console.log('Erro ao carregar clientes do localStorage, usando dados mock');
        loadMockClientes();
      }
      return;
    }
    
    // Se não há dados no localStorage e não há usuário autenticado, usar dados mock
    if (!user?.uid) {
      console.log('Usuário não autenticado, carregando dados mock');
      loadMockClientes();
      return;
    }
    
    setLoading(true);
    try {
      const clientsRef = collection(db, 'clients');
      const q = query(
        clientsRef, 
        where('responsavelId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      
      const clientsData = [];
      querySnapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() });
      });
      
      // Ordenar localmente por data de criação
      clientsData.sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return bDate - aDate;
      });
      
      setClientes(clientsData);
      setIsOnlineMode(true);
      
      // Salvar no localStorage para uso offline
      localStorage.setItem('clientes-vendedor', JSON.stringify(clientsData));
    } catch (error) {
      // Suprimir erro do Firebase e usar dados mock
      console.log('Erro ao carregar clientes:', error);
      setIsOnlineMode(false);
      loadMockClientes();
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar dados mock
  const loadMockClientes = () => {
    const mockClientes = [
      {
        id: 1,
        nome: 'Carlos Silva',
        empresa: 'TechCorp Solutions',
        cargo: 'CEO',
        ativo: true,
        tipoCliente: 'lojista',
        classificacao: 'Ativo',
        email: 'carlos@techcorp.com',
        telefone: '(11) 99999-9999',
        endereco: 'São Paulo, SP',
        website: 'techcorp.com',
        linkedin: 'carlos-silva',
        observacoes: 'Cliente estratégico',
        segmento: 'Tecnologia',
        valorTotal: 185500,
        tempoCliente: '2.5',
        pedidosFechados: 3,
        ultimoContato: '2024-07-13',
        saudeCliente: 85,
        avatar: 'CS'
      },
      {
        id: 2,
        nome: 'Ana Costa',
        empresa: 'Digital Innovations',
        cargo: 'CTO',
        ativo: true,
        tipoCliente: 'lojista',
        classificacao: 'Ativo',
        email: 'ana@digitalinnovations.com',
        telefone: '(21) 88888-8888',
        endereco: 'Rio de Janeiro, RJ',
        website: 'digitalinnovations.com',
        linkedin: 'ana-costa',
        observacoes: 'Parceira de longo prazo',
        segmento: 'Digital',
        valorTotal: 172300,
        tempoCliente: '3.2',
        pedidosFechados: 2,
        ultimoContato: '2024-07-12',
        saudeCliente: 92,
        avatar: 'AC'
      },
      {
        id: 3,
        nome: 'João Santos',
        empresa: 'StartupFlow Inc',
        cargo: 'Founder',
        ativo: true,
        tipoCliente: 'lojista',
        classificacao: 'Novo',
        email: 'joao@startupflow.com',
        telefone: '(31) 77777-7777',
        endereco: 'Belo Horizonte, MG',
        website: 'startupflow.com',
        linkedin: 'joao-santos',
        observacoes: 'Cliente em crescimento',
        segmento: 'Startup',
        valorTotal: 165800,
        tempoCliente: '1.8',
        pedidosFechados: 4,
        ultimoContato: '2024-07-11',
        saudeCliente: 78,
        avatar: 'JS'
      },
      {
        id: 4,
        nome: 'Maria Oliveira',
        empresa: 'InnovaTech',
        cargo: 'Diretora',
        ativo: true,
        tipoCliente: 'lojista',
        classificacao: 'Ativo',
        email: 'maria@innovatech.com',
        telefone: '(11) 66666-6666',
        endereco: 'São Paulo, SP',
        website: 'innovatech.com',
        linkedin: 'maria-oliveira',
        observacoes: 'Projeto em andamento',
        segmento: 'Inovação',
        valorTotal: 198200,
        tempoCliente: '4.1',
        pedidosFechados: 5,
        ultimoContato: '2024-07-10',
        saudeCliente: 95,
        avatar: 'MO'
      },
      {
        id: 5,
        nome: 'Pedro Martins',
        empresa: 'Future Systems',
        cargo: 'VP Vendas',
        ativo: true,
        tipoCliente: 'lojista',
        classificacao: 'Recuperado',
        email: 'pedro@futuresystems.com',
        telefone: '(85) 55555-5555',
        endereco: 'Fortaleza, CE',
        website: 'futuresystems.com',
        linkedin: 'pedro-martins',
        observacoes: 'Recentemente reativado',
        segmento: 'Sistemas',
        valorTotal: 143800,
        tempoCliente: '2.0',
        pedidosFechados: 3,
        ultimoContato: '2024-07-09',
        saudeCliente: 88,
        avatar: 'PM'
      }
    ];
    
    setClientes(mockClientes);
    localStorage.setItem('clientes-vendedor', JSON.stringify(mockClientes));
  };

  const handleAddClient = async () => {
    if (!newClient.nome || !newClient.email) {
      setError('Nome e email são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Converter valorTotal para número
      const valorNumerico = parseFloat(newClient.valorTotal.toString().replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      
      const clientData = {
        ...newClient,
        id: Date.now(), // ID único para localStorage
        valorTotal: valorNumerico,
        responsavelId: user?.uid || 'local',
        status: newClient.classificacao || 'Ativo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatar: newClient.nome.split(' ').map(name => name[0]).join('').toUpperCase(),
        valorMensal: valorNumerico / (newClient.tempoCliente ? parseFloat(newClient.tempoCliente) * 12 : 1),
        ticketMedio: valorNumerico / (newClient.pedidosFechados || 1),
        pontuacaoSaude: newClient.saudeCliente || 0
      };

      // Tentar salvar no Firebase se usuário estiver autenticado
      if (user?.uid) {
        try {
          const docRef = await addDoc(collection(db, 'clients'), clientData);
          clientData.id = docRef.id;
        } catch (firebaseError) {
          console.error('Erro ao salvar no Firebase, salvando localmente:', firebaseError);
        }
      }
      
      // Atualizar estado local
      const novosClientes = [clientData, ...clientes];
      setClientes(novosClientes);
      
      // Salvar no localStorage
      localStorage.setItem('clientes-vendedor', JSON.stringify(novosClientes));
      
      // Resetar formulário
      setNewClient({
        nome: '',
        empresa: '',
        cargo: '',
        ativo: true,
        tipoCliente: 'lojista',
        classificacao: 'Ativo',
        email: '',
        telefone: '',
        endereco: '',
        website: '',
        linkedin: '',
        observacoes: '',
        segmento: '',
        valorTotal: 0,
        tempoCliente: '',
        pedidosFechados: 0,
        ultimoContato: '',
        saudeCliente: 0
      });
      
      setShowAddClientModal(false);
      setError('');
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      setError('Erro ao adicionar cliente');
    } finally {
      setLoading(false);
    }
  };

  // Carregar clientes quando o component montar
  useEffect(() => {
    loadClients();
    
    // Adicionar mensagem de debug amigável
    console.log('🔧 Página de Clientes carregada. Para limpar dados salvos, execute no console: localStorage.removeItem("clientes-vendedor"); location.reload();');
  }, [user]);

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    setLoading(true);
    try {
      // Tentar excluir do Firebase se usuário estiver autenticado
      if (user?.uid) {
        try {
          await deleteDoc(doc(db, 'clients', clientId));
        } catch (firebaseError) {
          console.error('Erro ao excluir do Firebase, excluindo localmente:', firebaseError);
        }
      }
      
      // Atualizar estado local
      const clientesAtualizados = clientes.filter(client => client.id !== clientId);
      setClientes(clientesAtualizados);
      
      // Atualizar localStorage
      localStorage.setItem('clientes-vendedor', JSON.stringify(clientesAtualizados));
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      setError('Erro ao excluir cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = async (clientId, updatedData) => {
    setLoading(true);
    try {
      // Converter valorTotal para número se estiver presente
      if (updatedData.valorTotal !== undefined) {
        updatedData.valorTotal = parseFloat(updatedData.valorTotal.toString().replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
        updatedData.valorMensal = updatedData.valorTotal / (updatedData.tempoCliente ? parseFloat(updatedData.tempoCliente) * 12 : 1);
        updatedData.ticketMedio = updatedData.valorTotal / (updatedData.pedidosFechados || 1);
      }
      
      updatedData.updatedAt = new Date().toISOString();
      
      // Tentar atualizar no Firebase se usuário estiver autenticado
      if (user?.uid) {
        try {
          const clientRef = doc(db, 'clients', clientId);
          await updateDoc(clientRef, {
            ...updatedData,
            updatedAt: serverTimestamp()
          });
        } catch (firebaseError) {
          console.error('Erro ao atualizar no Firebase, atualizando localmente:', firebaseError);
        }
      }
      
      // Atualizar estado local
      const clientesAtualizados = clientes.map(client => 
        client.id === clientId ? { ...client, ...updatedData } : client
      );
      setClientes(clientesAtualizados);
      
      // Atualizar localStorage
      localStorage.setItem('clientes-vendedor', JSON.stringify(clientesAtualizados));
      
      setShowEditModal(false);
      setEditingClient(null);
      setError('');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      setError('Erro ao atualizar cliente');
    } finally {
      setLoading(false);
    }
  };

  // Histórico de atividades mockado
  const atividadesCliente = [
    {
      id: 1,
      tipo: 'call',
      titulo: 'Ligação de Follow-up',
      descricao: 'Conversa sobre renovação de contrato e novos serviços',
      data: '2024-01-15 14:30',
      responsavel: 'Ana Costa',
      duracao: '45 min',
      resultado: 'Positivo'
    },
    {
      id: 2,
      tipo: 'email',
      titulo: 'Proposta Comercial Enviada',
      descricao: 'Enviada proposta para expansão dos serviços incluindo módulos adicionais',
      data: '2024-01-12 09:15',
      responsavel: 'Ana Costa',
      resultado: 'Pendente'
    },
    {
      id: 3,
      tipo: 'meeting',
      titulo: 'Reunião de Alinhamento',
      descricao: 'Apresentação de roadmap do produto e alinhamento de expectativas',
      data: '2024-01-10 15:00',
      responsavel: 'Ana Costa',
      duracao: '1h 20min',
      resultado: 'Positivo'
    },
    {
      id: 4,
      tipo: 'purchase',
      titulo: 'Compra Realizada',
      descricao: 'Renovação anual do plano premium com desconto de fidelidade',
      data: '2024-01-08 11:00',
      valor: 'R$ 85.000',
      resultado: 'Fechado'
    }
  ];

  // Estatísticas
  const stats = {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'Ativo').length,
    inativos: clientes.filter(c => c.status === 'Inativo').length,
    novos: clientes.filter(c => c.status === 'Novo').length,
    recuperados: clientes.filter(c => c.status === 'Recuperado').length,
    receita: clientes.reduce((acc, c) => acc + (c.valorTotal || 0), 0)
  };

  // Filtros e ordenação
  const clientesFiltrados = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || cliente.status === statusFilter;
    const matchesSegment = segmentFilter === '' || cliente.segmento === segmentFilter;
    const matchesClassificacao = classificacaoFilter === '' || cliente.status === classificacaoFilter;
    return matchesSearch && matchesStatus && matchesSegment && matchesClassificacao;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.nome.localeCompare(b.nome);
      case 'company': return a.empresa.localeCompare(b.empresa);
      case 'value': return (b.valorTotal || 0) - (a.valorTotal || 0);
      case 'lastContact': return new Date(b.ultimoContato || 0) - new Date(a.ultimoContato || 0);
      default: return 0;
    }
  });

  // Funções auxiliares
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Inativo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Novo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Recuperado': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ativo': return <CheckCircle size={14} />;
      case 'Inativo': return <UserX size={14} />;
      case 'Novo': return <Star size={14} />;
      case 'Recuperado': return <RefreshCw size={14} />;
      default: return <User size={14} />;
    }
  };

  const getSaudeColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatCurrency = (value) => {
    // Garantir que o valor seja um número
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', '.')) : parseFloat(value);
    
    if (isNaN(numValue)) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
      return 'N/A';
    }
  };

  const getInitials = (nome) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'call': return <Phone size={16} className="text-blue-600" />;
      case 'email': return <Mail size={16} className="text-green-600" />;
      case 'meeting': return <Video size={16} className="text-purple-600" />;
      case 'purchase': return <DollarSign size={16} className="text-emerald-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="clientes-page">
      {/* Header Principal */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Gestão de Clientes</h1>
            <p className="page-subtitle">Acompanhe e gerencie relacionamentos com seus clientes</p>
            <div className="header-stats">
              <div className="stat-chip">
                <Users size={16} />
                <span>{stats.total} clientes</span>
              </div>
              <div className="stat-chip">
                <DollarSign size={16} />
                <span>{formatCurrency(stats.receita)} em receita</span>
              </div>
              <div className={`stat-chip ${isOnlineMode ? 'online' : 'offline'}`}>
                <div className={`status-indicator ${isOnlineMode ? 'green' : 'yellow'}`}></div>
                <span>{isOnlineMode ? 'Online' : 'Modo Local'}</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn secondary">
              <Download size={16} />
              Exportar
            </button>
            <button className="action-btn secondary">
              <Upload size={16} />
              Importar
            </button>
            <button 
              className="action-btn primary"
              onClick={() => setShowAddClientModal(true)}
            >
              <Plus size={16} />
              Novo Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.ativos}</div>
            <div className="stat-label">Clientes Ativos</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +8% este mês
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon gray">
            <UserX size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.inativos}</div>
            <div className="stat-label">Clientes Inativos</div>
            <div className="stat-trend neutral">
              <UserX size={12} />
              {stats.inativos > 0 ? 'Requer atenção' : 'Sem inativos'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Star size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.novos}</div>
            <div className="stat-label">Clientes Novos</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +15% este mês
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <RefreshCw size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.recuperados}</div>
            <div className="stat-label">Clientes Recuperados</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              Excelente!
            </div>
          </div>
        </div>
      </div>

      {/* Controles e Filtros */}
      <div className="controls-section">
        <div className="search-filters">
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Buscar clientes, empresas ou e-mails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Novo">Novo</option>
            <option value="Recuperado">Recuperado</option>
          </select>

          <select
            value={classificacaoFilter}
            onChange={(e) => setClassificacaoFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Classificações</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Novo">Novo</option>
            <option value="Recuperado">Recuperado</option>
          </select>

          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Segmentos</option>
            <option value="Loja de Embalagens">Loja de Embalagens</option>
            <option value="Loja de Presentes">Loja de Presentes</option>
            <option value="Confeiteira">Confeiteira</option>
            <option value="Confeitaria">Confeitaria</option>
            <option value="Panificadora">Panificadora</option>
            <option value="Empresa de Salgados">Empresa de Salgados</option>
            <option value="Personalizado">Personalizado</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="company">Ordenar por Empresa</option>
            <option value="value">Ordenar por Valor</option>
            <option value="lastContact">Último Contato</option>
          </select>
        </div>

        <div className="view-controls">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Layers size={16} />
              Grid
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FileText size={16} />
              Lista
            </button>
          </div>
          
          <button className="action-btn secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} />
            Filtros
          </button>
          
          <button className="action-btn secondary">
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="results-info">
        Mostrando {clientesFiltrados.length} de {clientes.length} clientes
      </div>

      {/* Lista/Grid de Clientes */}
      <div className={`clientes-container ${viewMode}`}>
        {loading && clientes.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner">
              <RefreshCw size={32} className="spin" />
            </div>
            <p>Carregando clientes...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={48} />
            </div>
            <h3>Nenhum cliente encontrado</h3>
            <p>Tente ajustar os filtros de pesquisa ou adicionar novos clientes</p>
            <button 
              className="action-btn primary"
              onClick={() => setShowAddClientModal(true)}
            >
              <Plus size={16} />
              Adicionar Cliente
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="clientes-grid">
            {clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="cliente-card" data-status={cliente.status}>
                <div className="card-header">
                  <div className="client-avatar">
                    {getInitials(cliente.nome)}
                  </div>
                  <div className="card-actions">
                    <button 
                      className="card-action-btn" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (cliente.telefone) {
                          window.open(`https://wa.me/+554520357553?text=Ol%C3%A1%2C%20tenho%20interesse%20nas%20embalagens.`, '_blank');
                        }
                      }}
                      title="WhatsApp"
                    >
                      <MessageSquare size={14} />
                    </button>
                    <button 
                      className="card-action-btn" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (cliente.email) {
                          window.open(`mailto:${cliente.email}`, '_blank');
                        }
                      }}
                      title="Email"
                    >
                      <Mail size={14} />
                    </button>
                    <div className="dropdown">
                      <button className="card-action-btn" onClick={(e) => { e.stopPropagation(); }}>
                        <MoreVertical size={14} />
                      </button>
                      <div className="dropdown-menu">
                        <button 
                          className="dropdown-item"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setEditingClient(cliente);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit size={12} />
                          Editar
                        </button>
                        <button 
                          className="dropdown-item danger"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDeleteClient(cliente.id);
                          }}
                        >
                          <Trash2 size={12} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="client-name">{cliente.nome}</h3>
                  <p className="client-role">{cliente.cargo}</p>
                  <p className="client-company">{cliente.empresa}</p>
                  
                  <div className="client-tags">
                    <span className={`status-badge ${getStatusColor(cliente.status)}`}>
                      {getStatusIcon(cliente.status)}
                      {cliente.status}
                    </span>
                    <span className="segment-badge">{cliente.segmento}</span>
                  </div>

                  <div className="client-metrics">
                    <div className="metric">
                      <div className="metric-value">{formatCurrency(cliente.valorTotal || 0)}</div>
                      <div className="metric-label">Valor Total</div>
                    </div>
                    <div className="metric">
                      <div className={`metric-value ${getSaudeColor(cliente.pontuacaoSaude || cliente.saudeCliente || 0)}`}>
                        {cliente.pontuacaoSaude || cliente.saudeCliente || 0}%
                      </div>
                      <div className="metric-label">Saúde</div>
                    </div>
                  </div>

                  <div className="client-info">
                    <div className="info-item">
                      <Clock size={12} />
                      <span>Último contato: {cliente.ultimoContato ? formatDate(cliente.ultimoContato) : 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={12} />
                      <span>{cliente.endereco || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="footer-actions">
                    <button 
                      className="footer-btn primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(cliente);
                        setActiveTab('info');
                        setShowDetailsModal(true);
                      }}
                    >
                      <Eye size={14} />
                      Ver Detalhes
                    </button>
                    <button 
                      className="footer-btn secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingClient(cliente);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit size={14} />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="clientes-list">
            <div className="list-header">
              <div className="header-col">Cliente</div>
              <div className="header-col">Status</div>
              <div className="header-col">Segmento</div>
              <div className="header-col">Valor Total</div>
              <div className="header-col">Saúde</div>
              <div className="header-col">Último Contato</div>
              <div className="header-col">Ações</div>
            </div>
            
            {clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="list-row">
                <div className="list-col client-info">
                  <div className="client-avatar small">
                    {getInitials(cliente.nome)}
                  </div>
                  <div className="client-details">
                    <div className="client-name">{cliente.nome}</div>
                    <div className="client-company">{cliente.empresa}</div>
                  </div>
                </div>
                
                <div className="list-col">
                  <span className={`status-badge ${getStatusColor(cliente.status)}`}>
                    {getStatusIcon(cliente.status)}
                    {cliente.status}
                  </span>
                </div>
                
                <div className="list-col">{cliente.segmento || 'N/A'}</div>
                
                <div className="list-col">
                  <div className="value-display">{formatCurrency(cliente.valorTotal || 0)}</div>
                  <div className="monthly-value">{formatCurrency(cliente.valorMensal || 0)}/mês</div>
                </div>
                
                <div className="list-col">
                  <div className={`health-score ${getSaudeColor(cliente.pontuacaoSaude || cliente.saudeCliente || 0)}`}>
                    {cliente.pontuacaoSaude || cliente.saudeCliente || 0}%
                  </div>
                </div>
                
                <div className="list-col">{formatDate(cliente.ultimoContato)}</div>
                
                <div className="list-col actions">
                  <button className="action-icon-btn" onClick={(e) => { e.stopPropagation(); }}>
                    <Phone size={14} />
                  </button>
                  <button className="action-icon-btn" onClick={(e) => { e.stopPropagation(); }}>
                    <Mail size={14} />
                  </button>
                  <button className="action-icon-btn" onClick={(e) => { e.stopPropagation(); }}>
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edição do Cliente */}
      {showEditModal && editingClient && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Cliente</h2>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                handleEditClient(editingClient.id, editingClient);
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="edit-nome">Nome do Cliente *</label>
                    <input
                      type="text"
                      id="edit-nome"
                      value={editingClient.nome}
                      onChange={(e) => setEditingClient({...editingClient, nome: e.target.value})}
                      placeholder="Nome completo do cliente"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-empresa">Empresa</label>
                    <input
                      type="text"
                      id="edit-empresa"
                      value={editingClient.empresa}
                      onChange={(e) => setEditingClient({...editingClient, empresa: e.target.value})}
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-cargo">Cargo</label>
                    <input
                      type="text"
                      id="edit-cargo"
                      value={editingClient.cargo}
                      onChange={(e) => setEditingClient({...editingClient, cargo: e.target.value})}
                      placeholder="Cargo na empresa"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-email">E-mail *</label>
                    <input
                      type="email"
                      id="edit-email"
                      value={editingClient.email}
                      onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                      placeholder="exemplo@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-telefone">Telefone</label>
                    <input
                      type="tel"
                      id="edit-telefone"
                      value={editingClient.telefone}
                      onChange={(e) => setEditingClient({...editingClient, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-endereco">Localização</label>
                    <input
                      type="text"
                      id="edit-endereco"
                      value={editingClient.endereco}
                      onChange={(e) => setEditingClient({...editingClient, endereco: e.target.value})}
                      placeholder="Cidade, Estado"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-website">Website</label>
                    <input
                      type="url"
                      id="edit-website"
                      value={editingClient.website}
                      onChange={(e) => setEditingClient({...editingClient, website: e.target.value})}
                      placeholder="www.exemplo.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-linkedin">LinkedIn/Redes Sociais</label>
                    <input
                      type="text"
                      id="edit-linkedin"
                      value={editingClient.linkedin}
                      onChange={(e) => setEditingClient({...editingClient, linkedin: e.target.value})}
                      placeholder="linkedin.com/company/empresa"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-segmento">Segmento</label>
                    <select
                      id="edit-segmento"
                      value={editingClient.segmento}
                      onChange={(e) => setEditingClient({...editingClient, segmento: e.target.value})}
                    >
                      <option value="">Selecione um segmento</option>
                      <option value="Loja de Embalagens">Loja de Embalagens</option>
                      <option value="Loja de Presentes">Loja de Presentes</option>
                      <option value="Confeiteira">Confeiteira</option>
                      <option value="Confeitaria">Confeitaria</option>
                      <option value="Panificadora">Panificadora</option>
                      <option value="Empresa de Salgados">Empresa de Salgados</option>
                      <option value="Personalizado">Personalizado</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-classificacao">Classificação do Cliente</label>
                    <select
                      id="edit-classificacao"
                      value={editingClient.classificacao || editingClient.status}
                      onChange={(e) => setEditingClient({...editingClient, classificacao: e.target.value, status: e.target.value})}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Novo">Novo</option>
                      <option value="Recuperado">Recuperado</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-valorTotal">Valor Total de Pedidos (R$)</label>
                    <input
                      type="text"
                      id="edit-valorTotal"
                      value={editingClient.valorTotal}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,]/g, '');
                        setEditingClient({...editingClient, valorTotal: value});
                      }}
                      placeholder="Ex: 1.500,00"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-ultimoContato">Último Contato</label>
                    <input
                      type="date"
                      id="edit-ultimoContato"
                      value={editingClient.ultimoContato}
                      onChange={(e) => setEditingClient({...editingClient, ultimoContato: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-saudeCliente">Saúde do Cliente (%)</label>
                    <input
                      type="range"
                      id="edit-saudeCliente"
                      min="0"
                      max="100"
                      value={editingClient.saudeCliente || editingClient.pontuacaoSaude || 0}
                      onChange={(e) => setEditingClient({...editingClient, saudeCliente: parseInt(e.target.value)})}
                    />
                    <div className="range-value">{editingClient.saudeCliente || editingClient.pontuacaoSaude || 0}%</div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-tempoCliente">Tempo como Cliente (anos)</label>
                    <input
                      type="text"
                      id="edit-tempoCliente"
                      value={editingClient.tempoCliente}
                      onChange={(e) => setEditingClient({...editingClient, tempoCliente: e.target.value})}
                      placeholder="Ex: 2, 1.5, Prospect"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-pedidosFechados">Quantidade de Pedidos Fechados</label>
                    <input
                      type="number"
                      id="edit-pedidosFechados"
                      value={editingClient.pedidosFechados}
                      onChange={(e) => setEditingClient({...editingClient, pedidosFechados: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={editingClient.ativo}
                        onChange={(e) => setEditingClient({...editingClient, ativo: e.target.checked})}
                      />
                      Cliente Ativo
                    </label>
                  </div>

                  <div className="form-group radio-group">
                    <label>Tipo de Cliente:</label>
                    <div className="radio-options">
                      <label>
                        <input
                          type="radio"
                          name="editTipoCliente"
                          value="lojista"
                          checked={editingClient.tipoCliente === 'lojista'}
                          onChange={(e) => setEditingClient({...editingClient, tipoCliente: e.target.value})}
                        />
                        Lojista
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="editTipoCliente"
                          value="consumidor_final"
                          checked={editingClient.tipoCliente === 'consumidor_final'}
                          onChange={(e) => setEditingClient({...editingClient, tipoCliente: e.target.value})}
                        />
                        Consumidor Final
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-observacoes">Observações</label>
                  <textarea
                    id="edit-observacoes"
                    value={editingClient.observacoes}
                    onChange={(e) => setEditingClient({...editingClient, observacoes: e.target.value})}
                    placeholder="Informações adicionais sobre o cliente..."
                    rows="4"
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Cliente */}
      {showAddClientModal && (
        <div className="modal-overlay" onClick={() => setShowAddClientModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Cliente</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddClientModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={(e) => { e.preventDefault(); handleAddClient(); }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nome">Nome do Cliente *</label>
                    <input
                      type="text"
                      id="nome"
                      value={newClient.nome}
                      onChange={(e) => setNewClient({...newClient, nome: e.target.value})}
                      placeholder="Nome completo do cliente"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="empresa">Empresa</label>
                    <input
                      type="text"
                      id="empresa"
                      value={newClient.empresa}
                      onChange={(e) => setNewClient({...newClient, empresa: e.target.value})}
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cargo">Cargo</label>
                    <input
                      type="text"
                      id="cargo"
                      value={newClient.cargo}
                      onChange={(e) => setNewClient({...newClient, cargo: e.target.value})}
                      placeholder="Cargo na empresa"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      placeholder="exemplo@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input
                      type="tel"
                      id="telefone"
                      value={newClient.telefone}
                      onChange={(e) => setNewClient({...newClient, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endereco">Localização</label>
                    <input
                      type="text"
                      id="endereco"
                      value={newClient.endereco}
                      onChange={(e) => setNewClient({...newClient, endereco: e.target.value})}
                      placeholder="Cidade, Estado"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input
                      type="url"
                      id="website"
                      value={newClient.website}
                      onChange={(e) => setNewClient({...newClient, website: e.target.value})}
                      placeholder="www.exemplo.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn/Redes Sociais</label>
                    <input
                      type="text"
                      id="linkedin"
                      value={newClient.linkedin}
                      onChange={(e) => setNewClient({...newClient, linkedin: e.target.value})}
                      placeholder="linkedin.com/company/empresa"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="segmento">Segmento</label>
                    <select
                      id="segmento"
                      value={newClient.segmento}
                      onChange={(e) => setNewClient({...newClient, segmento: e.target.value})}
                    >
                      <option value="">Selecione um segmento</option>
                      <option value="Loja de Embalagens">Loja de Embalagens</option>
                      <option value="Loja de Presentes">Loja de Presentes</option>
                      <option value="Confeiteira">Confeiteira</option>
                      <option value="Confeitaria">Confeitaria</option>
                      <option value="Panificadora">Panificadora</option>
                      <option value="Empresa de Salgados">Empresa de Salgados</option>
                      <option value="Personalizado">Personalizado</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="classificacao">Classificação do Cliente</label>
                    <select
                      id="classificacao"
                      value={newClient.classificacao}
                      onChange={(e) => setNewClient({...newClient, classificacao: e.target.value})}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Novo">Novo</option>
                      <option value="Recuperado">Recuperado</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="valorTotal">Valor Total de Pedidos (R$)</label>
                    <input
                      type="text"
                      id="valorTotal"
                      value={newClient.valorTotal}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,]/g, '');
                        setNewClient({...newClient, valorTotal: value});
                      }}
                      placeholder="Ex: 1.500,00"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ultimoContato">Último Contato</label>
                    <input
                      type="date"
                      id="ultimoContato"
                      value={newClient.ultimoContato}
                      onChange={(e) => setNewClient({...newClient, ultimoContato: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="saudeCliente">Saúde do Cliente (%)</label>
                    <input
                      type="range"
                      id="saudeCliente"
                      min="0"
                      max="100"
                      value={newClient.saudeCliente}
                      onChange={(e) => setNewClient({...newClient, saudeCliente: parseInt(e.target.value)})}
                    />
                    <div className="range-value">{newClient.saudeCliente}%</div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tempoCliente">Tempo como Cliente (anos)</label>
                    <input
                      type="text"
                      id="tempoCliente"
                      value={newClient.tempoCliente}
                      onChange={(e) => setNewClient({...newClient, tempoCliente: e.target.value})}
                      placeholder="Ex: 2, 1.5, Prospect"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pedidosFechados">Quantidade de Pedidos Fechados</label>
                    <input
                      type="number"
                      id="pedidosFechados"
                      value={newClient.pedidosFechados}
                      onChange={(e) => setNewClient({...newClient, pedidosFechados: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newClient.ativo}
                        onChange={(e) => setNewClient({...newClient, ativo: e.target.checked})}
                      />
                      Cliente Ativo
                    </label>
                  </div>

                  <div className="form-group radio-group">
                    <label>Tipo de Cliente:</label>
                    <div className="radio-options">
                      <label>
                        <input
                          type="radio"
                          name="tipoCliente"
                          value="lojista"
                          checked={newClient.tipoCliente === 'lojista'}
                          onChange={(e) => setNewClient({...newClient, tipoCliente: e.target.value})}
                        />
                        Lojista
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="tipoCliente"
                          value="consumidor_final"
                          checked={newClient.tipoCliente === 'consumidor_final'}
                          onChange={(e) => setNewClient({...newClient, tipoCliente: e.target.value})}
                        />
                        Consumidor Final
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="observacoes">Observações</label>
                  <textarea
                    id="observacoes"
                    value={newClient.observacoes}
                    onChange={(e) => setNewClient({...newClient, observacoes: e.target.value})}
                    placeholder="Informações adicionais sobre o cliente..."
                    rows="4"
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowAddClientModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Salvar Cliente
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes do Cliente */}
      {showDetailsModal && selectedClient && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Cliente - {selectedClient.nome}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="client-details-tabs">
                <div className="tabs-header">
                  <button 
                    className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    Informações
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pedidos')}
                  >
                    Pedidos
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'atividades' ? 'active' : ''}`}
                    onClick={() => setActiveTab('atividades')}
                  >
                    Atividades
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'anexos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('anexos')}
                  >
                    Anexos
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'info' && (
                    <div className="info-section">
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Nome:</label>
                          <span>{selectedClient.nome}</span>
                        </div>
                        <div className="info-item">
                          <label>Empresa:</label>
                          <span>{selectedClient.empresa}</span>
                        </div>
                        <div className="info-item">
                          <label>Email:</label>
                          <span>{selectedClient.email}</span>
                        </div>
                        <div className="info-item">
                          <label>Telefone:</label>
                          <span>{selectedClient.telefone}</span>
                        </div>
                        <div className="info-item">
                          <label>Segmento:</label>
                          <span>{selectedClient.segmento}</span>
                        </div>
                        <div className="info-item">
                          <label>Status:</label>
                          <span className={`status-badge ${getStatusColor(selectedClient.status)}`}>
                            {selectedClient.status}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Valor Total:</label>
                          <span>{formatCurrency(selectedClient.valorTotal)}</span>
                        </div>
                        <div className="info-item">
                          <label>Saúde do Cliente:</label>
                          <span className={getSaudeColor(selectedClient.saudeCliente || selectedClient.pontuacaoSaude || 0)}>
                            {selectedClient.saudeCliente || selectedClient.pontuacaoSaude || 0}%
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Endereço:</label>
                          <span>{selectedClient.endereco || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Website:</label>
                          <span>{selectedClient.website || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>LinkedIn:</label>
                          <span>{selectedClient.linkedin || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Tempo como Cliente:</label>
                          <span>{selectedClient.tempoCliente || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Pedidos Fechados:</label>
                          <span>{selectedClient.pedidosFechados || 0}</span>
                        </div>
                        <div className="info-item">
                          <label>Último Contato:</label>
                          <span>{selectedClient.ultimoContato ? formatDate(selectedClient.ultimoContato) : 'N/A'}</span>
                        </div>
                      </div>
                      
                      {selectedClient.observacoes && (
                        <div className="form-group" style={{ marginTop: '20px' }}>
                          <label>Observações:</label>
                          <p style={{ marginTop: '8px', color: '#6b7280', lineHeight: '1.6' }}>
                            {selectedClient.observacoes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'pedidos' && (
                    <div className="pedidos-section">
                      <div className="form-group">
                        <label htmlFor="pedidosTotal">Quantidade Total de Pedidos:</label>
                        <input
                          type="number"
                          id="pedidosTotal"
                          value={clientDetails.pedidosTotal}
                          onChange={(e) => setClientDetails({...clientDetails, pedidosTotal: parseInt(e.target.value) || 0})}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="numerosPedidos">Números dos Pedidos:</label>
                        <textarea
                          id="numerosPedidos"
                          value={clientDetails.numerosPedidos}
                          onChange={(e) => setClientDetails({...clientDetails, numerosPedidos: e.target.value})}
                          placeholder="Ex: #001, #002, #003..."
                          rows="3"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="valorTotalPedidos">Valor Total dos Pedidos (R$):</label>
                        <input
                          type="text"
                          id="valorTotalPedidos"
                          value={clientDetails.valorTotalPedidos}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.,]/g, '');
                            setClientDetails({...clientDetails, valorTotalPedidos: value});
                          }}
                          placeholder="Ex: 15.000,00"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'atividades' && (
                    <div className="atividades-section">
                      <div className="form-group">
                        <label htmlFor="atividades">Jornada do Cliente:</label>
                        <textarea
                          id="atividades"
                          value={clientDetails.atividades}
                          onChange={(e) => setClientDetails({...clientDetails, atividades: e.target.value})}
                          placeholder="Ex: Mandamos catálogos atualizados, 2 orçamentos, reunião de apresentação..."
                          rows="6"
                        />
                      </div>
                      
                      <div className="atividades-history">
                        <h4>Histórico de Atividades:</h4>
                        <div className="activity-list">
                          {atividadesCliente.map((atividade) => (
                            <div key={atividade.id} className="activity-item">
                              <div className="activity-icon">
                                {getActivityIcon(atividade.tipo)}
                              </div>
                              <div className="activity-content">
                                <div className="activity-title">{atividade.titulo}</div>
                                <div className="activity-description">{atividade.descricao}</div>
                                <div className="activity-meta">
                                  <span className="activity-date">{atividade.data}</span>
                                  {atividade.duracao && <span className="activity-duration">{atividade.duracao}</span>}
                                  {atividade.resultado && <span className="activity-result">{atividade.resultado}</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'anexos' && (
                    <div className="anexos-section">
                      <div className="form-group">
                        <label htmlFor="anexos">Anexar Último Pedido:</label>
                        <input
                          type="file"
                          id="anexos"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setClientDetails({...clientDetails, anexos: files});
                          }}
                        />
                      </div>
                      
                      <div className="anexos-list">
                        {clientDetails.anexos.length > 0 && (
                          <div className="files-preview">
                            <h4>Arquivos Selecionados:</h4>
                            {clientDetails.anexos.map((file, index) => (
                              <div key={index} className="file-item">
                                <FileText size={16} />
                                <span>{file.name}</span>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newFiles = clientDetails.anexos.filter((_, i) => i !== index);
                                    setClientDetails({...clientDetails, anexos: newFiles});
                                  }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fechar
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={() => {
                    // Aqui você pode salvar os detalhes do cliente
                    console.log('Salvando detalhes:', clientDetails);
                    setShowDetailsModal(false);
                  }}
                >
                  <Save size={16} />
                  Salvar Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .clientes-page {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .clientes-page::before {
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

        .header-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          color: #1e40af;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
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

        .stat-icon.blue { 
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1)); 
          color: #3b82f6;
        }
        .stat-icon.green { 
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1)); 
          color: #10b981;
        }
        .stat-icon.gray { 
          background: linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(107, 114, 128, 0.1)); 
          color: #6b7280;
        }
        .stat-icon.purple { 
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1)); 
          color: #8b5cf6;
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

        .stat-trend.neutral {
          color: #6b7280;
          background: rgba(107, 114, 128, 0.1);
        }

        /* Controls */
        .controls-section {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
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

        .view-controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          padding: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .view-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.8);
          color: #1e293b;
        }

        .results-info {
          position: relative;
          z-index: 1;
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          backdrop-filter: blur(8px);
        }

        /* Clientes Container */
        .clientes-container {
          position: relative;
          z-index: 1;
        }

        /* Grid View */
        .clientes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .cliente-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }

        .cliente-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.6s ease;
        }

        .cliente-card:hover::before {
          left: 100%;
        }

        .cliente-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .client-avatar {
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
          transition: all 0.3s ease;
        }

        .client-avatar:hover {
          transform: scale(1.1);
        }

        .client-avatar.small {
          width: 2.5rem;
          height: 2.5rem;
          font-size: 0.8rem;
        }

        .client-avatar.large {
          width: 4rem;
          height: 4rem;
          font-size: 1.1rem;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 10;
          min-width: 120px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s;
        }

        .dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background: #f3f4f6;
        }

        .dropdown-item.danger {
          color: #dc2626;
        }

        .dropdown-item.danger:hover {
          background: #fef2f2;
        }

        .card-action-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .card-action-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-content {
          margin-bottom: 1.5rem;
        }

        .client-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .client-role {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .client-company {
          font-size: 1rem;
          color: #475569;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .client-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid;
        }

        .segment-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(139, 92, 246, 0.1);
          color: #7c3aed;
        }

        .tag-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(107, 114, 128, 0.1);
          color: #374151;
        }

        .client-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(248, 250, 252, 0.6);
          border-radius: 12px;
        }

        .metric {
          text-align: center;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .client-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #64748b;
        }

        .card-footer {
          border-top: 1px solid rgba(241, 245, 249, 0.8);
          padding-top: 1rem;
        }

        .footer-actions {
          display: flex;
          gap: 0.75rem;
        }

        .footer-btn {
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
        }

        .footer-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .footer-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .footer-btn.secondary {
          background: rgba(255, 255, 255, 0.8);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .footer-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
        }

        /* List View */
        .clientes-list {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .list-header {
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding: 1rem 1.5rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr 0.8fr 1fr 1fr;
          gap: 1rem;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
        }

        .list-row {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr 0.8fr 1fr 1fr;
          gap: 1rem;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .list-row:hover {
          background: rgba(59, 130, 246, 0.05);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .list-row:last-child {
          border-bottom: none;
        }

        .list-col.client-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .client-details .client-name {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .client-details .client-company {
          font-size: 0.8rem;
          margin-bottom: 0;
        }

        .value-display {
          font-weight: 700;
          color: #1e293b;
        }

        .monthly-value {
          font-size: 0.8rem;
          color: #64748b;
        }

        .health-score {
          font-weight: 700;
        }

        .list-col.actions {
          display: flex;
          gap: 0.25rem;
        }

        .action-icon-btn {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .action-icon-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Empty State */
        .empty-state,
        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .loading-spinner {
          margin-bottom: 1rem;
          color: #3b82f6;
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
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .modal-content.large {
          max-width: 1200px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .client-header-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .client-main-info {
          flex: 1;
        }

        .client-modal-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .client-modal-role {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .client-modal-company {
          font-size: 1.1rem;
          color: #475569;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .client-modal-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .modal-action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-action-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .modal-action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .modal-action-btn.secondary {
          background: rgba(255, 255, 255, 0.8);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .modal-action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
        }

        .close-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          transform: scale(1.1);
        }

        /* Modal Tabs */
        .modal-tabs {
          display: flex;
          background: rgba(248, 250, 252, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.6);
          color: #1e293b;
        }

        .tab-btn.active {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        /* Tab Content */
        .tab-content {
          padding: 2rem;
        }

        /* Overview Content */
        .overview-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(248, 250, 252, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .metric-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .metric-icon.revenue {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .metric-icon.health {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .metric-icon.deals {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .metric-icon.satisfaction {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .metric-info {
          flex: 1;
        }

        .metric-info .metric-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .metric-info .metric-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .metric-detail {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .overview-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .info-section {
          background: rgba(248, 250, 252, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .info-section.full-width {
          grid-column: 1 / -1;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
        }

        .info-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-size: 0.9rem;
          color: #1e293b;
          font-weight: 500;
        }

        .info-value a {
          color: #3b82f6;
          text-decoration: none;
        }

        .info-value a:hover {
          text-decoration: underline;
        }

        .observations-content {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          padding: 1rem;
        }

        .next-action {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        /* Activity Content */
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .activity-timeline {
          position: relative;
          padding-left: 2rem;
        }

        .activity-timeline::before {
          content: '';
          position: absolute;
          left: 0.75rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #3b82f6, #e5e7eb);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
        }

        .timeline-marker {
          position: absolute;
          left: -2rem;
          top: 0.25rem;
          width: 1.5rem;
          height: 1.5rem;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-content {
          background: rgba(248, 250, 252, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-left: 1rem;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .activity-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .activity-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .activity-date {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .activity-duration {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .activity-description {
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .activity-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .activity-responsible {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .activity-result {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .activity-result.positivo {
          background: rgba(16, 185, 129, 0.1);
          color: #065f46;
        }

        .activity-result.pendente {
          background: rgba(245, 158, 11, 0.1);
          color: #92400e;
        }

        .activity-result.fechado {
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
        }

        .activity-value {
          font-weight: 700;
          color: #10b981;
        }

        /* Deals Content */
        .deals-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .deal-stat {
          background: rgba(248, 250, 252, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }

        .deal-stat .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .deal-stat .stat-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        .deals-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .deal-item {
          background: rgba(248, 250, 252, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .deal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .deal-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0;
        }

        .deal-stage {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
        }

        .deal-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .deal-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: #10b981;
        }

        .deal-probability {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .deal-close-date {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Documents Content */
        .documents-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .document-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(248, 250, 252, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .document-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .document-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .document-info {
          flex: 1;
        }

        .document-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .document-meta {
          font-size: 0.8rem;
          color: #64748b;
        }

        .document-actions {
          display: flex;
          gap: 0.5rem;
        }

        .doc-action-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .doc-action-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          transform: translateY(-2px);
        }

        /* Settings Content */
        .settings-header {
          margin-bottom: 2rem;
        }

        .settings-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .settings-section {
          background: rgba(248, 250, 252, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .settings-subtitle {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .settings-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .settings-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .settings-option input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
          accent-color: #3b82f6;
        }

        .settings-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .form-group select {
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
          color: #1e293b;
          font-size: 0.875rem;
        }

        .settings-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
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

        /* Color Classes */
        .text-emerald-600 { color: #059669; }
        .text-amber-600 { color: #d97706; }
        .text-red-600 { color: #dc2626; }

        .bg-emerald-100 { background-color: #d1fae5; }
        .text-emerald-800 { color: #065f46; }
        .border-emerald-200 { border-color: #a7f3d0; }

        .bg-amber-100 { background-color: #fef3c7; }
        .text-amber-800 { color: #92400e; }
        .border-amber-200 { border-color: #fde68a; }

        .bg-blue-100 { background-color: #dbeafe; }
        .text-blue-800 { color: #1e40af; }
        .border-blue-200 { border-color: #bfdbfe; }

        .bg-gray-100 { background-color: #f3f4f6; }
        .text-gray-800 { color: #1f2937; }
        .border-gray-200 { border-color: #e5e7eb; }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .overview-sections {
            grid-template-columns: 1fr;
          }

          .clientes-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .list-header,
          .list-row {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }

          .list-header .header-col:nth-child(5),
          .list-header .header-col:nth-child(6),
          .list-row .list-col:nth-child(5),
          .list-row .list-col:nth-child(6) {
            display: none;
          }

          .modal-content.large {
            max-width: 900px;
          }

          .overview-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .settings-form {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .clientes-page {
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

          .clientes-grid {
            grid-template-columns: 1fr;
          }

          .list-header,
          .list-row {
            grid-template-columns: 2fr 1fr;
          }

          .list-header .header-col:nth-child(n+3),
          .list-row .list-col:nth-child(n+3) {
            display: none;
          }

          .modal-content {
            margin: 0.5rem;
            max-width: none;
          }

          .client-header-info {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-tabs {
            flex-wrap: wrap;
          }

          .overview-metrics {
            grid-template-columns: 1fr;
          }

          .client-metrics {
            grid-template-columns: 1fr;
          }

          .footer-actions {
            flex-direction: column;
          }

          .deal-details {
            grid-template-columns: 1fr;
          }

          .deals-summary {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .page-header,
          .controls-section,
          .clientes-list,
          .cliente-card {
            padding: 1rem;
          }

          .stat-card {
            padding: 1rem;
          }

          .modal-content {
            padding: 0;
          }

          .modal-header,
          .tab-content {
            padding: 1rem;
          }

          .deals-summary {
            grid-template-columns: 1fr;
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
        .card-action-btn:focus,
        .footer-btn:focus,
        .modal-action-btn:focus,
        .tab-btn:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .page-header,
          .controls-section,
          .clientes-list,
          .cliente-card,
          .modal-content {
            border: 2px solid #1e293b;
          }
          
          .page-title,
          .client-name,
          .section-title {
            color: #000;
          }
        }

        /* Print Styles */
        @media print {
          .clientes-page {
            background: white;
          }
          
          .page-header,
          .controls-section,
          .clientes-list,
          .cliente-card {
            background: white;
            border: 1px solid #000;
            box-shadow: none;
          }
          
          .action-btn,
          .card-action-btn,
          .footer-btn,
          .modal-action-btn {
            display: none;
          }

          .modal-overlay {
            display: none;
          }
        }

        /* Scrollbar Customization */
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

        /* Advanced Hover Effects */
        .cliente-card:hover .client-avatar {
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .stat-card:hover .stat-icon {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        /* Loading States */
        .loading {
          opacity: 0.6;
          pointer-events: none;
        }

        .loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Micro-interactions */
        .cliente-card:hover .card-header {
          transform: translateY(-1px);
        }

        .stat-card:hover .stat-content {
          transform: translateX(2px);
        }

        /* Dark mode support (for future implementation) */
        @media (prefers-color-scheme: dark) {
          .clientes-page {
            --glass-bg: rgba(17, 24, 39, 0.8);
            --glass-border: rgba(75, 85, 99, 0.3);
          }
        }

        /* Edge case handling */
        .client-name,
        .client-company,
        .info-value {
          word-break: break-word;
          overflow-wrap: break-word;
        }

        /* Status-specific styling enhancements */
        .cliente-card[data-status="Ativo"] {
          border-left: 4px solid #10b981;
        }

        .cliente-card[data-status="Inativo"] {
          border-left: 4px solid #6b7280;
        }

        .cliente-card[data-status="Novo"] {
          border-left: 4px solid #3b82f6;
        }

        .cliente-card[data-status="Recuperado"] {
          border-left: 4px solid #8b5cf6;
        }

        /* Enhanced visual feedback */
        .action-btn:active,
        .footer-btn:active,
        .modal-action-btn:active {
          transform: translateY(0) scale(0.98);
        }

        /* Improved grid responsiveness */
        @container (max-width: 400px) {
          .client-metrics {
            grid-template-columns: 1fr;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .large-modal {
          max-width: 1000px;
        }

        .range-value {
          text-align: center;
          font-weight: 600;
          color: #3b82f6;
          margin-top: 8px;
        }

        .client-details-tabs {
          width: 100%;
        }

        .tabs-header {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 12px 24px;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab-btn.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab-btn:hover {
          color: #374151;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .info-item span {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .activity-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .activity-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .activity-description {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 8px;
        }

        .activity-meta {
          display: flex;
          gap: 12px;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .files-preview {
          margin-top: 16px;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: #f3f4f6;
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .file-item button {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          padding: 4px;
          margin-left: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
        }

        .close-btn {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .modal-body {
          padding: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .checkbox-group {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        .checkbox-group input {
          width: auto;
          margin: 0;
        }

        .radio-group label:first-child {
          margin-bottom: 8px;
        }

        .radio-options {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .radio-options label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-weight: normal;
        }

        .radio-options input {
          width: auto;
          margin: 0;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-primary,
        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          font-size: 0.875rem;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 10px;
            width: calc(100% - 20px);
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            flex-direction: column;
          }

          .radio-options {
            flex-direction: column;
            gap: 8px;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
        }
        
        .status-indicator.green {
          background-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
        
        .status-indicator.yellow {
          background-color: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }
        
        .stat-chip.online {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #065f46;
        }
        
        .stat-chip.offline {
          background-color: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: #92400e;
        }
      `}</style>
    </div>
  );
};

export default ClientesPage;