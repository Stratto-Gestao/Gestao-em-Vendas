import React, { useState, useEffect } from 'react';
import {
  Users, Shield, UserPlus, SlidersHorizontal, BookOpen, GraduationCap, FileText,
  Gamepad2, Trophy, Gift, Target, BarChart3, TrendingUp, DollarSign, Briefcase,
  Building, Gavel, Settings, Download, Search, Edit, Trash2, Video,
  Library, Lock, Bot, Eye, X, Plus, Star, Type, Tag as TagIcon, Clock,
  Phone, MessageSquare, Mail, Activity, Zap, Award, ChevronRight, 
  Filter, RefreshCw, MoreVertical, Calendar, User, Globe, MapPin,
  AlertCircle, CheckCircle, PieChart
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { onSnapshot, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Função para resetar/excluir todos os dados do sistema
function ResetAllDataButton({ currentUser, userRole }) {
  const handleResetAllData = async () => {
    if (!currentUser || userRole !== 'SUPER_ADMIN') {
      alert(`Apenas SUPER_ADMIN pode executar esta ação. Seu role atual: ${userRole || 'undefined'}`);
      return;
    }
    if (!window.confirm('Tem certeza que deseja EXCLUIR TODOS os dados de negócio? Esta ação é irreversível! Os USUÁRIOS serão mantidos.')) return;
    try {
      // Coleções de dados de negócio a serem limpas (NÃO remove usuários)
      const colecoes = [
        'leads', 'negocios', 'modules', 'articles', 'scripts', 'coldCalls', 'whatsappScripts', 'objecoes', 'emailTemplates', 'courses'
      ];
      for (const col of colecoes) {
        const snap = await getDocs(collection(db, col));
        for (const d of snap.docs) {
          await deleteDoc(doc(db, col, d.id));
        }
      }
      alert('Todos os dados de negócio foram excluídos com sucesso!');
    } catch (error) {
      alert('Erro ao excluir dados: ' + error.message);
    }
  };

  return (
    <button 
      onClick={handleResetAllData}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Resetar Dados
    </button>
  );
}

function AdminPage() {
  const { currentUser, userRole } = useAuth();

  // States e funções do componente...
  const [modalState, setModalState] = useState({
    addUser: false,
    addModule: false,
    addArticle: false,
    addScript: false,
    addColdCall: false,
    addWhatsAppScript: false,
    addObjecoes: false,
    addEmailTemplate: false,
    addCourse: false,
    addCampanha: false,
    addMetaSemana: false,
    manageUsers: false,
    manageModules: false,
    manageArticles: false,
    manageScripts: false,
    manageColdCall: false,
    manageWhatsAppScript: false,
    manageObjecoes: false,
    manageEmailTemplate: false,
    manageCourse: false,
    manageCampanha: false,
    manageMetaSemana: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    usuarios: 0,
    modulos: 0,
    artigos: 0,
    scripts: 0,
    coldCalls: 0,
    whatsAppScripts: 0,
    objecoes: 0,
    emailTemplates: 0,
    courses: 0,
    campanhas: 0,
    metasSemana: 0
  });

  const [allModules, setAllModules] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [allScripts, setAllScripts] = useState([]);
  const [allColdCalls, setAllColdCalls] = useState([]);
  const [allWhatsAppScripts, setAllWhatsAppScripts] = useState([]);
  const [allObjecoes, setAllObjecoes] = useState([]);
  const [allEmailTemplates, setAllEmailTemplates] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allCampanhas, setAllCampanhas] = useState([]);
  const [allMetasSemana, setAllMetasSemana] = useState([]);

  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    difficulty: 'Básico',
    duration: '',
    author: '',
    points: '',
    category: 'Vendas',
    dateAdded: new Date().toISOString().split('T')[0]
  });

  const [newArticle, setNewArticle] = useState({
    title: '',
    description: '',
    author: '',
    category: 'Vendas',
    dateAdded: new Date().toISOString().split('T')[0]
  });

  const [newScript, setNewScript] = useState({
    title: '',
    description: '',
    department: 'Vendas',
    script: '',
    dateAdded: new Date().toISOString().split('T')[0]
  });

  const [newColdCall, setNewColdCall] = useState({
    title: '',
    description: '',
    difficulty: 'Básico',
    script: '',
    dateAdded: new Date().toISOString().split('T')[0]
  });

  const [newWhatsAppScript, setNewWhatsAppScript] = useState({
    title: '',
    description: '',
    difficulty: 'Básico',
    funnelStage: 'Prospecção',
    script: '',
    dateAdded: new Date().toISOString().split('T')[0]
  });

  const [newObjecoes, setNewObjecoes] = useState({
    title: '',
    description: '',
    difficulty: 'Básico',
    type: 'Preço',
    objection: '',
    argument: '',
    dateAdded: new Date().toISOString().split('T')[0]
  });

  const [newEmailTemplate, setNewEmailTemplate] = useState({
    title: '',
    description: '',
    difficulty: 'Básico',
    type: 'Prospecção',
    template: '',
    dateAdded: new Date().toISOString().split('T')[0]
  });

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    difficulty: 'Básico',
    modules: '',
    dateAdded: new Date().toISOString().split('T')[0]
  });

  const [newCampanha, setNewCampanha] = useState({
    titulo: '',
    descricao: '',
    tipo: 'Prospecção',
    status: 'ativa',
    dataInicio: '',
    dataFim: '',
    meta: '',
    progresso: 0,
    vendedoresParticipantes: 0
  });

  const [newMetaSemana, setNewMetaSemana] = useState({
    titulo: '',
    descricao: '',
    semanaInicio: '',
    semanaFim: '',
    metaVendasRealizadas: 0,
    metaValorVendas: 0,
    vendasRealizadas: 0,
    valorVendas: 0,
    progresso: 0,
    status: 'ativa'
  });

  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [currentScriptId, setCurrentScriptId] = useState(null);
  const [currentColdCallId, setCurrentColdCallId] = useState(null);
  const [currentWhatsAppScriptId, setCurrentWhatsAppScriptId] = useState(null);
  const [currentObjecoesId, setCurrentObjecoesId] = useState(null);
  const [currentEmailTemplateId, setCurrentEmailTemplateId] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [currentCampanhaId, setCurrentCampanhaId] = useState(null);
  const [currentMetaSemanaId, setCurrentMetaSemanaId] = useState(null);

  useEffect(() => {
    // Carregar dados do localStorage ou Firebase
    const loadAllData = () => {
      // Carregar módulos
      const modulesData = JSON.parse(localStorage.getItem('modules-admin') || '[]');
      setAllModules(modulesData);

      // Carregar artigos
      const articlesData = JSON.parse(localStorage.getItem('articles-admin') || '[]');
      setAllArticles(articlesData);

      // Carregar scripts
      const scriptsData = JSON.parse(localStorage.getItem('scripts-admin') || '[]');
      setAllScripts(scriptsData);

      // Carregar cold calls
      const coldCallsData = JSON.parse(localStorage.getItem('coldCalls-admin') || '[]');
      setAllColdCalls(coldCallsData);

      // Carregar whatsapp scripts
      const whatsAppScriptsData = JSON.parse(localStorage.getItem('whatsAppScripts-admin') || '[]');
      setAllWhatsAppScripts(whatsAppScriptsData);

      // Carregar objeções
      const objecoesData = JSON.parse(localStorage.getItem('objecoes-admin') || '[]');
      setAllObjecoes(objecoesData);

      // Carregar templates de email
      const emailTemplatesData = JSON.parse(localStorage.getItem('emailTemplates-admin') || '[]');
      setAllEmailTemplates(emailTemplatesData);

      // Carregar cursos
      const coursesData = JSON.parse(localStorage.getItem('courses-admin') || '[]');
      setAllCourses(coursesData);

      // Carregar campanhas
      const campanhasData = JSON.parse(localStorage.getItem('campanhas-admin') || '[]');
      setAllCampanhas(campanhasData);

      // Carregar metas da semana
      const metasSemanaData = JSON.parse(localStorage.getItem('metas-semana-admin') || '[]');
      setAllMetasSemana(metasSemanaData);

      // Atualizar stats
      setStats({
        usuarios: 5, // Exemplo
        modulos: modulesData.length,
        artigos: articlesData.length,
        scripts: scriptsData.length,
        coldCalls: coldCallsData.length,
        whatsAppScripts: whatsAppScriptsData.length,
        objecoes: objecoesData.length,
        emailTemplates: emailTemplatesData.length,
        courses: coursesData.length,
        campanhas: campanhasData.length,
        metasSemana: metasSemanaData.length
      });
    };

    loadAllData();
  }, []);

  const handleOpenModal = (modalType, editing = false, item = null) => {
    setModalState(prev => ({ ...prev, [modalType]: true }));
    setIsEditing(editing);
    
    if (editing && item) {
      switch (modalType) {
        case 'addModule':
          setNewModule(item);
          setCurrentModuleId(item.id);
          break;
        case 'addArticle':
          setNewArticle(item);
          setCurrentArticleId(item.id);
          break;
        case 'addScript':
          setNewScript(item);
          setCurrentScriptId(item.id);
          break;
        case 'addColdCall':
          setNewColdCall(item);
          setCurrentColdCallId(item.id);
          break;
        case 'addWhatsAppScript':
          setNewWhatsAppScript(item);
          setCurrentWhatsAppScriptId(item.id);
          break;
        case 'addObjecoes':
          setNewObjecoes(item);
          setCurrentObjecoesId(item.id);
          break;
        case 'addEmailTemplate':
          setNewEmailTemplate(item);
          setCurrentEmailTemplateId(item.id);
          break;
        case 'addCourse':
          setNewCourse(item);
          setCurrentCourseId(item.id);
          break;
        case 'addCampanha':
          setNewCampanha(item);
          setCurrentCampanhaId(item.id);
          break;
        case 'addMetaSemana':
          setNewMetaSemana(item);
          setCurrentMetaSemanaId(item.id);
          break;
      }
    }
  };

  const handleCloseModals = () => {
    setModalState({
      addUser: false,
      addModule: false,
      addArticle: false,
      addScript: false,
      addColdCall: false,
      addWhatsAppScript: false,
      addObjecoes: false,
      addEmailTemplate: false,
      addCourse: false,
      addCampanha: false,
      addMetaSemana: false,
      manageUsers: false,
      manageModules: false,
      manageArticles: false,
      manageScripts: false,
      manageColdCall: false,
      manageWhatsAppScript: false,
      manageObjecoes: false,
      manageEmailTemplate: false,
      manageCourse: false,
      manageCampanha: false,
      manageMetaSemana: false
    });
    setIsEditing(false);
    
    // Reset forms
    setNewModule({
      title: '',
      description: '',
      difficulty: 'Básico',
      duration: '',
      author: '',
      points: '',
      category: 'Vendas',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setNewArticle({
      title: '',
      description: '',
      author: '',
      category: 'Vendas',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setNewScript({
      title: '',
      description: '',
      department: 'Vendas',
      script: '',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setNewColdCall({
      title: '',
      description: '',
      difficulty: 'Básico',
      script: '',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setNewWhatsAppScript({
      title: '',
      description: '',
      difficulty: 'Básico',
      funnelStage: 'Prospecção',
      script: '',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setNewObjecoes({
      title: '',
      description: '',
      difficulty: 'Básico',
      type: 'Preço',
      objection: '',
      argument: '',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setNewEmailTemplate({
      title: '',
      description: '',
      difficulty: 'Básico',
      type: 'Prospecção',
      template: '',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setNewCourse({
      title: '',
      description: '',
      instructor: '',
      duration: '',
      difficulty: 'Básico',
      modules: '',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setNewCampanha({
      titulo: '',
      descricao: '',
      tipo: 'Prospecção',
      status: 'ativa',
      dataInicio: '',
      dataFim: '',
      meta: '',
      progresso: 0,
      vendedoresParticipantes: 0
    });
    setNewMetaSemana({
      titulo: '',
      descricao: '',
      semanaInicio: '',
      semanaFim: '',
      metaVendasRealizadas: 0,
      metaValorVendas: 0,
      vendasRealizadas: 0,
      valorVendas: 0,
      progresso: 0,
      status: 'ativa'
    });
  };

  // Handlers para salvar dados
  const handleSaveModule = async (e) => {
    e.preventDefault();
    const moduleData = {
      ...newModule,
      type: 'module',
      category: 'Treinamento',
      readTime: newModule.duration,
      rating: 4.8,
      icon: '🎥',
      tags: ['módulo', 'treinamento', 'vendas'],
      dateAdded: newModule.dateAdded || new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingModules = JSON.parse(localStorage.getItem('modules-admin') || '[]');
        const updatedModules = existingModules.map(module => 
          module.id === currentModuleId ? { ...moduleData, id: currentModuleId } : module
        );
        localStorage.setItem('modules-admin', JSON.stringify(updatedModules));
        setAllModules(updatedModules);
        alert("Módulo atualizado com sucesso!");
      } else {
        const moduleWithId = {
          ...moduleData,
          id: Date.now().toString()
        };
        
        const existingModules = JSON.parse(localStorage.getItem('modules-admin') || '[]');
        const updatedModules = [...existingModules, moduleWithId];
        localStorage.setItem('modules-admin', JSON.stringify(updatedModules));
        setAllModules(updatedModules);
        alert("Módulo adicionado com sucesso!");
      }
      
      setStats(prev => ({ ...prev, modulos: JSON.parse(localStorage.getItem('modules-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar módulo.");
      console.error(error);
    }
  };

  const handleDeleteModule = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este módulo?")) {
      try {
        const existingModules = JSON.parse(localStorage.getItem('modules-admin') || '[]');
        const updatedModules = existingModules.filter(module => module.id !== id);
        localStorage.setItem('modules-admin', JSON.stringify(updatedModules));
        setAllModules(updatedModules);
        setStats(prev => ({ ...prev, modulos: updatedModules.length }));
        alert("Módulo removido com sucesso!");
      } catch (error) {
        alert("Erro ao deletar módulo.");
        console.error(error);
      }
    }
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    const articleData = {
      ...newArticle,
      type: 'article',
      category: 'Conhecimento',
      readTime: '5 min',
      rating: 4.7,
      icon: '📄',
      tags: ['artigo', 'conhecimento', 'vendas'],
      dateAdded: newArticle.dateAdded || new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingArticles = JSON.parse(localStorage.getItem('articles-admin') || '[]');
        const updatedArticles = existingArticles.map(article => 
          article.id === currentArticleId ? { ...articleData, id: currentArticleId } : article
        );
        localStorage.setItem('articles-admin', JSON.stringify(updatedArticles));
        setAllArticles(updatedArticles);
        alert("Artigo atualizado com sucesso!");
      } else {
        const articleWithId = {
          ...articleData,
          id: Date.now().toString()
        };
        
        const existingArticles = JSON.parse(localStorage.getItem('articles-admin') || '[]');
        const updatedArticles = [...existingArticles, articleWithId];
        localStorage.setItem('articles-admin', JSON.stringify(updatedArticles));
        setAllArticles(updatedArticles);
        alert("Artigo adicionado com sucesso!");
      }
      
      setStats(prev => ({ ...prev, artigos: JSON.parse(localStorage.getItem('articles-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar artigo.");
      console.error(error);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este artigo?")) {
      try {
        const existingArticles = JSON.parse(localStorage.getItem('articles-admin') || '[]');
        const updatedArticles = existingArticles.filter(article => article.id !== id);
        localStorage.setItem('articles-admin', JSON.stringify(updatedArticles));
        setAllArticles(updatedArticles);
        setStats(prev => ({ ...prev, artigos: updatedArticles.length }));
        alert("Artigo removido com sucesso!");
      } catch (error) {
        alert("Erro ao deletar artigo.");
        console.error(error);
      }
    }
  };

  const handleSaveScript = async (e) => {
    e.preventDefault();
    const scriptData = {
      ...newScript,
      type: 'script',
      category: 'Comunicação',
      readTime: '3 min',
      rating: 4.6,
      icon: '💬',
      tags: ['script', 'comunicação', 'vendas'],
      dateAdded: newScript.dateAdded || new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingScripts = JSON.parse(localStorage.getItem('scripts-admin') || '[]');
        const updatedScripts = existingScripts.map(script => 
          script.id === currentScriptId ? { ...scriptData, id: currentScriptId } : script
        );
        localStorage.setItem('scripts-admin', JSON.stringify(updatedScripts));
        setAllScripts(updatedScripts);
        alert("Script atualizado com sucesso!");
      } else {
        const scriptWithId = {
          ...scriptData,
          id: Date.now().toString()
        };
        
        const existingScripts = JSON.parse(localStorage.getItem('scripts-admin') || '[]');
        const updatedScripts = [...existingScripts, scriptWithId];
        localStorage.setItem('scripts-admin', JSON.stringify(updatedScripts));
        setAllScripts(updatedScripts);
        alert("Script adicionado com sucesso!");
      }
      
      setStats(prev => ({ ...prev, scripts: JSON.parse(localStorage.getItem('scripts-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar script.");
      console.error(error);
    }
  };

  const handleDeleteScript = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este script?")) {
      try {
        const existingScripts = JSON.parse(localStorage.getItem('scripts-admin') || '[]');
        const updatedScripts = existingScripts.filter(script => script.id !== id);
        localStorage.setItem('scripts-admin', JSON.stringify(updatedScripts));
        setAllScripts(updatedScripts);
        setStats(prev => ({ ...prev, scripts: updatedScripts.length }));
        alert("Script removido com sucesso!");
      } catch (error) {
        alert("Erro ao deletar script.");
        console.error(error);
      }
    }
  };

  const handleSaveColdCall = async (e) => {
    e.preventDefault();
    const coldCallData = {
      ...newColdCall,
      type: 'coldCall',
      category: 'Cold Call',
      readTime: '6 min',
      rating: 4.4,
      icon: '📞',
      tags: ['cold call', 'prospecção', 'vendas'],
      dateAdded: newColdCall.dateAdded || new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingColdCalls = JSON.parse(localStorage.getItem('coldCalls-admin') || '[]');
        const updatedColdCalls = existingColdCalls.map(coldCall => 
          coldCall.id === currentColdCallId ? { ...coldCallData, id: currentColdCallId } : coldCall
        );
        localStorage.setItem('coldCalls-admin', JSON.stringify(updatedColdCalls));
        setAllColdCalls(updatedColdCalls);
        alert("Cold Call atualizado com sucesso!");
      } else {
        const coldCallWithId = {
          ...coldCallData,
          id: Date.now().toString()
        };
        
        const existingColdCalls = JSON.parse(localStorage.getItem('coldCalls-admin') || '[]');
        const updatedColdCalls = [...existingColdCalls, coldCallWithId];
        localStorage.setItem('coldCalls-admin', JSON.stringify(updatedColdCalls));
        setAllColdCalls(updatedColdCalls);
        alert("Cold Call adicionado com sucesso!");
      }
      
      setStats(prev => ({ ...prev, coldCalls: JSON.parse(localStorage.getItem('coldCalls-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar cold call.");
      console.error(error);
    }
  };

  const handleDeleteColdCall = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar esta técnica de cold call?")) {
      try {
        const existingColdCalls = JSON.parse(localStorage.getItem('coldCalls-admin') || '[]');
        const updatedColdCalls = existingColdCalls.filter(coldCall => coldCall.id !== id);
        localStorage.setItem('coldCalls-admin', JSON.stringify(updatedColdCalls));
        setAllColdCalls(updatedColdCalls);
        setStats(prev => ({ ...prev, coldCalls: updatedColdCalls.length }));
        alert("Cold Call removido com sucesso!");
      } catch (error) {
        alert("Erro ao deletar cold call.");
        console.error(error);
      }
    }
  };

  const handleSaveWhatsAppScript = async (e) => {
    e.preventDefault();
    const whatsAppScriptData = {
      ...newWhatsAppScript,
      type: 'whatsAppScript',
      category: 'WhatsApp',
      readTime: '4 min',
      rating: 4.3,
      icon: '💬',
      tags: ['whatsapp', 'script', 'vendas'],
      dateAdded: newWhatsAppScript.dateAdded || new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingWhatsAppScripts = JSON.parse(localStorage.getItem('whatsAppScripts-admin') || '[]');
        const updatedWhatsAppScripts = existingWhatsAppScripts.map(script => 
          script.id === currentWhatsAppScriptId ? { ...whatsAppScriptData, id: currentWhatsAppScriptId } : script
        );
        localStorage.setItem('whatsAppScripts-admin', JSON.stringify(updatedWhatsAppScripts));
        setAllWhatsAppScripts(updatedWhatsAppScripts);
        alert("Script WhatsApp atualizado com sucesso!");
      } else {
        const whatsAppScriptWithId = {
          ...whatsAppScriptData,
          id: Date.now().toString()
        };
        
        const existingWhatsAppScripts = JSON.parse(localStorage.getItem('whatsAppScripts-admin') || '[]');
        const updatedWhatsAppScripts = [...existingWhatsAppScripts, whatsAppScriptWithId];
        localStorage.setItem('whatsAppScripts-admin', JSON.stringify(updatedWhatsAppScripts));
        setAllWhatsAppScripts(updatedWhatsAppScripts);
        alert("Script WhatsApp adicionado com sucesso!");
      }
      
      setStats(prev => ({ ...prev, whatsAppScripts: JSON.parse(localStorage.getItem('whatsAppScripts-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar script WhatsApp.");
      console.error(error);
    }
  };

  const handleDeleteWhatsAppScript = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este script WhatsApp?")) {
      try {
        const existingWhatsAppScripts = JSON.parse(localStorage.getItem('whatsAppScripts-admin') || '[]');
        const updatedWhatsAppScripts = existingWhatsAppScripts.filter(script => script.id !== id);
        localStorage.setItem('whatsAppScripts-admin', JSON.stringify(updatedWhatsAppScripts));
        setAllWhatsAppScripts(updatedWhatsAppScripts);
        setStats(prev => ({ ...prev, whatsAppScripts: updatedWhatsAppScripts.length }));
        alert("Script WhatsApp removido com sucesso!");
      } catch (error) {
        alert("Erro ao deletar script WhatsApp.");
        console.error(error);
      }
    }
  };

  const handleSaveObjecoes = async (e) => {
    e.preventDefault();
    const objecoesData = {
      ...newObjecoes,
      type: 'objecoes',
      category: 'Objeções',
      readTime: '5 min',
      rating: 4.8,
      icon: '🛡️',
      tags: ['objeções', 'argumentação', 'vendas'],
      dateAdded: newObjecoes.dateAdded || new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingObjecoes = JSON.parse(localStorage.getItem('objecoes-admin') || '[]');
        const updatedObjecoes = existingObjecoes.map(objecao => 
          objecao.id === currentObjecoesId ? { ...objecoesData, id: currentObjecoesId } : objecao
        );
        localStorage.setItem('objecoes-admin', JSON.stringify(updatedObjecoes));
        setAllObjecoes(updatedObjecoes);
        alert("Objeção atualizada com sucesso!");
      } else {
        const objecaoWithId = {
          ...objecoesData,
          id: Date.now().toString()
        };
        
        const existingObjecoes = JSON.parse(localStorage.getItem('objecoes-admin') || '[]');
        const updatedObjecoes = [...existingObjecoes, objecaoWithId];
        localStorage.setItem('objecoes-admin', JSON.stringify(updatedObjecoes));
        setAllObjecoes(updatedObjecoes);
        alert("Objeção adicionada com sucesso!");
      }
      
      setStats(prev => ({ ...prev, objecoes: JSON.parse(localStorage.getItem('objecoes-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar objeção.");
      console.error(error);
    }
  };

  const handleDeleteObjecoes = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar esta objeção?")) {
      try {
        const existingObjecoes = JSON.parse(localStorage.getItem('objecoes-admin') || '[]');
        const updatedObjecoes = existingObjecoes.filter(objecao => objecao.id !== id);
        localStorage.setItem('objecoes-admin', JSON.stringify(updatedObjecoes));
        setAllObjecoes(updatedObjecoes);
        setStats(prev => ({ ...prev, objecoes: updatedObjecoes.length }));
        alert("Objeção removida com sucesso!");
      } catch (error) {
        alert("Erro ao deletar objeção.");
        console.error(error);
      }
    }
  };

  const handleSaveEmailTemplate = async (e) => {
    e.preventDefault();
    const emailData = {
      ...newEmailTemplate,
      type: 'email',
      category: 'Comunicação',
      readTime: '4 min',
      rating: 4.5,
      icon: '✉️',
      tags: ['email', 'templates', 'comunicação'],
      dateAdded: newEmailTemplate.dateAdded || new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingEmailTemplates = JSON.parse(localStorage.getItem('emailTemplates-admin') || '[]');
        const updatedEmailTemplates = existingEmailTemplates.map(template => 
          template.id === currentEmailTemplateId ? { ...emailData, id: currentEmailTemplateId } : template
        );
        localStorage.setItem('emailTemplates-admin', JSON.stringify(updatedEmailTemplates));
        setAllEmailTemplates(updatedEmailTemplates);
        alert("Template de email atualizado com sucesso!");
      } else {
        const emailWithId = {
          ...emailData,
          id: Date.now().toString()
        };
        
        const existingEmailTemplates = JSON.parse(localStorage.getItem('emailTemplates-admin') || '[]');
        const updatedEmailTemplates = [...existingEmailTemplates, emailWithId];
        localStorage.setItem('emailTemplates-admin', JSON.stringify(updatedEmailTemplates));
        setAllEmailTemplates(updatedEmailTemplates);
        alert("Template de email adicionado com sucesso!");
      }
      
      setStats(prev => ({ ...prev, emailTemplates: JSON.parse(localStorage.getItem('emailTemplates-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar template de email.");
      console.error(error);
    }
  };

  const handleDeleteEmailTemplate = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este template de email?")) {
      try {
        const existingEmailTemplates = JSON.parse(localStorage.getItem('emailTemplates-admin') || '[]');
        const updatedEmailTemplates = existingEmailTemplates.filter(template => template.id !== id);
        localStorage.setItem('emailTemplates-admin', JSON.stringify(updatedEmailTemplates));
        setAllEmailTemplates(updatedEmailTemplates);
        setStats(prev => ({ ...prev, emailTemplates: updatedEmailTemplates.length }));
        alert("Template de email removido com sucesso!");
      } catch (error) {
        alert("Erro ao deletar template de email.");
        console.error(error);
      }
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const courseData = {
      ...newCourse,
      type: 'course',
      category: 'Metodologia',
      readTime: newCourse.duration,
      rating: 4.9,
      icon: '🎓',
      tags: ['curso', 'treinamento', 'metodologia'],
      dateAdded: newCourse.dateAdded || new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingCourses = JSON.parse(localStorage.getItem('courses-admin') || '[]');
        const updatedCourses = existingCourses.map(course => 
          course.id === currentCourseId ? { ...courseData, id: currentCourseId } : course
        );
        localStorage.setItem('courses-admin', JSON.stringify(updatedCourses));
        setAllCourses(updatedCourses);
        alert("Curso atualizado com sucesso!");
      } else {
        const courseWithId = {
          ...courseData,
          id: Date.now().toString()
        };
        
        const existingCourses = JSON.parse(localStorage.getItem('courses-admin') || '[]');
        const updatedCourses = [...existingCourses, courseWithId];
        localStorage.setItem('courses-admin', JSON.stringify(updatedCourses));
        setAllCourses(updatedCourses);
        alert("Curso adicionado com sucesso!");
      }
      
      setStats(prev => ({ ...prev, courses: JSON.parse(localStorage.getItem('courses-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar curso.");
      console.error(error);
    }
  };

  const handleSaveCampanha = async (e) => {
    e.preventDefault();
    const campanhaData = {
      ...newCampanha,
      id: isEditing ? currentCampanhaId : Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingCampanhas = JSON.parse(localStorage.getItem('campanhas-admin') || '[]');
        const updatedCampanhas = existingCampanhas.map(campanha => 
          campanha.id === currentCampanhaId ? campanhaData : campanha
        );
        localStorage.setItem('campanhas-admin', JSON.stringify(updatedCampanhas));
        setAllCampanhas(updatedCampanhas);
        alert("Campanha atualizada com sucesso!");
      } else {
        const existingCampanhas = JSON.parse(localStorage.getItem('campanhas-admin') || '[]');
        const updatedCampanhas = [...existingCampanhas, campanhaData];
        localStorage.setItem('campanhas-admin', JSON.stringify(updatedCampanhas));
        setAllCampanhas(updatedCampanhas);
        alert("Campanha adicionada com sucesso!");
      }
      
      setStats(prev => ({ ...prev, campanhas: JSON.parse(localStorage.getItem('campanhas-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar campanha.");
      console.error(error);
    }
  };

  const handleDeleteCampanha = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar esta campanha?")) {
      try {
        const existingCampanhas = JSON.parse(localStorage.getItem('campanhas-admin') || '[]');
        const updatedCampanhas = existingCampanhas.filter(campanha => campanha.id !== id);
        localStorage.setItem('campanhas-admin', JSON.stringify(updatedCampanhas));
        setAllCampanhas(updatedCampanhas);
        setStats(prev => ({ ...prev, campanhas: updatedCampanhas.length }));
        alert("Campanha removida com sucesso!");
      } catch (error) {
        alert("Erro ao deletar campanha.");
        console.error(error);
      }
    }
  };

  const handleSaveMetaSemana = async (e) => {
    e.preventDefault();
    const metaSemanaData = {
      ...newMetaSemana,
      id: isEditing ? currentMetaSemanaId : Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        const existingMetas = JSON.parse(localStorage.getItem('metas-semana-admin') || '[]');
        const updatedMetas = existingMetas.map(meta => 
          meta.id === currentMetaSemanaId ? metaSemanaData : meta
        );
        localStorage.setItem('metas-semana-admin', JSON.stringify(updatedMetas));
        setAllMetasSemana(updatedMetas);
        alert("Meta da semana atualizada com sucesso!");
      } else {
        const existingMetas = JSON.parse(localStorage.getItem('metas-semana-admin') || '[]');
        const updatedMetas = [...existingMetas, metaSemanaData];
        localStorage.setItem('metas-semana-admin', JSON.stringify(updatedMetas));
        setAllMetasSemana(updatedMetas);
        alert("Meta da semana adicionada com sucesso!");
      }
      
      setStats(prev => ({ ...prev, metasSemana: JSON.parse(localStorage.getItem('metas-semana-admin') || '[]').length }));
      handleCloseModals();
    } catch (error) {
      alert("Erro ao salvar meta da semana.");
      console.error(error);
    }
  };

  const handleDeleteMetaSemana = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar esta meta da semana?")) {
      try {
        const existingMetas = JSON.parse(localStorage.getItem('metas-semana-admin') || '[]');
        const updatedMetas = existingMetas.filter(m => m.id !== id);
        localStorage.setItem('metas-semana-admin', JSON.stringify(updatedMetas));
        
        // Atualizar estado local
        setAllMetasSemana(updatedMetas);
        setStats(prev => ({ ...prev, metasSemana: updatedMetas.length }));
        
        alert("Meta da semana removida com sucesso!");
      } catch (error) {
        alert("Erro ao remover meta da semana.");
        console.error(error);
      }
    }
  };

  const handleDeleteCourse = async (id) => {
      if (window.confirm("Tem certeza que deseja apagar este curso?")) {
          try {
              const existingCourses = JSON.parse(localStorage.getItem('courses-admin') || '[]');
              const updatedCourses = existingCourses.filter(course => course.id !== id);
              localStorage.setItem('courses-admin', JSON.stringify(updatedCourses));
              setAllCourses(updatedCourses);
              setStats(prev => ({ ...prev, courses: updatedCourses.length }));
              alert("Curso removido com sucesso!");
          } catch (error) {
              alert("Erro ao deletar curso.");
              console.error(error);
          }
      }
  };

  return (
    <div className="admin-container">
      {/* Header Principal com Design Moderno */}
      <div className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <div className="title-section">
              <h1 className="admin-title">
                <Shield className="title-icon" size={32} />
                Painel Administrativo
              </h1>
              <p className="admin-subtitle">Centro de controle completo da plataforma de vendas</p>
              <div className="header-badges">
                <div className="status-badge online">
                  <div className="status-dot"></div>
                  Sistema Online
                </div>
                <div className="time-badge">
                  <Clock size={14} />
                  Última atualização: agora
                </div>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn secondary" onClick={() => window.location.reload()}>
              <RefreshCw size={18} />
              <span>Atualizar</span>
            </button>
            <button className="action-btn primary" onClick={() => handleOpenModal('addUser')}>
              <UserPlus size={18} />
              <span>Novo Usuário</span>
            </button>
            <ResetAllDataButton currentUser={currentUser} userRole={userRole} />
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas com Design Glassmorphism */}
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-background">
            <Users className="background-icon" />
          </div>
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.usuarios}</div>
            <div className="stat-label">Usuários Ativos</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +8% este mês
            </div>
          </div>
          <div className="stat-actions">
            <button className="stat-action-btn" onClick={() => handleOpenModal('addUser')}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="stat-card modules">
          <div className="stat-background">
            <GraduationCap className="background-icon" />
          </div>
          <div className="stat-icon">
            <GraduationCap size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.modulos}</div>
            <div className="stat-label">Módulos na Academia</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +12% este mês
            </div>
          </div>
          <div className="stat-actions">
            <button className="stat-action-btn" onClick={() => handleOpenModal('addModule')}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="stat-card articles">
          <div className="stat-background">
            <FileText className="background-icon" />
          </div>
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.artigos}</div>
            <div className="stat-label">Artigos Publicados</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +5% este mês
            </div>
          </div>
          <div className="stat-actions">
            <button className="stat-action-btn" onClick={() => handleOpenModal('addArticle')}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="stat-card scripts">
          <div className="stat-background">
            <BookOpen className="background-icon" />
          </div>
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.scripts + stats.coldCalls + stats.whatsAppScripts + stats.objecoes + stats.emailTemplates}</div>
            <div className="stat-label">Scripts & Templates</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +15% este mês
            </div>
          </div>
          <div className="stat-actions">
            <button className="stat-action-btn">
              <MoreVertical size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Seção de Gestão com Cards Modernos */}
      <div className="management-section">
        <div className="section-header">
          <h2 className="section-title">
            <Settings size={24} />
            Gestão da Plataforma
          </h2>
          <p className="section-subtitle">Controle completo de todos os recursos e conteúdos</p>
        </div>

        <div className="management-grid">
          {/* Card de Usuários */}
          <div className="management-card users-card">
            <div className="card-header">
              <div className="card-icon-wrapper users">
                <Shield size={28} />
              </div>
              <div className="card-badge">
                <span>{stats.usuarios}</span>
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Usuários & Permissões</h3>
              <p className="card-description">Gerencie membros da equipe, defina permissões e controle acessos</p>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-value">{stats.usuarios}</span>
                  <span className="metric-label">Usuários</span>
                </div>
                <div className="metric">
                  <span className="metric-value">3</span>
                  <span className="metric-label">Perfis</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-btn primary" onClick={() => handleOpenModal('addUser')}>
                <UserPlus size={16} />
                Novo Usuário
              </button>
              <button className="card-btn secondary" onClick={() => alert("Gerenciar permissões (a implementar)")}>
                <SlidersHorizontal size={16} />
                Permissões
              </button>
            </div>
          </div>

          {/* Card da Academia */}
          <div className="management-card academy-card">
            <div className="card-header">
              <div className="card-icon-wrapper academy">
                <Library size={28} />
              </div>
              <div className="card-badge">
                <span>{stats.modulos + stats.artigos + stats.courses}</span>
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Academia & Conteúdo</h3>
              <p className="card-description">Central de treinamento com módulos, artigos e cursos especializados</p>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-value">{stats.modulos}</span>
                  <span className="metric-label">Módulos</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{stats.artigos}</span>
                  <span className="metric-label">Artigos</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{stats.courses}</span>
                  <span className="metric-label">Cursos</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-btn primary" onClick={() => handleOpenModal('addModule')}>
                <Video size={16} />
                Novo Módulo
              </button>
              <button className="card-btn secondary" onClick={() => handleOpenModal('manageModules')}>
                <Settings size={16} />
                Gerenciar
              </button>
            </div>
            <div className="card-quick-actions">
              <button className="quick-action-btn" onClick={() => handleOpenModal('addCourse')} title="Novo Curso">
                <GraduationCap size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('addArticle')} title="Novo Artigo">
                <FileText size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('manageCourse')} title="Gerenciar Cursos">
                <Settings size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('manageArticles')} title="Gerenciar Artigos">
                <Edit size={14} />
              </button>
            </div>
          </div>

          {/* Card de Scripts & Templates */}
          <div className="management-card scripts-card">
            <div className="card-header">
              <div className="card-icon-wrapper scripts">
                <MessageSquare size={28} />
              </div>
              <div className="card-badge">
                <span>{stats.coldCalls + stats.whatsAppScripts + stats.objecoes + stats.emailTemplates}</span>
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Scripts & Templates</h3>
              <p className="card-description">Biblioteca completa de scripts, objeções e templates de comunicação</p>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-value">{stats.coldCalls}</span>
                  <span className="metric-label">Cold Calls</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{stats.whatsAppScripts}</span>
                  <span className="metric-label">WhatsApp</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{stats.objecoes}</span>
                  <span className="metric-label">Objeções</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{stats.emailTemplates}</span>
                  <span className="metric-label">E-mails</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-btn primary" onClick={() => handleOpenModal('addColdCall')}>
                <Phone size={16} />
                Cold Call
              </button>
              <button className="card-btn secondary" onClick={() => handleOpenModal('manageColdCall')}>
                <Settings size={16} />
                Gerenciar
              </button>
            </div>
            <div className="card-quick-actions">
              <button className="quick-action-btn" onClick={() => handleOpenModal('addWhatsAppScript')} title="Script WhatsApp">
                <MessageSquare size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('addObjecoes')} title="Nova Objeção">
                <Shield size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('addEmailTemplate')} title="Template Email">
                <Mail size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('manageEmailTemplate')} title="Gerenciar Email Templates">
                <Settings size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('manageScripts')} title="Gerenciar Scripts">
                <Edit size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('manageWhatsAppScript')} title="Gerenciar WhatsApp">
                <MessageSquare size={14} />
              </button>
              <button className="quick-action-btn" onClick={() => handleOpenModal('manageObjecoes')} title="Gerenciar Objeções">
                <Shield size={14} />
              </button>
            </div>
          </div>

          {/* Card de Gamificação */}
          <div className="management-card gamification-card">
            <div className="card-header">
              <div className="card-icon-wrapper gamification">
                <Gamepad2 size={28} />
              </div>
              <div className="card-badge soon">
                <span>Em Breve</span>
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Gamificação</h3>
              <p className="card-description">Sistema de pontos, medalhas, missões e recompensas para motivar a equipe</p>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-value">0</span>
                  <span className="metric-label">Missões</span>
                </div>
                <div className="metric">
                  <span className="metric-value">0</span>
                  <span className="metric-label">Medalhas</span>
                </div>
                <div className="metric">
                  <span className="metric-value">0</span>
                  <span className="metric-label">Recompensas</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-btn primary disabled" onClick={() => alert("Funcionalidade em desenvolvimento")}>
                <Target size={16} />
                Nova Missão
              </button>
              <button className="card-btn secondary disabled" onClick={() => alert("Funcionalidade em desenvolvimento")}>
                <Trophy size={16} />
                Medalhas
              </button>
            </div>
          </div>

          {/* Card de Analytics */}
          <div className="management-card analytics-card">
            <div className="card-header">
              <div className="card-icon-wrapper analytics">
                <BarChart3 size={28} />
              </div>
              <div className="card-badge trend">
                <TrendingUp size={12} />
                <span>+12%</span>
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Analytics & Relatórios</h3>
              <p className="card-description">Dashboards avançados e relatórios detalhados de performance</p>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-value">15</span>
                  <span className="metric-label">Relatórios</span>
                </div>
                <div className="metric">
                  <span className="metric-value">24/7</span>
                  <span className="metric-label">Monitoring</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-btn primary" onClick={() => alert("Dashboard de analytics (a implementar)")}>
                <PieChart size={16} />
                Dashboard
              </button>
              <button className="card-btn secondary" onClick={() => alert("Exportar dados (a implementar)")}>
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>

          {/* Card de Pipeline */}
          <div className="management-card pipeline-card">
            <div className="card-header">
              <div className="card-icon-wrapper pipeline">
                <TrendingUp size={28} />
              </div>
              <div className="card-badge">
                <span>Live</span>
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Pipeline de Vendas</h3>
              <p className="card-description">Monitoramento em tempo real de leads, negócios e conversões da equipe</p>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-value">347</span>
                  <span className="metric-label">Leads</span>
                </div>
                <div className="metric">
                  <span className="metric-value">89</span>
                  <span className="metric-label">Negócios</span>
                </div>
                <div className="metric">
                  <span className="metric-value">68%</span>
                  <span className="metric-label">Taxa Conv.</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-btn primary" onClick={() => alert("Ver pipeline completo (a implementar)")}>
                <Eye size={16} />
                Ver Pipeline
              </button>
              <button className="card-btn secondary" onClick={() => alert("Configurações de pipeline (a implementar)")}>
                <Settings size={16} />
                Configurar
              </button>
            </div>
          </div>

          {/* Card de Campanhas */}
          <div className="management-card campaigns-card">
            <div className="card-header">
              <div className="card-icon-wrapper campaigns">
                <Target size={28} />
              </div>
              <div className="card-badge">
                <span>{stats.campanhas || 0}</span>
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Campanhas de Vendas</h3>
              <p className="card-description">Gerencie campanhas promocionais, prospecção e reativação de clientes</p>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-value">{stats.campanhas || 0}</span>
                  <span className="metric-label">Campanhas</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{allCampanhas.filter(c => c.status === 'ativa').length}</span>
                  <span className="metric-label">Ativas</span>
                </div>
                <div className="metric">
                  <span className="metric-value">75%</span>
                  <span className="metric-label">Efetividade</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-btn primary" onClick={() => handleOpenModal('addCampanha')}>
                <Plus size={16} />
                Nova Campanha
              </button>
              <button className="card-btn secondary" onClick={() => handleOpenModal('manageCampaigns')}>
                <Settings size={16} />
                Gerenciar
              </button>
            </div>
          </div>

          {/* Card de Metas da Semana */}
          <div className="management-card metas-semana-card">
            <div className="card-header">
              <div className="card-icon-wrapper metas-semana">
                <Calendar size={28} />
              </div>
              <div className="card-badge">
                <span>{stats.metasSemana || 0}</span>
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Metas da Semana</h3>
              <p className="card-description">Defina e acompanhe metas semanais de vendas, valor e clientes</p>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-value">{stats.metasSemana || 0}</span>
                  <span className="metric-label">Metas</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{allMetasSemana.filter(m => m.status === 'ativa').length}</span>
                  <span className="metric-label">Ativas</span>
                </div>
                <div className="metric">
                  <span className="metric-value">
                    {allMetasSemana.length > 0 ? 
                      Math.round(allMetasSemana.reduce((acc, meta) => acc + meta.progresso, 0) / allMetasSemana.length) : 0}%
                  </span>
                  <span className="metric-label">Progresso</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-btn primary" onClick={() => handleOpenModal('addMetaSemana')}>
                <Plus size={16} />
                Nova Meta
              </button>
              <button className="card-btn secondary" onClick={() => handleOpenModal('manageMetasSemana')}>
                <Settings size={16} />
                Gerenciar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Atividade Recente */}
      <div className="activity-section">
        <div className="section-header">
          <h2 className="section-title">
            <Activity size={24} />
            Atividade Recente
          </h2>
          <button className="view-all-btn">
            <span>Ver Tudo</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="activity-grid">
          <div className="activity-card">
            <div className="activity-icon users">
              <Users size={20} />
            </div>
            <div className="activity-content">
              <h4 className="activity-title">Novo usuário adicionado</h4>
              <p className="activity-description">João Silva foi adicionado como SDR</p>
              <span className="activity-time">Há 5 minutos</span>
            </div>
            <div className="activity-status success">
              <CheckCircle size={16} />
            </div>
          </div>

          <div className="activity-card">
            <div className="activity-icon modules">
              <Video size={20} />
            </div>
            <div className="activity-content">
              <h4 className="activity-title">Módulo publicado</h4>
              <p className="activity-description">"Técnicas Avançadas de Cold Call" adicionado</p>
              <span className="activity-time">Há 2 horas</span>
            </div>
            <div className="activity-status success">
              <CheckCircle size={16} />
            </div>
          </div>

          <div className="activity-card">
            <div className="activity-icon scripts">
              <MessageSquare size={20} />
            </div>
            <div className="activity-content">
              <h4 className="activity-title">Script atualizado</h4>
              <p className="activity-description">Template de follow-up foi modificado</p>
              <span className="activity-time">Há 4 horas</span>
            </div>
            <div className="activity-status warning">
              <AlertCircle size={16} />
            </div>
          </div>

          <div className="activity-card">
            <div className="activity-icon analytics">
              <BarChart3 size={20} />
            </div>
            <div className="activity-content">
              <h4 className="activity-title">Relatório gerado</h4>
              <p className="activity-description">Relatório mensal de performance criado</p>
              <span className="activity-time">Ontem</span>
            </div>
            <div className="activity-status success">
              <CheckCircle size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Todos os modais existentes... */}
      {modalState.addUser && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Adicionar Novo Usuário</h3>
                <p className="modal-subtitle">Preencha as informações do novo membro da equipe</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Nome Completo
                  </label>
                  <input 
                    type="text" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                    className="form-input"
                    placeholder="Digite o nome completo"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={newUser.email} 
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                    className="form-input"
                    placeholder="email@empresa.com"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Lock size={16} />
                    Senha Provisória
                  </label>
                  <input 
                    type="password" 
                    value={newUser.password} 
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                    className="form-input"
                    placeholder="Mínimo 6 caracteres"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Briefcase size={16} />
                    Cargo
                  </label>
                  <input 
                    type="text" 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})} 
                    className="form-input"
                    placeholder="Ex: SDR, Vendedor, Manager"
                    required 
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Building size={16} />
                    Departamento
                  </label>
                  <input 
                    type="text" 
                    value={newUser.department} 
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})} 
                    className="form-input"
                    placeholder="Ex: Vendas, Marketing, Suporte"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <UserPlus size={16} />
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para adicionar módulo */}
      {modalState.addModule && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Módulo' : 'Adicionar Novo Módulo'}</h3>
                <p className="modal-subtitle">Configure o conteúdo educacional para a Academia</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveModule} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Type size={16} />
                    Título do Módulo
                  </label>
                  <input 
                    type="text" 
                    value={newModule.title} 
                    onChange={(e) => setNewModule({...newModule, title: e.target.value})} 
                    className="form-input"
                    placeholder="Ex: Técnicas Avançadas de Cold Call"
                    required 
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Descrição
                  </label>
                  <textarea 
                    rows="3" 
                    value={newModule.description} 
                    onChange={(e) => setNewModule({...newModule, description: e.target.value})} 
                    className="form-textarea"
                    placeholder="Descreva o conteúdo e objetivos do módulo..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Target size={16} />
                    Dificuldade
                  </label>
                  <select 
                    value={newModule.difficulty} 
                    onChange={(e) => setNewModule({...newModule, difficulty: e.target.value})}
                    className="form-select"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Autor/Instrutor
                  </label>
                  <input 
                    type="text" 
                    value={newModule.author} 
                    onChange={(e) => setNewModule({...newModule, author: e.target.value})} 
                    className="form-input"
                    placeholder="Nome do instrutor"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Clock size={16} />
                    Duração
                  </label>
                  <input 
                    type="text" 
                    value={newModule.duration} 
                    onChange={(e) => setNewModule({...newModule, duration: e.target.value})} 
                    className="form-input"
                    placeholder="Ex: 15:30"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Award size={16} />
                    Pontos por Conclusão
                  </label>
                  <input 
                    type="number" 
                    value={newModule.points} 
                    onChange={(e) => setNewModule({...newModule, points: Number(e.target.value)})} 
                    className="form-input"
                    min="0"
                    placeholder="10"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <TagIcon size={16} />
                    Tags (separadas por vírgula)
                  </label>
                  <input 
                    type="text" 
                    value={newModule.tags} 
                    onChange={(e) => setNewModule({...newModule, tags: e.target.value})} 
                    className="form-input"
                    placeholder="vendas, cold call, técnicas, prospecção"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Video size={16} />
                    Link do Vídeo
                  </label>
                  <input 
                    type="url" 
                    value={newModule.videoLink} 
                    onChange={(e) => setNewModule({...newModule, videoLink: e.target.value})} 
                    className="form-input"
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                  <div className="form-hint">
                    <AlertCircle size={14} />
                    Este link será usado quando o usuário clicar em "Assistir" na Academia
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <Video size={16} />
                  {isEditing ? 'Atualizar Módulo' : 'Criar Módulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar módulos */}
      {modalState.manageModules && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Módulos</h3>
                <p className="modal-subtitle">Visualize, edite ou remova módulos da Academia</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allModules.length > 0 ? allModules.map((module) => (
                <div key={module.id} className="content-item">
                  <div className="content-icon">
                    <Video size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{module.title}</h4>
                    <div className="content-meta">
                      <span className="meta-badge difficulty">{module.difficulty}</span>
                      <span className="meta-item">
                        <Clock size={12} />
                        {module.duration}
                      </span>
                      <span className="meta-item">
                        <User size={12} />
                        {module.author}
                      </span>
                      <span className="meta-item">
                        <Award size={12} />
                        {module.points} pts
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addModule', true, module)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteObjecoes(item.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Shield size={48} />
                  <h3>Nenhuma objeção encontrada</h3>
                  <p>Comece criando sua primeira objeção e argumentação</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addObjecoes')}>
                    <Plus size={16} />
                    Criar Primeira Objeção
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar Email Template */}
      {modalState.addEmailTemplate && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Template de Email' : 'Novo Template de Email'}</h3>
                <p className="modal-subtitle">Crie templates de email para diferentes situações</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEmailTemplate} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Type size={16} />
                    Nome do Template
                  </label>
                  <input 
                    type="text" 
                    value={newEmailTemplate.title} 
                    onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, title: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Follow-up pós-reunião"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <TagIcon size={16} />
                    Tipo
                  </label>
                  <select 
                    value={newEmailTemplate.type} 
                    onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="Prospecção">Prospecção</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Apresentação">Apresentação</option>
                    <option value="Proposta">Proposta</option>
                    <option value="Agradecimento">Agradecimento</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <BarChart3 size={16} />
                    Dificuldade
                  </label>
                  <select 
                    value={newEmailTemplate.difficulty} 
                    onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, difficulty: e.target.value })}
                    className="form-select"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Mail size={16} />
                    Assunto
                  </label>
                  <input 
                    type="text" 
                    value={newEmailTemplate.subject} 
                    onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, subject: e.target.value })} 
                    className="form-input"
                    placeholder="Assunto do email..."
                    required 
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Corpo do Email
                  </label>
                  <textarea 
                    rows="8" 
                    value={newEmailTemplate.body} 
                    onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, body: e.target.value })} 
                    className="form-textarea"
                    placeholder="Olá [nome],..."
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <Mail size={16} />
                  {isEditing ? 'Atualizar Template' : 'Criar Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar Email Templates */}
      {modalState.manageEmailTemplate && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Templates de Email</h3>
                <p className="modal-subtitle">Visualize, edite ou remova templates de email</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allEmailTemplates.length > 0 ? allEmailTemplates.map((item) => (
                <div key={item.id} className="content-item">
                  <div className="content-icon">
                    <Mail size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{item.title}</h4>
                    <div className="content-meta">
                      <span className="meta-badge difficulty">{item.difficulty}</span>
                      <span className="meta-item">
                        <TagIcon size={12} />
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addEmailTemplate', true, item)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteEmailTemplate(item.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Mail size={48} />
                  <h3>Nenhum template encontrado</h3>
                  <p>Comece criando seu primeiro template de email</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addEmailTemplate')}>
                    <Plus size={16} />
                    Criar Primeiro Template
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar Curso */}
      {modalState.addCourse && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Curso' : 'Novo Curso'}</h3>
                <p className="modal-subtitle">Crie cursos estruturados para treinamento da equipe</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCourse} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Type size={16} />
                    Nome do Curso
                  </label>
                  <input 
                    type="text" 
                    value={newCourse.title} 
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Metodologia SPIN Selling"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Clock size={16} />
                    Duração
                  </label>
                  <input 
                    type="text" 
                    value={newCourse.duration} 
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: 25 min"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Instrutor
                  </label>
                  <input 
                    type="text" 
                    value={newCourse.instructor} 
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })} 
                    className="form-input"
                    placeholder="Nome do instrutor"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <BarChart3 size={16} />
                    Dificuldade
                  </label>
                  <select 
                    value={newCourse.difficulty} 
                    onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                    className="form-select"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <BookOpen size={16} />
                    Nº de Módulos
                  </label>
                  <input 
                    type="text" 
                    value={newCourse.modules} 
                    onChange={(e) => setNewCourse({ ...newCourse, modules: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: 5 módulos"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Descrição
                  </label>
                  <textarea 
                    rows="3" 
                    value={newCourse.description} 
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} 
                    className="form-textarea"
                    placeholder="Descrição completa do curso..."
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <GraduationCap size={16} />
                  {isEditing ? 'Atualizar Curso' : 'Criar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar Cursos */}
      {modalState.manageCourse && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Cursos</h3>
                <p className="modal-subtitle">Visualize, edite ou remova cursos da plataforma</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allCourses.length > 0 ? allCourses.map((item) => (
                <div key={item.id} className="content-item">
                  <div className="content-icon">
                    <GraduationCap size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{item.title}</h4>
                    <div className="content-meta">
                      <span className="meta-badge difficulty">{item.difficulty}</span>
                      <span className="meta-item">
                        <Clock size={12} />
                        {item.duration}
                      </span>
                      <span className="meta-item">
                        <User size={12} />
                        {item.instructor}
                      </span>
                      <span className="meta-item">
                        <BookOpen size={12} />
                        {item.modules}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addCourse', true, item)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteCourse(item.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <GraduationCap size={48} />
                  <h3>Nenhum curso encontrado</h3>
                  <p>Comece criando seu primeiro curso estruturado</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addCourse')}>
                    <Plus size={16} />
                    Criar Primeiro Curso
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para gerenciar módulos */}
      {modalState.manageModules && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Módulos</h3>
                <p className="modal-subtitle">Visualize, edite ou remova módulos de treinamento</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allModules.length > 0 ? allModules.map((module) => (
                <div key={module.id} className="content-item">
                  <div className="content-icon">
                    <Video size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{module.title}</h4>
                    <div className="content-meta">
                      <span className="meta-badge difficulty">{module.difficulty}</span>
                      <span className="meta-item">
                        <Clock size={12} />
                        {module.duration}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addModule', true, module)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteModule(module.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Video size={48} />
                  <h3>Nenhum módulo encontrado</h3>
                  <p>Comece criando seu primeiro módulo de treinamento</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addModule')}>
                    <Plus size={16} />
                    Criar Primeiro Módulo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar artigo */}
      {modalState.addArticle && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Artigo' : 'Adicionar Novo Artigo'}</h3>
                <p className="modal-subtitle">Crie conteúdo educacional em formato de artigo</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveArticle} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Type size={16} />
                    Título do Artigo
                  </label>
                  <input 
                    type="text" 
                    value={newArticle.title} 
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Melhores Práticas de Prospecção"
                    required 
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Conteúdo do Artigo
                  </label>
                  <textarea 
                    rows="10" 
                    value={newArticle.content} 
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })} 
                    className="form-textarea"
                    placeholder="Escreva o conteúdo completo do artigo..."
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <FileText size={16} />
                  {isEditing ? 'Atualizar Artigo' : 'Publicar Artigo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar artigos */}
      {modalState.manageArticles && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Artigos</h3>
                <p className="modal-subtitle">Visualize, edite ou remova artigos publicados</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allArticles.length > 0 ? allArticles.map((article) => (
                <div key={article.id} className="content-item">
                  <div className="content-icon">
                    <FileText size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{article.title}</h4>
                    <div className="content-meta">
                      <span className="meta-item">
                        <Calendar size={12} />
                        {article.dateAdded}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addArticle', true, article)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteArticle(article.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <FileText size={48} />
                  <h3>Nenhum artigo encontrado</h3>
                  <p>Comece criando seu primeiro artigo educacional</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addArticle')}>
                    <Plus size={16} />
                    Criar Primeiro Artigo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar script */}
      {modalState.addScript && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Script' : 'Adicionar Novo Script'}</h3>
                <p className="modal-subtitle">Crie scripts de vendas para a equipe</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveScript} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Type size={16} />
                    Título do Script
                  </label>
                  <input 
                    type="text" 
                    value={newScript.title} 
                    onChange={(e) => setNewScript({ ...newScript, title: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Script de Apresentação Inicial"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Building size={16} />
                    Departamento
                  </label>
                  <input 
                    type="text" 
                    value={newScript.department} 
                    onChange={(e) => setNewScript({ ...newScript, department: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Vendas, SDR, Inside Sales"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Conteúdo do Script
                  </label>
                  <textarea 
                    rows="8" 
                    value={newScript.description} 
                    onChange={(e) => setNewScript({ ...newScript, description: e.target.value })} 
                    className="form-textarea"
                    placeholder="Escreva o script completo..."
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <BookOpen size={16} />
                  {isEditing ? 'Atualizar Script' : 'Criar Script'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar scripts */}
      {modalState.manageScripts && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Scripts</h3>
                <p className="modal-subtitle">Visualize, edite ou remova scripts da biblioteca</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allScripts.length > 0 ? allScripts.map((script) => (
                <div key={script.id} className="content-item">
                  <div className="content-icon">
                    <BookOpen size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{script.title}</h4>
                    <div className="content-meta">
                      <span className="meta-item">
                        <Building size={12} />
                        {script.department}
                      </span>
                      <span className="meta-item">
                        <Calendar size={12} />
                        {script.dateAdded}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addScript', true, script)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteScript(script.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <BookOpen size={48} />
                  <h3>Nenhum script encontrado</h3>
                  <p>Comece criando seu primeiro script de vendas</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addScript')}>
                    <Plus size={16} />
                    Criar Primeiro Script
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar Cold Call */}
      {modalState.addColdCall && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Técnica de Cold Call' : 'Nova Técnica de Cold Call'}</h3>
                <p className="modal-subtitle">Adicione técnicas e scripts para cold calling</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveColdCall} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Type size={16} />
                    Título da Técnica
                  </label>
                  <input 
                    type="text" 
                    value={newColdCall.title} 
                    onChange={(e) => setNewColdCall({ ...newColdCall, title: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Abertura Eficaz para Cold Call"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Target size={16} />
                    Situação de Uso
                  </label>
                  <input 
                    type="text" 
                    value={newColdCall.situation} 
                    onChange={(e) => setNewColdCall({ ...newColdCall, situation: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Primeiro contato"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <BarChart3 size={16} />
                    Dificuldade
                  </label>
                  <select 
                    value={newColdCall.difficulty} 
                    onChange={(e) => setNewColdCall({ ...newColdCall, difficulty: e.target.value })}
                    className="form-select"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Descrição
                  </label>
                  <textarea 
                    rows="3" 
                    value={newColdCall.description} 
                    onChange={(e) => setNewColdCall({ ...newColdCall, description: e.target.value })} 
                    className="form-textarea"
                    placeholder="Breve descrição da técnica..."
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Phone size={16} />
                    Script/Técnica
                  </label>
                  <textarea 
                    rows="6" 
                    value={newColdCall.script} 
                    onChange={(e) => setNewColdCall({ ...newColdCall, script: e.target.value })} 
                    className="form-textarea"
                    placeholder="Descreva a técnica ou script completo..."
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <Phone size={16} />
                  {isEditing ? 'Atualizar Técnica' : 'Criar Técnica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar Cold Calls */}
      {modalState.manageColdCall && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Técnicas de Cold Call</h3>
                <p className="modal-subtitle">Visualize, edite ou remova técnicas de cold calling</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allColdCalls.length > 0 ? allColdCalls.map((item) => (
                <div key={item.id} className="content-item">
                  <div className="content-icon">
                    <Phone size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{item.title}</h4>
                    <div className="content-meta">
                      <span className="meta-badge difficulty">{item.difficulty}</span>
                      <span className="meta-item">
                        <Target size={12} />
                        {item.situation}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addColdCall', true, item)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteColdCall(item.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Phone size={48} />
                  <h3>Nenhuma técnica encontrada</h3>
                  <p>Comece criando sua primeira técnica de cold call</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addColdCall')}>
                    <Plus size={16} />
                    Criar Primeira Técnica
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar WhatsApp Script */}
      {modalState.addWhatsAppScript && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Script WhatsApp' : 'Novo Script WhatsApp'}</h3>
                <p className="modal-subtitle">Crie scripts para diferentes etapas do funil no WhatsApp</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveWhatsAppScript} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Type size={16} />
                    Título do Script
                  </label>
                  <input 
                    type="text" 
                    value={newWhatsAppScript.title} 
                    onChange={(e) => setNewWhatsAppScript({ ...newWhatsAppScript, title: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Primeira abordagem WhatsApp"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <TrendingUp size={16} />
                    Etapa do Funil
                  </label>
                  <select 
                    value={newWhatsAppScript.funnelStage} 
                    onChange={(e) => setNewWhatsAppScript({ ...newWhatsAppScript, funnelStage: e.target.value })}
                    className="form-select"
                  >
                    <option value="Prospecção">Prospecção</option>
                    <option value="Qualificação">Qualificação</option>
                    <option value="Apresentação">Apresentação</option>
                    <option value="Objeção">Objeção</option>
                    <option value="Fechamento">Fechamento</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <BarChart3 size={16} />
                    Dificuldade
                  </label>
                  <select 
                    value={newWhatsAppScript.difficulty} 
                    onChange={(e) => setNewWhatsAppScript({ ...newWhatsAppScript, difficulty: e.target.value })}
                    className="form-select"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Descrição
                  </label>
                  <textarea 
                    rows="2" 
                    value={newWhatsAppScript.description} 
                    onChange={(e) => setNewWhatsAppScript({ ...newWhatsAppScript, description: e.target.value })} 
                    className="form-textarea"
                    placeholder="Quando usar este script..."
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <MessageSquare size={16} />
                    Script WhatsApp
                  </label>
                  <textarea 
                    rows="6" 
                    value={newWhatsAppScript.script} 
                    onChange={(e) => setNewWhatsAppScript({ ...newWhatsAppScript, script: e.target.value })} 
                    className="form-textarea"
                    placeholder="Olá [nome], tudo bem?..."
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <MessageSquare size={16} />
                  {isEditing ? 'Atualizar Script' : 'Criar Script'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar WhatsApp Scripts */}
      {modalState.manageWhatsAppScript && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Scripts WhatsApp</h3>
                <p className="modal-subtitle">Visualize, edite ou remova scripts de WhatsApp</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allWhatsAppScripts.length > 0 ? allWhatsAppScripts.map((item) => (
                <div key={item.id} className="content-item">
                  <div className="content-icon">
                    <MessageSquare size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{item.title}</h4>
                    <div className="content-meta">
                      <span className="meta-badge difficulty">{item.difficulty}</span>
                      <span className="meta-item">
                        <TrendingUp size={12} />
                        {item.funnelStage}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addWhatsAppScript', true, item)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteWhatsAppScript(item.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <MessageSquare size={48} />
                  <h3>Nenhum script encontrado</h3>
                  <p>Comece criando seu primeiro script de WhatsApp</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addWhatsAppScript')}>
                    <Plus size={16} />
                    Criar Primeiro Script
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar Objeções */}
      {modalState.addObjecoes && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Objeção' : 'Nova Objeção'}</h3>
                <p className="modal-subtitle">Adicione objeções e suas respectivas argumentações</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveObjecoes} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Type size={16} />
                    Título da Objeção
                  </label>
                  <input 
                    type="text" 
                    value={newObjecoes.title} 
                    onChange={(e) => setNewObjecoes({ ...newObjecoes, title: e.target.value })} 
                    className="form-input"
                    placeholder="Ex: Preço muito alto"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Users size={16} />
                    Tipo
                  </label>
                  <select 
                    value={newObjecoes.type} 
                    onChange={(e) => setNewObjecoes({ ...newObjecoes, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Time">Time</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <BarChart3 size={16} />
                    Dificuldade
                  </label>
                  <select 
                    value={newObjecoes.difficulty} 
                    onChange={(e) => setNewObjecoes({ ...newObjecoes, difficulty: e.target.value })}
                    className="form-select"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <AlertCircle size={16} />
                    Objeção
                  </label>
                  <textarea 
                    rows="3" 
                    value={newObjecoes.objection} 
                    onChange={(e) => setNewObjecoes({ ...newObjecoes, objection: e.target.value })} 
                    className="form-textarea"
                    placeholder="Como a objeção é apresentada..."
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Shield size={16} />
                    Resposta/Argumentação
                  </label>
                  <textarea 
                    rows="5" 
                    value={newObjecoes.response} 
                    onChange={(e) => setNewObjecoes({ ...newObjecoes, response: e.target.value })} 
                    className="form-textarea"
                    placeholder="Como responder a esta objeção..."
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <Shield size={16} />
                  {isEditing ? 'Atualizar Objeção' : 'Criar Objeção'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar Objeções */}
      {modalState.manageObjecoes && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Objeções</h3>
                <p className="modal-subtitle">Visualize, edite ou remova objeções e argumentações</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allObjecoes.length > 0 ? allObjecoes.map((item) => (
                <div key={item.id} className="content-item">
                  <div className="content-icon">
                    <Shield size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{item.title}</h4>
                    <div className="content-meta">
                      <span className="meta-badge difficulty">{item.difficulty}</span>
                      <span className="meta-item">
                        <Users size={12} />
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addObjecoes', true, item)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteObjecoes(item.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Shield size={48} />
                  <h3>Nenhuma objeção encontrada</h3>
                  <p>Comece criando sua primeira objeção com argumentações</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addObjecoes')}>
                    <Plus size={16} />
                    Criar Primeira Objeção
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar Campanha */}
      {modalState.addCampanha && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">
                  {isEditing ? 'Editar Campanha' : 'Nova Campanha'}
                </h3>
                <p className="modal-subtitle">Configure campanhas de vendas para a equipe</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCampanha} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <Target size={16} />
                    Título da Campanha
                  </label>
                  <input 
                    type="text" 
                    value={newCampanha.titulo} 
                    onChange={(e) => setNewCampanha({...newCampanha, titulo: e.target.value})} 
                    className="form-input"
                    placeholder="Ex: Campanha Black Friday 2024"
                    required 
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Descrição
                  </label>
                  <textarea 
                    rows="3" 
                    value={newCampanha.descricao} 
                    onChange={(e) => setNewCampanha({...newCampanha, descricao: e.target.value})} 
                    className="form-textarea"
                    placeholder="Descreva os objetivos e estratégias da campanha..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Target size={16} />
                    Tipo de Campanha
                  </label>
                  <select 
                    value={newCampanha.tipo} 
                    onChange={(e) => setNewCampanha({...newCampanha, tipo: e.target.value})}
                    className="form-select"
                  >
                    <option value="Promoção">Promoção</option>
                    <option value="Prospecção">Prospecção</option>
                    <option value="Reativação">Reativação</option>
                    <option value="Upsell">Upsell</option>
                    <option value="Cross-sell">Cross-sell</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Activity size={16} />
                    Status
                  </label>
                  <select 
                    value={newCampanha.status} 
                    onChange={(e) => setNewCampanha({...newCampanha, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="ativa">Ativa</option>
                    <option value="pausada">Pausada</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Data de Início
                  </label>
                  <input 
                    type="date" 
                    value={newCampanha.dataInicio} 
                    onChange={(e) => setNewCampanha({...newCampanha, dataInicio: e.target.value})} 
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Data de Fim
                  </label>
                  <input 
                    type="date" 
                    value={newCampanha.dataFim} 
                    onChange={(e) => setNewCampanha({...newCampanha, dataFim: e.target.value})} 
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Target size={16} />
                    Meta (quantidade)
                  </label>
                  <input 
                    type="number" 
                    value={newCampanha.meta} 
                    onChange={(e) => setNewCampanha({...newCampanha, meta: parseInt(e.target.value) || 0})} 
                    className="form-input"
                    placeholder="Ex: 50"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <TrendingUp size={16} />
                    Progresso Atual
                  </label>
                  <input 
                    type="number" 
                    value={newCampanha.progresso} 
                    onChange={(e) => setNewCampanha({...newCampanha, progresso: parseInt(e.target.value) || 0})} 
                    className="form-input"
                    placeholder="Ex: 35"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Users size={16} />
                    Vendedores Participantes
                  </label>
                  <input 
                    type="number" 
                    value={newCampanha.vendedoresParticipantes} 
                    onChange={(e) => setNewCampanha({...newCampanha, vendedoresParticipantes: parseInt(e.target.value) || 0})} 
                    className="form-input"
                    placeholder="Ex: 8"
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModals} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <Target size={16} />
                  {isEditing ? 'Atualizar Campanha' : 'Criar Campanha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar Campanhas */}
      {modalState.manageCampaigns && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Campanhas</h3>
                <p className="modal-subtitle">Visualize, edite ou remova campanhas de vendas</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allCampanhas.length > 0 ? allCampanhas.map((campanha) => (
                <div key={campanha.id} className="content-item">
                  <div className="content-icon">
                    <Target size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{campanha.titulo}</h4>
                    <p className="content-description">{campanha.descricao}</p>
                    <div className="content-meta">
                      <span className={`meta-badge ${campanha.status === 'ativa' ? 'success' : campanha.status === 'pausada' ? 'warning' : 'danger'}`}>
                        {campanha.status}
                      </span>
                      <span className="meta-badge type">{campanha.tipo}</span>
                      <span className="meta-item">
                        <Users size={12} />
                        {campanha.vendedoresParticipantes} participantes
                      </span>
                      <span className="meta-item">
                        <TrendingUp size={12} />
                        {campanha.progresso}/{campanha.meta}
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addCampanha', true, campanha)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteCampanha(campanha.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Target size={48} />
                  <h3>Nenhuma campanha encontrada</h3>
                  <p>Comece criando sua primeira campanha de vendas</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addCampanha')}>
                    <Plus size={16} />
                    Criar Primeira Campanha
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar Meta da Semana */}
      {modalState.addMetaSemana && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">{isEditing ? 'Editar Meta da Semana' : 'Nova Meta da Semana'}</h3>
                <p className="modal-subtitle">Defina metas semanais para acompanhar o desempenho da equipe</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMetaSemana} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Título da Meta</label>
                  <input
                    type="text"
                    value={newMetaSemana.titulo}
                    onChange={(e) => setNewMetaSemana({...newMetaSemana, titulo: e.target.value})}
                    className="form-input"
                    placeholder="Ex: Meta Semanal - Janeiro 2025"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <textarea
                    value={newMetaSemana.descricao}
                    onChange={(e) => setNewMetaSemana({...newMetaSemana, descricao: e.target.value})}
                    className="form-textarea"
                    rows="3"
                    placeholder="Descreva os objetivos da meta..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Início da Semana</label>
                  <input
                    type="date"
                    value={newMetaSemana.semanaInicio}
                    onChange={(e) => setNewMetaSemana({...newMetaSemana, semanaInicio: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fim da Semana</label>
                  <input
                    type="date"
                    value={newMetaSemana.semanaFim}
                    onChange={(e) => setNewMetaSemana({...newMetaSemana, semanaFim: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h4 className="form-section-title">Metas Semanais</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Meta - Vendas Realizadas</label>
                    <input
                      type="number"
                      value={newMetaSemana.metaVendasRealizadas}
                      onChange={(e) => setNewMetaSemana({...newMetaSemana, metaVendasRealizadas: parseInt(e.target.value) || 0})}
                      className="form-input"
                      placeholder="Ex: 50"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Meta - Valor de Vendas (R$)</label>
                    <input
                      type="number"
                      value={newMetaSemana.metaValorVendas}
                      onChange={(e) => setNewMetaSemana({...newMetaSemana, metaValorVendas: parseFloat(e.target.value) || 0})}
                      className="form-input"
                      placeholder="Ex: 50000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Meta - Clientes Recuperados</label>
                    <input
                      type="number"
                      value={newMetaSemana.metaClientesRecuperados}
                      onChange={(e) => setNewMetaSemana({...newMetaSemana, metaClientesRecuperados: parseInt(e.target.value) || 0})}
                      className="form-input"
                      placeholder="Ex: 15"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Meta - Novos Clientes</label>
                    <input
                      type="number"
                      value={newMetaSemana.metaNovosClientes}
                      onChange={(e) => setNewMetaSemana({...newMetaSemana, metaNovosClientes: parseInt(e.target.value) || 0})}
                      className="form-input"
                      placeholder="Ex: 25"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">Resultados Alcançados</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Vendas Realizadas</label>
                    <input
                      type="number"
                      value={newMetaSemana.vendasRealizadas}
                      onChange={(e) => setNewMetaSemana({...newMetaSemana, vendasRealizadas: parseInt(e.target.value) || 0})}
                      className="form-input"
                      placeholder="Ex: 42"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Valor de Vendas (R$)</label>
                    <input
                      type="number"
                      value={newMetaSemana.valorVendas}
                      onChange={(e) => setNewMetaSemana({...newMetaSemana, valorVendas: parseFloat(e.target.value) || 0})}
                      className="form-input"
                      placeholder="Ex: 45000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Clientes Recuperados</label>
                    <input
                      type="number"
                      value={newMetaSemana.clientesRecuperados}
                      onChange={(e) => setNewMetaSemana({...newMetaSemana, clientesRecuperados: parseInt(e.target.value) || 0})}
                      className="form-input"
                      placeholder="Ex: 12"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Novos Clientes</label>
                    <input
                      type="number"
                      value={newMetaSemana.novosClientes}
                      onChange={(e) => setNewMetaSemana({...newMetaSemana, novosClientes: parseInt(e.target.value) || 0})}
                      className="form-input"
                      placeholder="Ex: 20"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={newMetaSemana.status}
                  onChange={(e) => setNewMetaSemana({...newMetaSemana, status: e.target.value})}
                  className="form-select"
                >
                  <option value="ativa">Ativa</option>
                  <option value="pausada">Pausada</option>
                  <option value="concluida">Concluída</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCloseModals} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {isEditing ? 'Atualizar Meta' : 'Criar Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para gerenciar Metas da Semana */}
      {modalState.manageMetasSemana && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content modern large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Gerenciar Metas da Semana</h3>
                <p className="modal-subtitle">Visualize, edite ou remova metas semanais</p>
              </div>
              <button onClick={handleCloseModals} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="content-list">
              {allMetasSemana.length > 0 ? allMetasSemana.map((meta) => (
                <div key={meta.id} className="content-item">
                  <div className="content-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="content-info">
                    <h4 className="content-title">{meta.titulo}</h4>
                    <p className="content-description">{meta.descricao}</p>
                    <div className="content-meta">
                      <span className={`meta-badge ${meta.status === 'ativa' ? 'success' : meta.status === 'pausada' ? 'warning' : 'primary'}`}>
                        {meta.status}
                      </span>
                      <span className="meta-item">
                        <TrendingUp size={12} />
                        {meta.progresso}% concluído
                      </span>
                      <span className="meta-item">
                        <DollarSign size={12} />
                        R$ {meta.valorVendas.toLocaleString()}/{meta.metaValorVendas.toLocaleString()}
                      </span>
                      <span className="meta-item">
                        <Users size={12} />
                        {meta.vendasRealizadas}/{meta.metaVendasRealizadas} vendas
                      </span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button 
                      className="content-action-btn edit" 
                      onClick={() => handleOpenModal('addMetaSemana', true, meta)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="content-action-btn delete" 
                      onClick={() => handleDeleteMetaSemana(meta.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Calendar size={48} />
                  <h3>Nenhuma meta encontrada</h3>
                  <p>Comece criando sua primeira meta da semana</p>
                  <button className="btn-primary" onClick={() => handleOpenModal('addMetaSemana')}>
                    <Plus size={16} />
                    Criar Primeira Meta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .admin-container::before {
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
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Header Moderno */
        .admin-header {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.4s ease;
          overflow: hidden;
        }

        .admin-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 2s ease;
        }

        .admin-header:hover::before {
          left: 100%;
        }

        .admin-header:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 25px 60px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .header-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .title-section {
          flex: 1;
        }

        .admin-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 2.75rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .title-icon {
          color: #3b82f6;
          filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
        }

        .admin-subtitle {
          color: #64748b;
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .header-badges {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .status-badge.online {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #065f46;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .time-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          color: #1e40af;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .action-btn.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.8);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }

        /* Cards de Estatísticas */
        .stats-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          position: relative;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.4s ease;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          overflow: hidden;
          cursor: pointer;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.8s ease;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .stat-background {
          position: absolute;
          top: -20px;
          right: -20px;
          opacity: 0.05;
          transform: rotate(15deg);
        }

        .background-icon {
          width: 80px;
          height: 80px;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        }

        .stat-icon {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 2;
        }

        .stat-card.users .stat-icon {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
          color: #3b82f6;
        }

        .stat-card.modules .stat-icon {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
          color: #10b981;
        }

        .stat-card.articles .stat-icon {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
          color: #f59e0b;
        }

        .stat-card.scripts .stat-icon {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
          color: #8b5cf6;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        }

        .stat-content {
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #1e293b, #475569);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          color: #64748b;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          width: fit-content;
          backdrop-filter: blur(8px);
        }

        .stat-trend.positive {
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .stat-actions {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 3;
        }

        .stat-action-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .stat-action-btn:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        /* Seção de Gestão */
        .management-section {
          position: relative;
          z-index: 1;
          margin-bottom: 3rem;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: #64748b;
          font-size: 1.125rem;
          font-weight: 500;
        }

        .management-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .management-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.4s ease;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .management-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 1s ease;
        }

        .management-card:hover::before {
          left: 100%;
        }

        .management-card:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 2;
        }

        .card-icon-wrapper {
          width: 4rem;
          height: 4rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .card-icon-wrapper.users {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .card-icon-wrapper.academy {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .card-icon-wrapper.scripts {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
          color: #8b5cf6;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .card-icon-wrapper.gamification {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .card-icon-wrapper.analytics {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1));
          color: #ec4899;
          border: 1px solid rgba(236, 72, 153, 0.3);
        }

        .card-icon-wrapper.pipeline {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1));
          color: #06b6d4;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .card-icon-wrapper.campaigns {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .card-icon-wrapper.metas-semana {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1));
          color: #a855f7;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .management-card:hover .card-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        }

        .card-badge {
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .card-badge {
          background: rgba(59, 130, 246, 0.15);
          color: #1e40af;
          border-color: rgba(59, 130, 246, 0.3);
        }

        .card-badge.soon {
          background: rgba(245, 158, 11, 0.15);
          color: #92400e;
          border-color: rgba(245, 158, 11, 0.3);
        }

        .card-badge.trend {
          background: rgba(16, 185, 129, 0.15);
          color: #065f46;
          border-color: rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .card-content {
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 2;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.75rem;
        }

        .card-description {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .card-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metric {
          text-align: center;
          padding: 1rem;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(8px);
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
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
        }

        .card-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .card-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .card-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .card-btn.secondary {
          background: rgba(255, 255, 255, 0.8);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .card-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .card-btn.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .card-quick-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .quick-action-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .quick-action-btn:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        /* Seção de Atividade Recente */
        .activity-section {
          position: relative;
          z-index: 1;
          margin-bottom: 2rem;
        }

        .activity-section .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          color: #1e40af;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .view-all-btn:hover {
          background: rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .activity-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.3s ease;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          cursor: pointer;
        }

        .activity-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .activity-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }

        .activity-icon.users {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
          color: #3b82f6;
        }

        .activity-icon.modules {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
          color: #10b981;
        }

        .activity-icon.scripts {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
          color: #8b5cf6;
        }

        .activity-icon.analytics {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1));
          color: #ec4899;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .activity-description {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .activity-status {
          width: 2rem;
          height: 2rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-status.success {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .activity-status.warning {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        /* Modais Modernos */
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
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 
            0 25px 60px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          animation: slideUp 0.3s ease-out;
          display: flex;
          flex-direction: column;
        }

        .modal-content.large {
          max-width: 800px;
        }

        .modal-header {
          padding: 2rem 2rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .modal-title-section {
          flex: 1;
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .modal-subtitle {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }

        .modal-close-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .modal-close-btn:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
        }

        .modal-form {
          padding: 2rem;
          overflow-y: auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .form-section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-section-title::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .form-input, .form-textarea, .form-select {
          padding: 1rem 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #1e293b;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #f59e0b;
          margin-top: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 8px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel, .btn-save {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.8);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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

        /* Lista de conteúdo nos modais */
        .content-list {
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .content-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          margin-bottom: 1rem;
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .content-item:hover {
          background: rgba(248, 250, 252, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .content-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 12px;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .content-info {
          flex: 1;
          margin-right: 1rem;
        }

        .content-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .content-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .meta-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .meta-badge.difficulty {
          background: rgba(139, 92, 246, 0.1);
          color: #7c3aed;
          border-color: rgba(139, 92, 246, 0.3);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .content-actions {
          display: flex;
          gap: 0.5rem;
        }

        .content-action-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .content-action-btn.edit {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .content-action-btn.edit:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .content-action-btn.delete {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .content-action-btn.delete:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        /* Estado vazio */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
        }

        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .admin-container {
            padding: 1rem;
          }

          .admin-header {
            padding: 1.5rem;
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }

          .admin-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .management-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .activity-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .modal-content {
            margin: 1rem;
            max-width: calc(100vw - 2rem);
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .card-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .card-actions {
            flex-direction: column;
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .admin-title {
            font-size: 1.75rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .card-title {
            font-size: 1.25rem;
          }

          .modal-header {
            padding: 1.5rem;
          }

          .modal-form {
            padding: 1.5rem;
          }

          .card-metrics {
            grid-template-columns: 1fr;
          }
        }

        /* Outros modais (mantendo apenas os principais exemplos) */
        /* Adicione aqui os outros modais seguindo o mesmo padrão visual */
      `}</style>
    </div>
  );
// ...

}
export default AdminPage;