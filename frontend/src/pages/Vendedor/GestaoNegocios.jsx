import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import {
  Plus, DollarSign, Target, TrendingUp, Calendar, Users,
  Search, Filter, MoreVertical, Edit, Trash2, Eye, Phone, Mail,
  ArrowUpDown, RefreshCw, Download, Upload, BarChart3, Activity,
  Clock, AlertCircle, CheckCircle, XCircle, Star, Flag,
  Briefcase, Building, User, MessageSquare, FileText, Settings,
  Award, Zap, PieChart, TrendingDown, ChevronDown, PlayCircle,
  Pause, FastForward, RotateCcw, Share2, Bookmark, Heart,
  Globe, MapPin, Camera, Video, Headphones, Send, Shield, Copy,
  MessageCircle, X
} from 'lucide-react';

const GestaoNegocios = () => {
  // Estados principais
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [viewMode, setViewMode] = useState('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');
  const [sortBy, setSortBy] = useState('value');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [showNovaAtividade, setShowNovaAtividade] = useState(false);

  // Formulários
  const [newDealForm, setNewDealForm] = useState({
    titulo: '',
    cliente: '',
    contato: '',
    valor: '',
    probabilidade: 50,
    estagio: 'Qualificação',
    responsavel: 'Rosana',
    dataFechamento: '',
    origem: 'Indicação',
    prioridade: 'Média',
    email: '',
    telefone: '',
    empresa: '',
    segmento: '',
    website: '',
    endereco: '',
    observacoes: '',
    proximaAcao: '',
    tag: 'Novo',
    concorrentes: [],
    motivos: []
  });

  const [newActivityForm, setNewActivityForm] = useState({
    tipo: 'call',
    titulo: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    responsavel: 'Usuário Atual'
  });

  const [novaAtividade, setNovaAtividade] = useState({
    titulo: '',
    descricao: '',
    tipo: 'ligacao',
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    negocioId: ''
  });

  // Estados de dados - inicializam vazios, dados são carregados no useEffect
  const [notas, setNotas] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState([]);

  // UseEffects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Debug: comando para limpar localStorage
    console.log('🔧 Para limpar todos os dados salvos, execute no console: localStorage.clear(); location.reload();');
    
    return () => clearInterval(timer);
  }, []);

  // Carrega dados do Firebase primeiro, depois localStorage se não houver dados
  useEffect(() => {
    const loadNegociosFromFirebase = async () => {
      try {
        const negociosSnapshot = await getDocs(collection(db, 'negocios'));
        const negociosFirebase = negociosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (negociosFirebase.length > 0) {
          setNegocios(negociosFirebase);
          // Sincroniza com localStorage
          localStorage.setItem('negocios', JSON.stringify(negociosFirebase));
        } else {
          // Se não há dados no Firebase, carrega do localStorage
          const savedNegocios = localStorage.getItem('negocios');
          if (savedNegocios) {
            setNegocios(JSON.parse(savedNegocios));
          }
        }
      } catch (error) {
        console.log('Erro ao carregar do Firebase, usando localStorage:', error);
        // Fallback para localStorage
        const savedNegocios = localStorage.getItem('negocios');
        if (savedNegocios) {
          setNegocios(JSON.parse(savedNegocios));
        }
      }
    };

    loadNegociosFromFirebase();
  }, []);

  useEffect(() => {
    const savedNegocios = localStorage.getItem('negocios');
    const savedNotas = localStorage.getItem('notas');
    const savedAtividades = localStorage.getItem('atividades');
    
    // Se há dados salvos, usa eles; senão, usa os dados mock
    if (savedNegocios) {
      setNegocios(JSON.parse(savedNegocios));
    } else {
      // Dados mock iniciais apenas se não houver dados salvos
      setNegocios([
        {
          id: 1,
          titulo: 'Implementação ERP Completo',
          cliente: 'TechStart Solutions',
          contato: 'Carlos Silva',
          valor: 285000,
          probabilidade: 85,
          estagio: 'Negociação',
          responsavel: 'Ana Costa',
          dataFechamento: '2024-12-15',
          dataCriacao: '2024-01-10',
          ultimaAtualizacao: '2024-01-15',
          origem: 'LinkedIn',
          prioridade: 'Alta',
          email: 'carlos@techstart.com',
          telefone: '(11) 99999-9999',
          empresa: 'TechStart Solutions',
          segmento: 'Tecnologia',
          funcionarios: 150,
          website: 'www.techstart.com',
          endereco: 'São Paulo, SP',
          observacoes: 'Cliente com grande potencial. Decisão esperada para dezembro.',
          proximaAcao: 'Reunião final de apresentação',
          tag: 'Premium',
          avatar: 'TS',
          atividades: 15,
          propostas: 2,
          concorrentes: ['Concorrente A', 'Concorrente B'],
          motivos: ['Automação', 'Escalabilidade', 'Integração']
        },
        {
          id: 2,
          titulo: 'Sistema de Marketing Digital',
          cliente: 'Inova Marketing Digital',
          contato: 'Ana Paula',
          valor: 150000,
          probabilidade: 70,
          estagio: 'Proposta',
          responsavel: 'Bruno Silva',
          dataFechamento: '2024-11-30',
          dataCriacao: '2023-12-05',
          ultimaAtualizacao: '2024-01-12',
          origem: 'Website',
          prioridade: 'Média',
          email: 'ana.paula@inova.com',
          telefone: '(21) 88888-8888',
          empresa: 'Inova Marketing Digital',
          segmento: 'Marketing',
          funcionarios: 45,
          website: 'www.inovamarketing.com',
          endereco: 'Rio de Janeiro, RJ',
          observacoes: 'Empresa em crescimento, interesse em automação de marketing.',
          proximaAcao: 'Ajustar proposta com desconto',
          tag: 'Growth',
          avatar: 'IM',
          atividades: 8,
          propostas: 1,
          concorrentes: ['Concorrente C'],
          motivos: ['Automação', 'ROI', 'Eficiência']
        },
        {
          id: 3,
          titulo: 'Consultoria em Logística',
          cliente: 'Logística Express',
          contato: 'Fernando Costa',
          valor: 90000,
          probabilidade: 45,
          estagio: 'Qualificação',
          responsavel: 'Carlos Mendes',
          dataFechamento: '2024-10-20',
          dataCriacao: '2024-01-08',
          ultimaAtualizacao: '2024-01-14',
          origem: 'Indicação',
          prioridade: 'Baixa',
          email: 'fernando@logexpress.com',
          telefone: '(31) 77777-7777',
          empresa: 'Logística Express',
          segmento: 'Logística',
          funcionarios: 80,
          website: 'www.logexpress.com',
          endereco: 'Belo Horizonte, MG',
          observacoes: 'Cliente hesitante sobre investimento. Necessário demonstrar ROI.',
          proximaAcao: 'Preparar case de sucesso',
          tag: 'Em Risco',
          avatar: 'LE',
          atividades: 12,
          propostas: 0,
          concorrentes: [],
          motivos: ['Redução de Custos', 'Otimização']
        },
        {
          id: 4,
          titulo: 'Plataforma E-commerce',
          cliente: 'StartupFlow Inc',
          contato: 'Maria Oliveira',
          valor: 320000,
          probabilidade: 90,
          estagio: 'Fechamento',
          responsavel: 'Ana Costa',
          dataFechamento: '2024-09-15',
          dataCriacao: '2023-11-20',
          ultimaAtualizacao: '2024-01-16',
          origem: 'Evento',
          prioridade: 'Alta',
          email: 'maria@startupflow.com',
          telefone: '(11) 66666-6666',
          empresa: 'StartupFlow Inc',
          segmento: 'E-commerce',
          funcionarios: 25,
          website: 'www.startupflow.com',
          endereco: 'São Paulo, SP',
          observacoes: 'Startup promissora com funding recente. Pronta para fechar.',
          proximaAcao: 'Revisão final do contrato',
          tag: 'Hot Lead',
          avatar: 'SF',
          atividades: 22,
          propostas: 3,
          concorrentes: ['Concorrente D'],
          motivos: ['Inovação', 'Escalabilidade', 'Time-to-Market']
        },
        {
          id: 5,
          titulo: 'Sistema de Gestão Financeira',
          cliente: 'Consultoria Alpha',
          contato: 'Pedro Santos',
          valor: 120000,
          probabilidade: 60,
          estagio: 'Proposta',
          responsavel: 'Bruno Silva',
          dataFechamento: '2024-12-01',
          dataCriacao: '2024-01-05',
          ultimaAtualizacao: '2024-01-13',
          origem: 'Cold Email',
          prioridade: 'Média',
          email: 'pedro@consultoriaaalpha.com',
          telefone: '(85) 55555-5555',
          empresa: 'Consultoria Alpha',
          segmento: 'Consultoria',
          funcionarios: 60,
          website: 'www.consultoriaalpha.com',
          endereco: 'Fortaleza, CE',
          observacoes: 'Cliente interessado em integração com sistemas existentes.',
          proximaAcao: 'Demo técnica detalhada',
          tag: 'Qualified',
          avatar: 'CA',
          atividades: 6,
          propostas: 1,
          concorrentes: ['Concorrente E', 'Concorrente F'],
          motivos: ['Integração', 'Compliance', 'Controle']
        },
        {
          id: 6,
          titulo: 'Modernização de TI',
          cliente: 'Global Enterprises',
          contato: 'Roberto Almeida',
          valor: 450000,
          probabilidade: 75,
          estagio: 'Negociação',
          responsavel: 'Ana Costa',
          dataFechamento: '2024-11-10',
          dataCriacao: '2023-10-15',
          ultimaAtualizacao: '2024-01-15',
          origem: 'Referência',
          prioridade: 'Alta',
          email: 'roberto@globalenterprises.com',
          telefone: '(11) 44444-4444',
          empresa: 'Global Enterprises',
          segmento: 'Corporativo',
          funcionarios: 500,
          website: 'www.globalenterprises.com',
          endereco: 'São Paulo, SP',
          observacoes: 'Grande corporação com processo de decisão complexo.',
          proximaAcao: 'Apresentação para board',
          tag: 'Enterprise',
          avatar: 'GE',
          atividades: 28,
          propostas: 2,
          concorrentes: ['Concorrente G', 'Concorrente H'],
          motivos: ['Modernização', 'Segurança', 'Performance']
        }
      ]);
    }
    
    if (savedNotas) {
      setNotas(JSON.parse(savedNotas));
    } else {
      setNotas([
        {
          id: 1,
          autor: 'Ana Costa',
          data: '2024-01-16',
          conteudo: 'Cliente demonstrou grande interesse na funcionalidade de automação. Sugeriu marcar uma demo técnica para a próxima semana com a equipe de TI.',
          negocioId: 1
        },
        {
          id: 2,
          autor: 'Bruno Silva',
          data: '2024-01-11',
          conteudo: 'Primeira reunião muito positiva. Cliente já tem budget aprovado e timeline definido. Principal preocupação é com a integração aos sistemas legados.',
          negocioId: 1
        }
      ]);
    }
    
    if (savedAtividades) {
      setAtividadesRecentes(JSON.parse(savedAtividades));
    } else {
      setAtividadesRecentes([
        {
          id: 1,
          tipo: 'call',
          titulo: 'Ligação para TechStart Solutions',
          descricao: 'Discussão sobre cronograma de implementação',
          data: '2024-01-16 14:30',
          responsavel: 'Ana Costa',
          negocio: 'Implementação ERP Completo'
        },
        {
          id: 2,
          tipo: 'email',
          titulo: 'Proposta enviada para StartupFlow',
          descricao: 'Proposta final com desconto especial de startup',
          data: '2024-01-16 10:15',
          responsavel: 'Ana Costa',
          negocio: 'Plataforma E-commerce'
        },
        {
          id: 3,
          tipo: 'meeting',
          titulo: 'Reunião com Global Enterprises',
          descricao: 'Apresentação técnica para equipe de TI',
          data: '2024-01-15 16:00',
          responsavel: 'Ana Costa',
          negocio: 'Modernização de TI'
        }
      ]);
    }
  }, []);

  useEffect(() => {
    if (negocios.length > 0) {
      localStorage.setItem('negocios', JSON.stringify(negocios));
    }
  }, [negocios]);

  useEffect(() => {
    if (notas.length > 0) {
      localStorage.setItem('notas', JSON.stringify(notas));
    }
  }, [notas]);

  useEffect(() => {
    if (atividadesRecentes.length > 0) {
      localStorage.setItem('atividades', JSON.stringify(atividadesRecentes));
    }
  }, [atividadesRecentes]);

  // Handlers
  const handleNewActivitySubmit = (e) => {
    e.preventDefault();
    
    if (!newActivityForm.titulo || !newActivityForm.descricao) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const novaAtividade = {
      id: Date.now(),
      ...newActivityForm,
      data: new Date().toISOString(),
      negocio: selectedDeal.titulo
    };

    setAtividadesRecentes(prev => [novaAtividade, ...prev]);
    
    setNegocios(prev => prev.map(deal => 
      deal.id === selectedDeal.id 
        ? { ...deal, atividades: deal.atividades + 1, ultimaAtualizacao: new Date().toISOString() }
        : deal
    ));

    setNewActivityForm({
      tipo: 'call',
      titulo: '',
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      responsavel: 'Usuário Atual'
    });
    
    setShowNewActivityModal(false);
    alert('Nova atividade criada com sucesso!');
  };

  // Estágios do pipeline
  const estagios = [
    {
      nome: 'Qualificação',
      cor: '#3b82f6',
      icone: Target,
      descricao: 'Leads em processo de qualificação'
    },
    {
      nome: 'Proposta',
      cor: '#f59e0b',
      icone: FileText,
      descricao: 'Propostas enviadas e em análise'
    },
    {
      nome: 'Negociação',
      cor: '#8b5cf6',
      icone: MessageSquare,
      descricao: 'Negociação de termos e condições'
    },
    {
      nome: 'Fechamento',
      cor: '#10b981',
      icone: CheckCircle,
      descricao: 'Pronto para assinatura'
    }
  ];

  // Filtros
  const negociosFiltrados = negocios.filter(negocio => {
    const matchesSearch = negocio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      negocio.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      negocio.contato.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || negocio.estagio === statusFilter;
    const matchesResponsible = responsibleFilter === '' || negocio.responsavel === responsibleFilter;
    return matchesSearch && matchesStatus && matchesResponsible;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'value': return b.valor - a.valor;
      case 'probability': return b.probabilidade - a.probabilidade;
      case 'date': return new Date(b.ultimaAtualizacao) - new Date(a.ultimaAtualizacao);
      default: return 0;
    }
  });

  // Estatísticas calculadas baseadas em TODOS os negócios (sem filtros)
  const stats = {
    total: negocios.length,
    valorTotal: negocios.reduce((acc, neg) => acc + neg.valor, 0),
    valorMedio: negocios.length > 0 ? negocios.reduce((acc, neg) => acc + neg.valor, 0) / negocios.length : 0,
    probabilidadeMedia: negocios.length > 0 ? negocios.reduce((acc, neg) => acc + neg.probabilidade, 0) / negocios.length : 0,
    valorPonderado: negocios.reduce((acc, neg) => acc + (neg.valor * neg.probabilidade / 100), 0),
    // qualificacao: negocios.filter(n => n.estagio === 'Qualificação').length,
    proposta: negocios.filter(n => n.estagio === 'Proposta').length,
    negociacao: negocios.filter(n => n.estagio === 'Negociação').length,
    fechamento: negocios.filter(n => n.estagio === 'Fechamento').length
  };

  // Funções para gerenciar negócios
  const handleNewDealSubmit = (e) => {
    e.preventDefault();
    
    if (!newDealForm.titulo || !newDealForm.cliente || !newDealForm.contato || !newDealForm.valor) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const novoDeal = {
      id: Date.now(),
      ...newDealForm,
      valor: parseFloat(newDealForm.valor),

      dataCriacao: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
      avatar: newDealForm.empresa ? newDealForm.empresa.substring(0, 2).toUpperCase() : 'NN',
      atividades: 0,
      propostas: 0,
      concorrentes: [],
      motivos: []
    };

    setNegocios(prev => [...prev, novoDeal]);
    setNewDealForm({
      titulo: '',
      cliente: '',
      contato: '',
      valor: '',
      probabilidade: 50,
      estagio: 'Qualificação',
      responsavel: 'Ana Costa',
      dataFechamento: '',
      origem: 'Website',
      prioridade: 'Média',
      email: '',
      telefone: '',
      empresa: '',
      segmento: '',
      website: '',
      endereco: '',
      observacoes: '',
      proximaAcao: '',
      tag: 'Novo',
      concorrentes: [],
      motivos: []
    });
    setShowNewDealModal(false);
    alert('Novo negócio criado com sucesso!');
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm('Tem certeza que deseja excluir este negócio? Esta ação não pode ser desfeita.')) {
      try {
        // Remove do estado local
        setNegocios(prev => prev.filter(deal => deal.id !== dealId));
        
        // Remove notas relacionadas
        setNotas(prev => prev.filter(nota => nota.negocioId !== dealId));
        
        // Remove atividades relacionadas
        setAtividadesRecentes(prev => prev.filter(atividade => {
          const negocioTitulo = negocios.find(n => n.id === dealId)?.titulo;
          return atividade.negocio !== negocioTitulo;
        }));
        
        // Fecha o modal se estiver aberto
        if (selectedDeal && selectedDeal.id === dealId) {
          setSelectedDeal(null);
        }
        
        alert('Negócio excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir negócio:', error);
        alert('Erro ao excluir negócio. Tente novamente.');
      }
    }
  };

  const handleExportData = (format) => {
    setIsRefreshing(true);
    setTimeout(() => {
      const dataStr = JSON.stringify(negociosFiltrados, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `negocios_${format}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsRefreshing(false);
      setShowExportMenu(false);
      alert(`Dados exportados em formato ${format}!`);
    }, 1000);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simula atualização dos dados
      setNegocios(prev => prev.map(deal => ({
        ...deal,
        ultimaAtualizacao: new Date().toISOString()
      })));
      setIsRefreshing(false);
      alert('Dados atualizados com sucesso!');
    }, 1500);
  };

  const handleClearAllData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados salvos? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('negocios');
      localStorage.removeItem('notas');
      localStorage.removeItem('atividades');
      window.location.reload();
    }
  };

  const handleWhatsAppClient = (deal) => {
    if (deal.telefone) {
      // Remove caracteres especiais do telefone
      const phoneNumber = deal.telefone.replace(/[^\d]/g, '');
      const message = encodeURIComponent(`Olá ${deal.contato}, tudo bem? Sou ${deal.responsavel} e gostaria de conversar sobre o negócio "${deal.titulo}".`);
      const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Telefone não disponível para este cliente');
    }
  };

  const handleCallClient = (deal) => {
    if (deal.telefone) {
      window.open(`tel:${deal.telefone}`, '_self');
    } else {
      alert('Telefone não disponível para este cliente');
    }
  };

  // Função para criar nova atividade
  const handleNovaAtividade = (e) => {
    e.preventDefault();
    
    if (!novaAtividade.titulo || !novaAtividade.tipo || !novaAtividade.data || !novaAtividade.hora) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const novaAtividadeCompleta = {
      id: Date.now(),
      ...novaAtividade,
      data: `${novaAtividade.data} ${novaAtividade.hora}`,
      responsavel: 'Ana Costa',
      negocio: novaAtividade.negocioId ? negocios.find(n => n.id === parseInt(novaAtividade.negocioId))?.titulo : 'Atividade Geral'
    };

    setAtividadesRecentes(prev => [novaAtividadeCompleta, ...prev]);
    
    // Se associado a um negócio, incrementa o contador de atividades
    if (novaAtividade.negocioId) {
      setNegocios(prev => prev.map(deal => 
        deal.id === parseInt(novaAtividade.negocioId)
          ? { ...deal, atividades: deal.atividades + 1, ultimaAtualizacao: new Date().toISOString() }
          : deal
      ));
    }

    // Reset do form
    setNovaAtividade({
      titulo: '',
      descricao: '',
      tipo: 'ligacao',
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      negocioId: ''
    });
    
    setShowNovaAtividade(false);
    alert('Nova atividade criada com sucesso!');
  };

  const handleEmailClient = (deal) => {
    if (deal.email) {
      const subject = encodeURIComponent(`Sobre o negócio: ${deal.titulo}`);
      const body = encodeURIComponent(`Olá ${deal.contato},\n\nEspero que esteja bem. Gostaria de conversar sobre o negócio ${deal.titulo}.\n\nAguardo seu retorno.\n\nAtenciosamente,\n${deal.responsavel}`);
      window.open(`mailto:${deal.email}?subject=${subject}&body=${body}`, '_self');
    } else {
      alert('E-mail não disponível para este cliente');
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    
    const novaNota = {
      id: Date.now(),
      autor: 'Usuário Atual',
      data: new Date().toISOString().split('T')[0],
      conteudo: newNoteText,
      negocioId: selectedDeal.id
    };
    
    setNotas(prev => [...prev, novaNota]);
    setNewNoteText('');
    alert('Nota adicionada com sucesso!');
  };

  const handleEditNote = (noteId) => {
    const note = notas.find(n => n.id === noteId);
    if (note) {
      const newContent = prompt('Editar nota:', note.conteudo);
      if (newContent !== null) {
        setNotas(prev => prev.map(n => 
          n.id === noteId ? { ...n, conteudo: newContent } : n
        ));
        alert('Nota editada com sucesso!');
      }
    }
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      setNotas(prev => prev.filter(n => n.id !== noteId));
      alert('Nota excluída com sucesso!');
    }
  };

  const handleUpdateDealStage = (dealId, newStage) => {
    setNegocios(prev => prev.map(deal => 
      deal.id === dealId 
        ? { ...deal, estagio: newStage, ultimaAtualizacao: new Date().toISOString() }
        : deal
    ));
  };

  const handleUpdateDealProbability = (dealId, newProbability) => {
    setNegocios(prev => prev.map(deal => 
      deal.id === dealId 
        ? { ...deal, probabilidade: newProbability, ultimaAtualizacao: new Date().toISOString() }
        : deal
    ));
  };

  const handleDuplicateDeal = (deal) => {
    const duplicatedDeal = {
      ...deal,
      id: Date.now(),
      titulo: `${deal.titulo} (Cópia)`,
      dataCriacao: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
      atividades: 0,
      propostas: 0
    };
    setNegocios(prev => [...prev, duplicatedDeal]);
    alert('Negócio duplicado com sucesso!');
  };

  // Funções auxiliares
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return 'text-emerald-600 bg-emerald-50';
    if (probability >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'Alta': return 'text-red-600 bg-red-50 border-red-200';
      case 'Média': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Baixa': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const handleDragStart = (e, negocio) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(negocio));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, novoEstagio) => {
    e.preventDefault();
    const negocio = JSON.parse(e.dataTransfer.getData('text/plain'));

    setNegocios(prev => prev.map(n =>
      n.id === negocio.id
        ? { ...n, estagio: novoEstagio, ultimaAtualizacao: new Date().toISOString() }
        : n
    ));
  };

  return (
    <div className="gestao-negocios-page">
      {/* Header Principal */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Gestão de Negócios</h1>
            <p className="page-subtitle">Acompanhe seu pipeline de vendas e gerencie oportunidades</p>
            <div className="header-stats">
              <div className="stat-chip">
                <Target size={16} />
                <span>{stats.total} negócios</span>
              </div>
              <div className="stat-chip">
                <DollarSign size={16} />
                <span>{formatCurrency(stats.valorPonderado)} ponderado</span>
              </div>
              <div className="stat-chip">
                <TrendingUp size={16} />
                <span>{stats.probabilidadeMedia.toFixed(0)}% prob. média</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <div className="export-dropdown">
              <button 
                className="action-btn secondary" 
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download size={16} />
                Exportar
              </button>
              {showExportMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => handleExportData('JSON')}>
                    <FileText size={14} />
                    JSON
                  </button>
                  <button onClick={() => handleExportData('CSV')}>
                    <Download size={14} />
                    CSV
                  </button>
                  <button onClick={() => handleExportData('Excel')}>
                    <BarChart3 size={14} />
                    Excel
                  </button>
                </div>
              )}
            </div>
            <button 
              className="action-btn secondary" 
              onClick={handleRefreshData}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? 'spinning' : ''} />
              {isRefreshing ? 'Sincronizando...' : 'Sincronizar'}
            </button>
            <button 
              className="action-btn primary" 
              onClick={() => setShowNewDealModal(true)}
            >
              <Plus size={16} />
              Novo Negócio
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.valorTotal)}</div>
            <div className="stat-label">Pipeline Total</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +18% este mês
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.valorPonderado)}</div>
            <div className="stat-label">Valor Ponderado</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +12% este mês
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.probabilidadeMedia.toFixed(0)}%</div>
            <div className="stat-label">Prob. Média</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +5% este mês
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.valorMedio)}</div>
            <div className="stat-label">Ticket Médio</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +8% este mês
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
              placeholder="Buscar negócios, clientes ou contatos..."
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
            <option value="">Todos os Estágios</option>
            {estagios.map(estagio => (
              <option key={estagio.nome} value={estagio.nome}>{estagio.nome}</option>
            ))}
          </select>

          <select
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Selecionar Responsável</option>
            <option value="Ana Costa">Ana Costa</option>
            <option value="Bruno Silva">Bruno Silva</option>
            <option value="Carlos Mendes">Carlos Mendes</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="value">Ordenar por Valor</option>
            <option value="probability">Ordenar por Probabilidade</option>
            <option value="date">Última Atualização</option>
          </select>
        </div>

        <div className="view-controls">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <BarChart3 size={16} />
              Kanban
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FileText size={16} />
              Lista
            </button>
            <button
              className={`view-btn ${viewMode === 'chart' ? 'active' : ''}`}
              onClick={() => setViewMode('chart')}
            >
              <PieChart size={16} />
              Gráficos
            </button>
          </div>

          <button className="action-btn secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </div>

      {/* Resultado da Busca */}
      <div className="results-info">
        Mostrando {negociosFiltrados.length} de {negocios.length} negócios
      </div>

      {/* Visualização Principal */}
      {viewMode === 'kanban' && (
        <div className="kanban-container">
          <div className="kanban-board">
            {estagios.map(estagio => {
              const negociosEstagio = negociosFiltrados.filter(n => n.estagio === estagio.nome);
              const valorTotal = negociosEstagio.reduce((acc, n) => acc + n.valor, 0);

              return (
                <div
                  key={estagio.nome}
                  className="kanban-column"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, estagio.nome)}
                >
                  <div className="column-header" style={{ borderTopColor: estagio.cor }}>
                    <div className="column-title">
                      <estagio.icone size={20} style={{ color: estagio.cor }} />
                      <span>{estagio.nome}</span>
                      <div className="column-count">{negociosEstagio.length}</div>
                    </div>
                    <div className="column-value">{formatCurrency(valorTotal)}</div>
                    <p className="column-description">{estagio.descricao}</p>
                  </div>

                  <div className="column-content">
                    {negociosEstagio.map(negocio => (
                      <div
                        key={negocio.id}
                        className="negocio-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, negocio)}
                        onClick={() => setSelectedDeal(negocio)}
                      >
                        <div className="card-header">
                          <div className="client-avatar">
                            {negocio.avatar}
                          </div>
                          <div className="card-actions">
                            <button 
                              className="card-action-btn whatsapp-btn" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                handleWhatsAppClient(negocio);
                              }}
                              title="Conversar no WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </button>
                            <button 
                              className="card-action-btn" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                handleEmailClient(negocio);
                              }}
                              title="Enviar e-mail"
                            >
                              <Mail size={14} />
                            </button>
                            <div className="card-action-dropdown">
                              <button 
                                className="card-action-btn" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const menu = e.currentTarget.nextElementSibling;
                                  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                                }}
                                title="Mais opções"
                              >
                                <MoreVertical size={14} />
                              </button>
                              <div className="dropdown-menu-small">
                                <button onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSelectedDeal(negocio);
                                }}>
                                  <Eye size={12} />
                                  Ver detalhes
                                </button>
                                <button onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleDuplicateDeal(negocio);
                                }}>
                                  <Copy size={12} />
                                  Duplicar
                                </button>
                                <button onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleDeleteDeal(negocio.id);
                                }}>
                                  <Trash2 size={12} />
                                  Excluir
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card-content">
                          <h4 className="negocio-title">{negocio.titulo}</h4>
                          <p className="negocio-client">{negocio.cliente}</p>
                          <p className="negocio-contact">{negocio.contato}</p>

                          <div className="negocio-value">
                            <DollarSign size={16} />
                            <span>{formatCurrency(negocio.valor)}</span>
                          </div>

                          <div className="negocio-probability">
                            <div className={`probability-badge ${getProbabilityColor(negocio.probabilidade)}`}>
                              <Target size={12} />
                              {negocio.probabilidade}%
                            </div>
                            <div className={`priority-badge ${getPriorityColor(negocio.prioridade)}`}>
                              <Flag size={12} />
                              {negocio.prioridade}
                            </div>
                          </div>

                          <div className="negocio-meta">
                            <div className="meta-item">
                              <Calendar size={12} />
                              <span>{formatDate(negocio.dataFechamento)}</span>
                            </div>
                            <div className="meta-item">
                              <User size={12} />
                              <span>{negocio.responsavel}</span>
                            </div>
                          </div>

                          <div className="negocio-tags">
                            <span className="tag">{negocio.tag}</span>
                            <span className="segment-tag">{negocio.segmento}</span>
                          </div>
                        </div>

                        <div className="card-footer">
                          <div className="activity-count">
                            <Activity size={12} />
                            <span>{negocio.atividades} atividades</span>
                          </div>
                          <div className="progress-indicator">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${negocio.probabilidade}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="list-container">
          <div className="list-header">
            <div className="header-col">Negócio</div>
            <div className="header-col">Cliente</div>
            <div className="header-col">Valor</div>
            <div className="header-col">Probabilidade</div>
            <div className="header-col">Estágio</div>
            <div className="header-col">Responsável</div>
            <div className="header-col">Data Fechamento</div>
            <div className="header-col">Ações</div>
          </div>

          {negociosFiltrados.map(negocio => (
            <div key={negocio.id} className="list-row" onClick={() => setSelectedDeal(negocio)}>
              <div className="list-col">
                <div className="negocio-info">
                  <div className="client-avatar small">
                    {negocio.avatar}
                  </div>
                  <div>
                    <div className="negocio-title">{negocio.titulo}</div>
                    <div className="negocio-tag">{negocio.tag}</div>
                  </div>
                </div>
              </div>
              <div className="list-col">{negocio.cliente}</div>
              <div className="list-col">
                <div className="value-display">{formatCurrency(negocio.valor)}</div>
              </div>
              <div className="list-col">
                <div className={`probability-badge ${getProbabilityColor(negocio.probabilidade)}`}>
                  {negocio.probabilidade}%
                </div>
              </div>
              <div className="list-col">
                <div className="stage-badge" style={{ borderLeftColor: estagios.find(e => e.nome === negocio.estagio)?.cor }}>
                  {negocio.estagio}
                </div>
              </div>
              <div className="list-col">{negocio.responsavel}</div>
              <div className="list-col">{formatDate(negocio.dataFechamento)}</div>
              <div className="list-col actions">
                <button 
                  className="action-icon-btn" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const menu = e.currentTarget.nextElementSibling;
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                  }}
                  title="Mais opções"
                >
                  <MoreVertical size={14} />
                </button>
                <div className="dropdown-menu-small">
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedDeal(negocio);
                  }}>
                    <Eye size={12} />
                    Ver detalhes
                  </button>
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    handleCallClient(negocio);
                  }}>
                    <Phone size={12} />
                    Ligar
                  </button>
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    handleEmailClient(negocio);
                  }}>
                    <Mail size={12} />
                    E-mail
                  </button>
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDuplicateDeal(negocio);
                  }}>
                    <Copy size={12} />
                    Duplicar
                  </button>
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDeleteDeal(negocio.id);
                  }}>
                    <Trash2 size={12} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'chart' && (
        <div className="charts-container">
          <div className="charts-grid">
            {/* Distribuição por Estágio */}
            <div className="chart-card">
              <h3 className="chart-title">Distribuição por Estágio</h3>
              <div className="stage-distribution">
                {estagios.map(estagio => {
                  const count = negocios.filter(n => n.estagio === estagio.nome).length;
                  const percentage = (count / negocios.length) * 100;

                  return (
                    <div key={estagio.nome} className="stage-item">
                      <div className="stage-info">
                        <estagio.icone size={16} style={{ color: estagio.cor }} />
                        <span>{estagio.nome}</span>
                        <span className="stage-count">{count}</span>
                      </div>
                      <div className="stage-bar">
                        <div
                          className="stage-fill"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: estagio.cor
                          }}
                        ></div>
                      </div>
                      <span className="stage-percentage">{percentage.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Negócios */}
            <div className="chart-card">
              <h3 className="chart-title">Top 5 Negócios por Valor</h3>
              <div className="top-deals">
                {negocios
                  .sort((a, b) => b.valor - a.valor)
                  .slice(0, 5)
                  .map((negocio, index) => (
                    <div key={negocio.id} className="top-deal-item">
                      <div className="deal-rank">#{index + 1}</div>
                      <div className="deal-info">
                        <div className="deal-title">{negocio.titulo}</div>
                        <div className="deal-client">{negocio.cliente}</div>
                      </div>
                      <div className="deal-value">{formatCurrency(negocio.valor)}</div>
                      <div className={`deal-probability ${getProbabilityColor(negocio.probabilidade)}`}>
                        {negocio.probabilidade}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Performance por Responsável */}
            <div className="chart-card">
              <h3 className="chart-title">Performance por Responsável</h3>
              <div className="performance-chart">
                {['Ana Costa', 'Bruno Silva', 'Carlos Mendes'].map(responsavel => {
                  const negociosResp = negocios.filter(n => n.responsavel === responsavel);
                  const valorTotal = negociosResp.reduce((acc, n) => acc + n.valor, 0);
                  const probMedia = negociosResp.length > 0 ? negociosResp.reduce((acc, n) => acc + n.probabilidade, 0) / negociosResp.length : 0;

                  return (
                    <div key={responsavel} className="performance-item">
                      <div className="perf-header">
                        <div className="perf-name">{responsavel}</div>
                        <div className="perf-count">{negociosResp.length} negócios</div>
                      </div>
                      <div className="perf-metrics">
                        <div className="perf-metric">
                          <span className="metric-label">Valor Total</span>
                          <span className="metric-value">{formatCurrency(valorTotal)}</span>
                        </div>
                        <div className="perf-metric">
                          <span className="metric-label">Prob. Média</span>
                          <span className="metric-value">{probMedia?.toFixed(0) || 0}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Atividades Recentes */}
            <div className="chart-card">
              <h3 className="chart-title">Atividades Recentes</h3>
              <div className="activities-list">
                {atividadesRecentes.map(atividade => (
                  <div key={atividade.id} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(atividade.tipo)}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{atividade.titulo}</div>
                      <div className="activity-description">{atividade.descricao}</div>
                      <div className="activity-meta">
                        <span>{atividade.responsavel}</span>
                        <span>{atividade.data}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Negócio */}
      {selectedDeal && (
        <div className="modal-overlay" onClick={() => setSelectedDeal(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="deal-header-info">
                <div className="client-avatar large">
                  {selectedDeal.avatar}
                </div>
                <div className="deal-main-info">
                  <h2 className="deal-modal-title">{selectedDeal.titulo}</h2>
                  <p className="deal-modal-client">{selectedDeal.cliente}</p>
                  <p className="deal-modal-contact">{selectedDeal.contato}</p>
                  <div className="deal-modal-badges">
                    <span className="stage-badge" style={{ borderLeftColor: estagios.find(e => e.nome === selectedDeal.estagio)?.cor }}>
                      {selectedDeal.estagio}
                    </span>
                    <span className={`priority-badge ${getPriorityColor(selectedDeal.prioridade)}`}>
                      <Flag size={12} />
                      {selectedDeal.prioridade}
                    </span>
                    <span className="tag-badge">{selectedDeal.tag}</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="modal-action-btn primary whatsapp-btn"
                  onClick={() => handleWhatsAppClient(selectedDeal)}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
                <button 
                  className="modal-action-btn secondary"
                  onClick={() => handleEmailClient(selectedDeal)}
                >
                  <Mail size={16} />
                  E-mail
                </button>
                <button 
                  className="modal-action-btn secondary"
                  onClick={() => handleDuplicateDeal(selectedDeal)}
                >
                  <Copy size={16} />
                  Duplicar
                </button>
                <button className="close-btn" onClick={() => setSelectedDeal(null)}>
                  ×
                </button>
              </div>
            </div>

            {/* Navegação de Abas */}
            <div className="modal-tabs">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Eye size={16} />
                Visão Geral
              </button>
              <button
                className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                <Activity size={16} />
                Atividades
              </button>
              <button
                className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
                onClick={() => setActiveTab('proposals')}
              >
                <FileText size={16} />
                Propostas
              </button>
              <button
                className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <MessageSquare size={16} />
                Notas
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-content">
                  {/* Métricas Principais */}
                  <div className="overview-metrics">
                    <div className="metric-card">
                      <div className="metric-icon revenue">
                        <DollarSign size={20} />
                      </div>
                      <div className="metric-info">
                        <div className="metric-value">{formatCurrency(selectedDeal.valor)}</div>
                        <div className="metric-label">Valor do Negócio</div>
                        <div className="metric-detail">Valor total esperado</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon probability">
                        <Target size={20} />
                      </div>
                      <div className="metric-info">
                        <div className={`metric-value ${getProbabilityColor(selectedDeal.probabilidade).split(' ')[0]}`}>
                          {selectedDeal.probabilidade}%
                        </div>
                        <div className="metric-label">Probabilidade</div>
                        <div className="metric-detail">Chance de fechamento</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon days">
                        <Calendar size={20} />
                      </div>
                      <div className="metric-info">
                        <div className="metric-value">
                          {Math.ceil((new Date(selectedDeal.dataFechamento) - new Date()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="metric-label">Dias para Fechamento</div>
                        <div className="metric-detail">Data prevista</div>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Negócio */}
                  <div className="overview-sections">
                    <div className="info-section">
                      <h3 className="section-title">Informações do Cliente</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <Mail size={16} />
                          <div>
                            <div className="info-label">E-mail</div>
                            <div className="info-value">{selectedDeal.email}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Phone size={16} />
                          <div>
                            <div className="info-label">Telefone</div>
                            <div className="info-value">{selectedDeal.telefone}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Building size={16} />
                          <div>
                            <div className="info-label">Empresa</div>
                            <div className="info-value">{selectedDeal.empresa}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Users size={16} />
                          <div>
                            <div className="info-label">Funcionários</div>
                            <div className="info-value">{selectedDeal.funcionarios}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Globe size={16} />
                          <div>
                            <div className="info-label">Website</div>
                            <div className="info-value">
                              <a href={`https://${selectedDeal.website}`} target="_blank" rel="noopener noreferrer">
                                {selectedDeal.website}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="info-item">
                          <MapPin size={16} />
                          <div>
                            <div className="info-label">Localização</div>
                            <div className="info-value">{selectedDeal.endereco}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3 className="section-title">Detalhes do Negócio</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <User size={16} />
                          <div>
                            <div className="info-label">Responsável</div>
                            <div className="info-value">{selectedDeal.responsavel}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Calendar size={16} />
                          <div>
                            <div className="info-label">Data de Criação</div>
                            <div className="info-value">{formatDate(selectedDeal.dataCriacao)}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Clock size={16} />
                          <div>
                            <div className="info-label">Última Atualização</div>
                            <div className="info-value">{formatDate(selectedDeal.ultimaAtualizacao)}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Target size={16} />
                          <div>
                            <div className="info-label">Origem</div>
                            <div className="info-value">{selectedDeal.origem}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Briefcase size={16} />
                          <div>
                            <div className="info-label">Segmento</div>
                            <div className="info-value">{selectedDeal.segmento}</div>
                          </div>
                        </div>
                        <div className="info-item">
                          <Activity size={16} />
                          <div>
                            <div className="info-label">Atividades</div>
                            <div className="info-value">{selectedDeal.atividades}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="info-section full-width">
                      <h3 className="section-title">Observações e Próximas Ações</h3>
                      <div className="observations-content">
                        <div className="observation-item">
                          <h4>Observações:</h4>
                          <p>{selectedDeal.observacoes}</p>
                        </div>
                        <div className="next-action">
                          <h4>Próxima Ação:</h4>
                          <p>{selectedDeal.proximaAcao}</p>
                        </div>
                        <div className="competition-info">
                          <h4>Concorrentes:</h4>
                          <div className="competitors-list">
                            {selectedDeal.concorrentes.length > 0 ? (
                              selectedDeal.concorrentes.map((concorrente, index) => (
                                <span key={index} className="competitor-tag">{concorrente}</span>
                              ))
                            ) : (
                              <span className="no-competitors">Sem concorrentes identificados</span>
                            )}
                          </div>
                        </div>
                        <div className="motives-info">
                          <h4>Motivadores:</h4>
                          <div className="motives-list">
                            {selectedDeal.motivos.map((motivo, index) => (
                              <span key={index} className="motive-tag">{motivo}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="activity-content">
                  <div className="activity-header">
                    <h3 className="section-title">Timeline de Atividades</h3>
                    <button 
                      className="action-btn primary"
                      onClick={() => setShowNewActivityModal(true)}
                    >
                      <Plus size={16} />
                      Nova Atividade
                    </button>
                  </div>

                  <div className="activity-timeline">
                    {atividadesRecentes.map((atividade) => (
                      <div key={atividade.id} className="timeline-item">
                        <div className="timeline-marker">
                          {getActivityIcon(atividade.tipo)}
                        </div>
                        <div className="timeline-content">
                          <div className="activity-header">
                            <h4 className="activity-title">{atividade.titulo}</h4>
                            <span className="activity-date">{atividade.data}</span>
                          </div>
                          <p className="activity-description">{atividade.descricao}</p>
                          <div className="activity-footer">
                            <span className="activity-responsible">{atividade.responsavel}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'proposals' && (
                <div className="proposals-content">
                  <div className="proposals-header">
                    <h3 className="section-title">Propostas Enviadas</h3>
                    <button 
                      className="action-btn primary"
                      onClick={() => setShowNewProposalModal(true)}
                    >
                      <Plus size={16} />
                      Nova Proposta
                    </button>
                  </div>

                  <div className="proposals-list">
                    <div className="proposal-item">
                      <div className="proposal-header">
                        <h4 className="proposal-title">Proposta Inicial - v1.0</h4>
                        <span className="proposal-status active">Ativa</span>
                      </div>
                      <div className="proposal-details">
                        <div className="proposal-value">{formatCurrency(selectedDeal.valor)}</div>
                        <div className="proposal-date">Enviada em: {formatDate(selectedDeal.ultimaAtualizacao)}</div>
                        <div className="proposal-validity">Válida até: {formatDate(selectedDeal.dataFechamento)}</div>
                      </div>
                      <div className="proposal-actions">
                        <button className="proposal-btn">
                          <Eye size={14} />
                          Visualizar
                        </button>
                        <button className="proposal-btn">
                          <Download size={14} />
                          Download
                        </button>
                        <button className="proposal-btn">
                          <Edit size={14} />
                          Editar
                        </button>
                      </div>
                    </div>

                    {selectedDeal.propostas > 1 && (
                      <div className="proposal-item">
                        <div className="proposal-header">
                          <h4 className="proposal-title">Proposta Revisada - v2.0</h4>
                          <span className="proposal-status draft">Rascunho</span>
                        </div>
                        <div className="proposal-details">
                          <div className="proposal-value">{formatCurrency(selectedDeal.valor * 0.9)}</div>
                          <div className="proposal-date">Criada em: {formatDate(new Date())}</div>
                          <div className="proposal-validity">Em desenvolvimento</div>
                        </div>
                        <div className="proposal-actions">
                          <button className="proposal-btn">
                            <Edit size={14} />
                            Continuar Edição
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="notes-content">
                  <div className="notes-header">
                    <h3 className="section-title">Notas e Comentários</h3>
                    <button className="action-btn primary">
                      <Plus size={16} />
                      Adicionar Nota
                    </button>
                  </div>

                  <div className="notes-list">
                    {notas.filter(nota => nota.negocioId === selectedDeal.id).map(nota => (
                      <div key={nota.id} className="note-item">
                        <div className="note-header">
                          <div className="note-author">{nota.autor}</div>
                          <div className="note-date">{formatDate(nota.data)}</div>
                        </div>
                        <div className="note-content">
                          {nota.conteudo}
                        </div>
                        <div className="note-actions">
                          <button 
                            className="note-btn"
                            onClick={() => handleEditNote(nota.id)}
                          >
                            <Edit size={12} />
                            Editar
                          </button>
                          <button 
                            className="note-btn"
                            onClick={() => handleDeleteNote(nota.id)}
                          >
                            <Trash2 size={12} />
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="add-note-form">
                    <textarea
                      placeholder="Adicione uma nova nota sobre este negócio..."
                      className="note-textarea"
                      rows="3"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                    ></textarea>
                    <button 
                      className="action-btn primary"
                      onClick={handleAddNote}
                      disabled={!newNoteText.trim()}
                    >
                      <Send size={16} />
                      Adicionar Nota
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Negócio */}
      {showNewDealModal && (
        <div className="modal-overlay" onClick={() => setShowNewDealModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Novo Negócio</h2>
              <button className="close-btn" onClick={() => setShowNewDealModal(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleNewDealSubmit} className="new-deal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="titulo">Título do Negócio *</label>
                  <input
                    type="text"
                    id="titulo"
                    value={newDealForm.titulo}
                    onChange={(e) => setNewDealForm({...newDealForm, titulo: e.target.value})}
                    placeholder="Ex: Implementação de Sistema ERP"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cliente">Cliente *</label>
                  <input
                    type="text"
                    id="cliente"
                    value={newDealForm.cliente}
                    onChange={(e) => setNewDealForm({...newDealForm, cliente: e.target.value})}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contato">Contato *</label>
                  <input
                    type="text"
                    id="contato"
                    value={newDealForm.contato}
                    onChange={(e) => setNewDealForm({...newDealForm, contato: e.target.value})}
                    placeholder="Nome do contato principal"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    value={newDealForm.empresa}
                    onChange={(e) => setNewDealForm({...newDealForm, empresa: e.target.value})}
                    placeholder="Nome da empresa"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    value={newDealForm.email}
                    onChange={(e) => setNewDealForm({...newDealForm, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    value={newDealForm.telefone}
                    onChange={(e) => setNewDealForm({...newDealForm, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="valor">Valor do Negócio *</label>
                  <input
                    type="number"
                    id="valor"
                    value={newDealForm.valor}
                    onChange={(e) => setNewDealForm({...newDealForm, valor: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="probabilidade">Probabilidade (%)</label>
                  <input
                    type="range"
                    id="probabilidade"
                    min="0"
                    max="100"
                    value={newDealForm.probabilidade}
                    onChange={(e) => setNewDealForm({...newDealForm, probabilidade: parseInt(e.target.value)})}
                  />
                  <span className="range-value">{newDealForm.probabilidade}%</span>
                </div>

                <div className="form-group">
                  <label htmlFor="estagio">Estágio</label>
                  <select
                    id="estagio"
                    value={newDealForm.estagio}
                    onChange={(e) => setNewDealForm({...newDealForm, estagio: e.target.value})}
                  >
                    {estagios.map(estagio => (
                      <option key={estagio.nome} value={estagio.nome}>{estagio.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="responsavel">Responsável</label>
                  <select
                    id="responsavel"
                    value={newDealForm.responsavel}
                    onChange={(e) => setNewDealForm({...newDealForm, responsavel: e.target.value})}
                  >
                    <option value="Rosana">Rosana</option>
                    <option value="Ana Paula">Ana Paula</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dataFechamento">Data de Fechamento</label>
                  <input
                    type="date"
                    id="dataFechamento"
                    value={newDealForm.dataFechamento}
                    onChange={(e) => setNewDealForm({...newDealForm, dataFechamento: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="origem">Origem</label>
                  <select
                    id="origem"
                    value={newDealForm.origem}
                    onChange={(e) => setNewDealForm({...newDealForm, origem: e.target.value})}
                  >
                    <option value="Indicação">Indicação</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google">Google</option>
                    <option value="Ligação">Ligação</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="prioridade">Prioridade</label>
                  <select
                    id="prioridade"
                    value={newDealForm.prioridade}
                    onChange={(e) => setNewDealForm({...newDealForm, prioridade: e.target.value})}
                  >
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="segmento">Segmento</label>
                  <input
                    type="text"
                    id="segmento"
                    value={newDealForm.segmento}
                    onChange={(e) => setNewDealForm({...newDealForm, segmento: e.target.value})}
                    placeholder="Ex: Tecnologia, Consultoria, E-commerce"
                  />
                </div>



                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    value={newDealForm.website}
                    onChange={(e) => setNewDealForm({...newDealForm, website: e.target.value})}
                    placeholder="www.exemplo.com"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    type="text"
                    id="endereco"
                    value={newDealForm.endereco}
                    onChange={(e) => setNewDealForm({...newDealForm, endereco: e.target.value})}
                    placeholder="Cidade, Estado"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="observacoes">Observações</label>
                  <textarea
                    id="observacoes"
                    value={newDealForm.observacoes}
                    onChange={(e) => setNewDealForm({...newDealForm, observacoes: e.target.value})}
                    placeholder="Informações adicionais sobre o negócio..."
                    rows="3"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="proximaAcao">Próxima Ação</label>
                  <input
                    type="text"
                    id="proximaAcao"
                    value={newDealForm.proximaAcao}
                    onChange={(e) => setNewDealForm({...newDealForm, proximaAcao: e.target.value})}
                    placeholder="Ex: Agendar reunião de apresentação"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="action-btn secondary" onClick={() => setShowNewDealModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="action-btn primary">
                  <Plus size={16} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Atividade */}
      {showNovaAtividade && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nova Atividade</h2>
              <button
                onClick={() => setShowNovaAtividade(false)}
                className="close-button"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleNovaAtividade}>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={novaAtividade.titulo}
                  onChange={(e) => setNovaAtividade({...novaAtividade, titulo: e.target.value})}
                  placeholder="Título da atividade"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={novaAtividade.descricao}
                  onChange={(e) => setNovaAtividade({...novaAtividade, descricao: e.target.value})}
                  placeholder="Descrição da atividade"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={novaAtividade.tipo}
                  onChange={(e) => setNovaAtividade({...novaAtividade, tipo: e.target.value})}
                >
                  <option value="ligacao">Ligação</option>
                  <option value="reuniao">Reunião</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="visita">Visita</option>
                  <option value="proposta">Proposta</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={novaAtividade.data}
                  onChange={(e) => setNovaAtividade({...novaAtividade, data: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hora</label>
                <input
                  type="time"
                  value={novaAtividade.hora}
                  onChange={(e) => setNovaAtividade({...novaAtividade, hora: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Associar ao Negócio</label>
                <select
                  value={novaAtividade.negocioId}
                  onChange={(e) => setNovaAtividade({...novaAtividade, negocioId: e.target.value})}
                >
                  <option value="">Selecione um negócio</option>
                  {negocios.map(negocio => (
                    <option key={negocio.id} value={negocio.id}>
                      {negocio.nome} - {negocio.cliente}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowNovaAtividade(false)}>
                  Cancelar
                </button>
                <button type="submit">
                  Criar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Atividade (do popup) */}
      {showNewActivityModal && (
        <div className="modal-overlay" onClick={() => setShowNewActivityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Atividade</h2>
              <button
                onClick={() => setShowNewActivityModal(false)}
                className="close-button"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleNewActivitySubmit}>
              <div className="form-group">
                <label>Tipo de Atividade:</label>
                <select
                  value={newActivityForm.tipo}
                  onChange={(e) => setNewActivityForm(prev => ({ ...prev, tipo: e.target.value }))}
                  required
                >
                  <option value="call">Ligação</option>
                  <option value="email">Email</option>
                  <option value="meeting">Reunião</option>
                  <option value="task">Tarefa</option>
                  <option value="note">Nota</option>
                </select>
              </div>
              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  value={newActivityForm.titulo}
                  onChange={(e) => setNewActivityForm(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ex: Ligação para cliente..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição:</label>
                <textarea
                  value={newActivityForm.descricao}
                  onChange={(e) => setNewActivityForm(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição da atividade..."
                  rows={4}
                  required
                />
              </div>
              <div className="form-group">
                <label>Data:</label>
                <input
                  type="date"
                  value={newActivityForm.data}
                  onChange={(e) => setNewActivityForm(prev => ({ ...prev, data: e.target.value }))}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowNewActivityModal(false)}>
                  Cancelar
                </button>
                <button type="submit">
                  Criar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Proposta */}
      {showNewProposalModal && (
        <div className="modal-overlay" onClick={() => setShowNewProposalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Proposta</h2>
              <button
                onClick={() => setShowNewProposalModal(false)}
                className="close-button"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Funcionalidade de nova proposta será implementada em breve!');
              setShowNewProposalModal(false);
            }}>
              <div className="form-group">
                <label>Título da Proposta:</label>
                <input
                  type="text"
                  placeholder="Ex: Proposta Comercial v2.0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Valor:</label>
                <input
                  type="number"
                  placeholder="Ex: 50000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição:</label>
                <textarea
                  placeholder="Descrição da proposta..."
                  rows={4}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowNewProposalModal(false)}>
                  Cancelar
                </button>
                <button type="submit">
                  Criar Proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        /* Estilos Globais e Animações */
        .gestao-negocios-page {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .gestao-negocios-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03), transparent 50%),
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
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .page-header:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
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
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: left 0.6s ease;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
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

        .stat-icon.purple {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
          color: #8b5cf6;
        }

        .stat-icon.orange {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
          color: #f59e0b;
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

        /* Controles e Filtros */
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
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-filters {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          width: 1rem;
          height: 1rem;
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
          gap: 1rem;
          align-items: center;
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .view-btn.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        /* Resultado da Busca */
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

        /* Kanban Board */
        .kanban-container {
          position: relative;
          z-index: 1;
        }

        .kanban-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
        }

        .kanban-column {
          min-width: 280px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .kanban-column:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .column-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(8px);
          border-top: 4px solid;
          /* A cor será definida via inline style */
        }

        .column-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .column-title span {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
        }

        .column-count {
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: auto;
        }

        .column-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .column-description {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }

        .column-content {
          padding: 1rem;
          min-height: 200px;
          max-height: 600px;
          overflow-y: auto;
        }

        .column-content::-webkit-scrollbar {
          width: 4px;
        }

        .column-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .column-content::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 2px;
        }

        .column-content::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }

        /* Cards de Negócio */
        .negocio-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .negocio-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .negocio-card:hover::before {
          left: 100%;
        }

        .negocio-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: rgba(148, 163, 184, 0.5);
          background: rgba(248, 250, 252, 1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .client-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.8rem;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }

        .client-avatar.small {
          width: 2rem;
          height: 2rem;
          font-size: 0.7rem;
        }

        .client-avatar.large {
          width: 4rem;
          height: 4rem;
          font-size: 1.2rem;
        }

        .negocio-card:hover .client-avatar {
          transform: scale(1.1);
        }

        .card-actions {
          display: flex;
          gap: 0.25rem;
        }

        .card-action-btn {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 4px;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .card-action-btn.whatsapp-btn {
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          border: none;
        }

        .card-action-btn.whatsapp-btn:hover {
          background: linear-gradient(135deg, #128C7E, #25D366);
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
        }

        .modal-action-btn.whatsapp-btn {
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          border: none;
        }

        .modal-action-btn.whatsapp-btn:hover {
          background: linear-gradient(135deg, #128C7E, #25D366);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }

        .card-action-btn:hover {
          background: white;
          color: #3b82f6;
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
        }

        .card-content {
          position: relative;
          z-index: 2;
        }

        .negocio-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
          line-height: 1.3;
        }

        .negocio-client {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .negocio-contact {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }

        .negocio-value {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 1rem;
          font-weight: 700;
          color: #059669;
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 6px;
        }

        .negocio-probability {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          gap: 0.5rem;
        }

        .probability-badge,
        .priority-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid;
        }

        .text-emerald-600 {
          color: #059669;
        }

        .bg-emerald-50 {
          background-color: #ecfdf5;
        }

        .text-amber-600 {
          color: #d97706;
        }

        .bg-amber-50 {
          background-color: #fffbeb;
        }

        .text-red-600 {
          color: #dc2626;
        }

        .bg-red-50 {
          background-color: #fef2f2;
        }

        .border-red-200 {
          border-color: #fecaca;
        }

        .border-amber-200 {
          border-color: #fed7aa;
        }

        .text-green-600 {
          color: #16a34a;
        }

        .bg-green-50 {
          background-color: #f0fdf4;
        }

        .border-green-200 {
          border-color: #bbf7d0;
        }

        .text-gray-600 {
          color: #4b5563;
        }

        .bg-gray-50 {
          background-color: #f9fafb;
        }

        .border-gray-200 {
          border-color: #e5e7eb;
        }

        .negocio-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #64748b;
        }

        .negocio-tags {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .tag {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .segment-tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(226, 232, 240, 0.5);
        }

        .activity-count {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #64748b;
        }

        .progress-indicator {
          flex: 1;
          margin-left: 0.75rem;
        }

        .progress-bar {
          width: 100%;
          height: 3px;
          background: rgba(226, 232, 240, 0.5);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        /* Lista View */
        .list-container {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .list-header {
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding: 1rem 1.5rem;
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 120px;
          gap: 1rem;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
        }

        .header-col {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .header-col:hover {
          color: #3b82f6;
        }

        .list-row {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 120px;
          gap: 1rem;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .list-row:hover {
          background: rgba(59, 130, 246, 0.05);
          transform: translateX(4px);
          box-shadow: inset 4px 0 0 #3b82f6;
        }

        .list-row:last-child {
          border-bottom: none;
        }

        .list-col {
          font-size: 0.875rem;
          color: #1e293b;
        }

        .negocio-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .negocio-tag {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .value-display {
          font-weight: 700;
          color: #059669;
        }

        .stage-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(248, 250, 252, 0.8);
          border-left: 3px solid #3b82f6;
          backdrop-filter: blur(8px);
        }

        .list-col.actions {
          display: flex;
          gap: 0.25rem;
          justify-content: flex-end;
        }

        .action-icon-btn {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 4px;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .action-icon-btn:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Charts View */
        .charts-container {
          position: relative;
          z-index: 1;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .chart-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .stage-distribution {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stage-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stage-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 120px;
        }

        .stage-count {
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: auto;
        }

        .stage-bar {
          flex: 1;
          height: 8px;
          background: rgba(226, 232, 240, 0.5);
          border-radius: 4px;
          overflow: hidden;
        }

        .stage-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .stage-percentage {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
          min-width: 40px;
          text-align: right;
        }

        .top-deals {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .top-deal-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .top-deal-item:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateX(4px);
        }

        .deal-rank {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .deal-info {
          flex: 1;
        }

        .deal-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.125rem;
        }

        .deal-client {
          font-size: 0.75rem;
          color: #64748b;
        }

        .deal-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #059669;
        }

        .deal-probability {
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid;
        }

        .performance-chart {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .performance-item {
          padding: 1rem;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .performance-item:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .perf-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .perf-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .perf-count {
          font-size: 0.75rem;
          color: #64748b;
        }

        .perf-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .perf-metric {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        /* Ajuste duplicata */
        .perf-metric .metric-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 0;
        }
        
        .perf-metric .metric-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0;
        }
        
        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .activity-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateX(4px);
        }

        .activity-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* .activity-content foi movido para o modal */
        
        .activity-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .activity-description {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .activity-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.7rem;
          color: #94a3b8;
        }

        /* Modal de Detalhes */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: rgba(249, 250, 251, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          animation: slideUp 0.3s ease-out;
          display: flex;
          flex-direction: column;
        }

        .modal-content.large {
          max-width: 1200px;
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .deal-header-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
        }

        .deal-main-info {
          flex: 1;
        }

        .deal-modal-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .deal-modal-client {
          font-size: 1.1rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .deal-modal-contact {
          font-size: 0.9rem;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }

        .deal-modal-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .tag-badge {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .modal-action-btn {
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

        .modal-action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .modal-action-btn:hover::before {
          left: 100%;
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
          backdrop-filter: blur(10px);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .modal-action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          line-height: 1;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          transform: scale(1.1);
        }

        /* Navegação de Abas do Modal */
        .modal-tabs {
          display: flex;
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          overflow-x: auto;
          flex-shrink: 0;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          white-space: nowrap;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.5);
          color: #1e293b;
        }

        .tab-btn.active {
          background: rgba(255, 255, 255, 0.8);
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab-content {
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          flex-grow: 1;
        }

        .tab-content::-webkit-scrollbar {
          width: 6px;
        }

        .tab-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .tab-content::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }

        .tab-content::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }

        /* Conteúdo das Abas do Modal */
        .overview-content,
        .activity-content,
        .proposals-content,
        .notes-content {
          padding: 2rem;
        }

        .overview-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .metric-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          transition: all 0.3s ease;
        }

        .metric-icon.revenue {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
          color: #10b981;
        }

        .metric-icon.probability {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
          color: #3b82f6;
        }

        .metric-icon.expected {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
          color: #8b5cf6;
        }

        .metric-icon.days {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
          color: #f59e0b;
        }

        .metric-card:hover .metric-icon {
          transform: scale(1.1);
        }

        .metric-info {
          flex: 1;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        .metric-detail {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .overview-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .info-section {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
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
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateX(4px);
        }

        .info-item svg {
          color: #64748b;
          flex-shrink: 0;
        }

        .info-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .info-value {
          font-size: 0.875rem;
          color: #1e293b;
          font-weight: 500;
        }

        .info-value a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .info-value a:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        .observations-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .observation-item,
        .next-action,
        .competition-info,
        .motives-info {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }

        .observation-item h4,
        .next-action h4,
        .competition-info h4,
        .motives-info h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .observation-item p,
        .next-action p {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.5;
        }

        .competitors-list,
        .motives-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .competitor-tag {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .motive-tag {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .no-competitors {
          color: #94a3b8;
          font-style: italic;
          font-size: 0.8rem;
        }

        /* Conteúdo das Abas - Atividades (Modal) */
        .activity-content .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .activity-timeline {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .timeline-item {
          display: flex;
          gap: 1rem;
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 1rem;
          top: 2.5rem;
          width: 2px;
          height: calc(100% + 0.5rem);
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.3), transparent);
        }

        .timeline-marker {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 1;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .timeline-content {
          flex: 1;
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .timeline-content:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateX(8px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .timeline-content .activity-header {
          margin-bottom: 0.5rem;
        }

        .timeline-content .activity-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .activity-date {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .timeline-content .activity-description {
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .activity-footer {
          display: flex;
          justify-content: flex-end;
        }

        .activity-responsible {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
        }

        /* Conteúdo das Abas - Propostas */
        .proposals-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .proposals-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .proposal-item {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .proposal-item:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .proposal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .proposal-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .proposal-status {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .proposal-status.active {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .proposal-status.draft {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .proposal-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .proposal-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: #059669;
        }

        .proposal-date,
        .proposal-validity {
          font-size: 0.8rem;
          color: #64748b;
        }

        .proposal-actions {
          display: flex;
          gap: 0.75rem;
        }

        .proposal-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .proposal-btn:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Conteúdo das Abas - Notas */
        .notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .notes-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .note-item {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .note-item:hover {
          background: rgba(248, 250, 252, 1);
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .note-author {
          font-size: 0.8rem;
          font-weight: 700;
          color: #1e293b;
        }

        .note-date {
          font-size: 0.7rem;
          color: #64748b;
        }

        .note-content {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .note-actions {
          display: flex;
          gap: 0.5rem;
        }

        .note-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .note-btn:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .add-note-form {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .note-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #1e293b;
          font-size: 0.875rem;
          resize: vertical;
          min-height: 80px;
          transition: all 0.3s ease;
        }

        .note-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        /* Animações */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        /* Dropdown menus */
        .export-dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          z-index: 10;
          min-width: 150px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .dropdown-menu button {
          width: 100%;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #475569;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dropdown-menu button:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .dropdown-menu-small {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          z-index: 10;
          min-width: 120px;
          overflow: hidden;
          margin-top: 0.25rem;
        }

        .dropdown-menu-small button {
          width: 100%;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: none;
          border: none;
          color: #475569;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dropdown-menu-small button:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .card-action-dropdown {
          position: relative;
        }

        /* Formulário de Novo Negócio */
        .new-deal-form {
          padding: 2rem;
          max-height: 70vh;
          overflow-y: auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid rgba(209, 213, 219, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
          color: #374151;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(255, 255, 255, 0.95);
        }

        .form-group input[type="range"] {
          padding: 0;
          background: none;
          border: none;
          cursor: pointer;
        }

        .form-group input[type="range"]::-webkit-slider-track {
          background: rgba(209, 213, 219, 0.5);
          height: 4px;
          border-radius: 2px;
        }

        .form-group input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .range-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #3b82f6;
          text-align: center;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid rgba(209, 213, 219, 0.3);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        /* Responsividade */
        @media (max-width: 1400px) {
          .kanban-board {
            grid-template-columns: repeat(2, 1fr);
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1024px) {
          .gestao-negocios-page {
            padding: 1rem;
          }
          .header-content {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }
          .header-stats {
            justify-content: center;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .kanban-board {
            grid-template-columns: 1fr;
            gap: 1rem;
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
          .view-controls {
            justify-content: center;
          }
          .list-header,
          .list-row {
            grid-template-columns: 2fr 1fr 1fr 80px;
            gap: 0.5rem;
          }
          .list-header .header-col:nth-child(n + 5),
          .list-row .list-col:nth-child(n + 5) {
            display: none;
          }
          .list-header .header-col:last-child,
          .list-row .list-col:last-child {
            display: flex;
          }
          .overview-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
          .overview-sections {
            grid-template-columns: 1fr;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .proposal-details {
            grid-template-columns: 1fr;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.875rem;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .stat-card {
            padding: 1rem;
          }
          .negocio-card {
            padding: 0.75rem;
          }
          .card-header {
            flex-direction: row; /* Manter na mesma linha */
            align-items: center;
          }
          .modal-content {
            margin: 0.5rem;
            max-width: calc(100vw - 1rem);
            max-height: 95vh;
          }
          .modal-header {
            padding: 1.5rem;
            flex-direction: column;
            align-items: flex-start;
          }
          .deal-header-info {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }
          .modal-actions {
            flex-direction: row; /* Mudar para linha em telas menores */
            flex-wrap: wrap; /* Permitir quebra de linha */
            gap: 0.5rem;
            width: 100%;
          }
          .modal-action-btn {
            flex-grow: 1; /* Fazer botões crescerem */
            justify-content: center;
          }
          .close-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
          }
          .overview-metrics {
            grid-template-columns: 1fr;
          }
          .modal-tabs {
            flex-wrap: nowrap;
            justify-content: flex-start;
          }
          .tab-btn {
            padding: 0.75rem 1rem;
            font-size: 0.8rem;
          }
          .overview-content,
          .activity-content,
          .proposals-content,
          .notes-content {
            padding: 1rem;
          }
          .timeline-item:not(:last-child)::after {
            left: 1rem;
          }
        }

        @media (max-width: 480px) {
          .page-header,
          .controls-section,
          .kanban-column,
          .list-container,
          .chart-card {
            padding: 1rem;
          }
          .column-header {
            padding: 1rem;
          }
          .column-content {
            padding: 0.75rem;
          }
          .negocio-card {
            padding: 0.75rem;
          }
          .client-avatar {
            width: 2rem;
            height: 2rem;
            font-size: 0.7rem;
          }
          .modal-header {
            padding: 1rem;
          }
          .deal-modal-title {
            font-size: 1.25rem;
          }
          .metric-card,
          .info-item,
          .performance-item,
          .activity-item,
          .proposal-item,
          .note-item {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default GestaoNegocios;