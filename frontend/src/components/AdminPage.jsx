import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Megaphone,
  TrendingUp,
  UserPlus,
  Speaker,
  Settings,
  BookOpen,
  FileText,
  Library,
  Video,
  Gamepad2,
  Trophy,
  Target,
  Gift,
  BarChart3,
  Download,
  User,
  Lock,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import axios from 'axios';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    usuariosAtivos: 0,
    modulosCriados: 0,
    campanhasAtivas: 0,
    engajamento: 0
  });

  const [contentStats, setContentStats] = useState({
    modulos: 16,
    artigos: 45,
    videos: 23
  });

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'USER',
    department: ''
  });
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showManageModulesModal, setShowManageModulesModal] = useState(false); // <-- ADICIONADO
  const [newModule, setNewModule] = useState({
    title: '', // <-- ADICIONADO
    videoLink: '',
    courseLink: '',
    login: '',
    password: '',
    points: 10
  });
  const [allModules, setAllModules] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  // Estados para Artigos
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showManageArticlesModal, setShowManageArticlesModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', content: '' });
  const [allArticles, setAllArticles] = useState([]);
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);

  // Estados para Scripts
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [showManageScriptsModal, setShowManageScriptsModal] = useState(false);
  const [newScript, setNewScript] = useState({ title: '', description: '', department: '' });
  const [allScripts, setAllScripts] = useState([]);
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [currentScriptId, setCurrentScriptId] = useState(null);

  // Carregar estatísticas em tempo real
  useEffect(() => {
    // Listener para usuários
    /*
    const usersCollection = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
      setStats(prevStats => ({ ...prevStats, usuariosAtivos: snapshot.size }));
    });
    */

    // Listener para módulos
    const modulesCollection = collection(db, 'modules');
    const unsubscribeModules = onSnapshot(modulesCollection, (snapshot) => {
      const modulesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Atualiza estatísticas principais
      setStats(prevStats => ({ ...prevStats, modulosCriados: snapshot.size }));
      setAllModules(modulesList);

      // Calcula e atualiza estatísticas de conteúdo
      const videosCount = modulesList.filter(m => m.videoLink).length;
      // A contagem de artigos virá do listener de artigos
      setContentStats(prev => ({ ...prev, modulos: snapshot.size, videos: videosCount }));
    });

    // Listener para artigos
    const articlesCollection = collection(db, 'articles');
    const unsubscribeArticles = onSnapshot(articlesCollection, (snapshot) => {
      const articlesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllArticles(articlesList);
      setContentStats(prev => ({ ...prev, artigos: snapshot.size }));
    });

    // Listener para scripts
    const scriptsCollection = collection(db, 'scripts');
    const unsubscribeScripts = onSnapshot(scriptsCollection, (snapshot) => {
      const scriptsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllScripts(scriptsList);
    });

    // Placeholder para outras estatísticas
    setStats(prevStats => ({
      ...prevStats,
      campanhasAtivas: 0, // Lógica a ser implementada
      engajamento: 'N/A' // Lógica a ser implementada
    }));

    // Limpeza dos listeners ao desmontar o componente
    return () => {
      // unsubscribeUsers(); // <-- Comente esta linha também
      unsubscribeModules();
      unsubscribeArticles();
      unsubscribeScripts();
    };
  }, []);

  const handleButtonClick = (buttonType, section) => {
    console.log(`Clicou em: ${buttonType} na seção: ${section}`);
    // A lógica dos botões permanece a mesma
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.password || newUser.password.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = 'https://us-central1-plataforma-de-vendas-a87c2.cloudfunctions.net/api/createUser';

      // --- ADICIONE ESTAS DUAS LINHAS PARA DEPURAR ---
      console.log("Enviando requisição para:", apiUrl);
      console.log("Token de Autorização:", token);
      // ---------------------------------------------

      const response = await axios.post(
        apiUrl,
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setNewUser({ name: '', email: '', password: '', role: 'USER', department: '' });
      setShowAddUserModal(false);
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      const errorMessage = error.response?.data || "Não foi possível criar o usuário. Verifique o console do emulador.";
      alert(`Erro: ${errorMessage}`);
    }
  };

  // Adicione esta nova função para salvar o módulo
  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!newModule.title) {
      alert("Por favor, adicione um título.");
      return;
    }

    try {
      if (isEditing) {
        // Lógica de ATUALIZAÇÃO
        const moduleDoc = doc(db, 'modules', currentModuleId);
        await updateDoc(moduleDoc, newModule);
        alert("Módulo atualizado com sucesso!");
      } else {
        // Lógica de CRIAÇÃO
        await addDoc(collection(db, 'modules'), {
          ...newModule,
          type: 'video_course',
          createdAt: new Date(),
          createdBy: currentUser.uid,
        });
        alert("Módulo adicionado com sucesso!");
      }

      // Recarregar módulos da lista após salvar ou editar
      const moduleSnapshot = await getDocs(query(collection(db, 'modules'), orderBy('createdAt', 'desc')));
      setAllModules(moduleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Limpar e fechar o modal
      setShowModuleModal(false);
      setIsEditing(false);
      setCurrentModuleId(null);
      setNewModule({ title: '', videoLink: '', courseLink: '', login: '', password: '', points: 10 });

    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
      alert("Ocorreu um erro ao salvar o módulo.");
    }
  };

  // Adicione esta nova função ao seu componente AdminPage
  const handleFixMyClaim = async () => {
    if (!currentUser || !currentUser.email) {
      alert("Você precisa estar logado para executar esta ação.");
      return;
    }

    try {
      // IMPORTANTE: Use a URL da sua função que está na nuvem
      const apiUrl = 'https://us-central1-plataforma-de-vendas-a87c2.cloudfunctions.net/api/fixAdminClaim';

      console.log(`Enviando requisição para corrigir o usuário: ${currentUser.email}`);

      const response = await axios.post(apiUrl, { email: currentUser.email });

      alert(response.data); // Exibe a mensagem de sucesso do backend
      alert("IMPORTANTE: Permissão corrigida! Agora, por favor, faça LOGOUT e LOGIN novamente para que a mudança tenha efeito.");

    } catch (error) {
      alert("Ocorreu um erro ao tentar corrigir a permissão. Veja o console para detalhes.");
      console.error("Erro detalhado ao corrigir claim:", error);
    }
  };

  

  // Função para preparar a edição
  const handleEditModule = (module) => {
    setIsEditing(true);
    setCurrentModuleId(module.id);
    setNewModule({
      title: module.title,
      videoLink: module.videoLink,
      courseLink: module.courseLink,
      login: module.login,
      password: module.password,
      points: module.points,
    });
    setShowModuleModal(true);
  };

  // Função para apagar um módulo
  const handleDeleteModule = async (moduleId) => {
    if (window.confirm("Tem certeza que deseja apagar este módulo?")) {
      try {
        await deleteDoc(doc(db, 'modules', moduleId));
        alert("Módulo apagado com sucesso!");
      } catch (error) {
        console.error("Erro ao apagar módulo:", error);
        alert("Erro ao apagar o módulo.");
      }
    }
  };

  // Função para salvar/atualizar artigos
  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) {
      alert("Por favor, preencha o título e o conteúdo.");
      return;
    }

    try {
      if (isEditingArticle) {
        const articleDoc = doc(db, 'articles', currentArticleId);
        await updateDoc(articleDoc, newArticle);
        alert("Artigo atualizado com sucesso!");
      } else {
        await addDoc(collection(db, 'articles'), {
          ...newArticle,
          createdAt: new Date(),
          createdBy: currentUser.uid,
        });
        alert("Artigo adicionado com sucesso!");
      }

      setShowArticleModal(false);
      setIsEditingArticle(false);
      setCurrentArticleId(null);
      setNewArticle({ title: '', content: '' });

    } catch (error) {
      console.error("Erro ao salvar artigo:", error);
      alert("Ocorreu um erro ao salvar o artigo.");
    }
  };

  // Função para preparar a edição do artigo
  const handleEditArticle = (article) => {
    setIsEditingArticle(true);
    setCurrentArticleId(article.id);
    setNewArticle({
      title: article.title,
      content: article.content,
    });
    setShowArticleModal(true);
  };

  // Função para apagar um artigo
  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("Tem certeza que deseja apagar este artigo?")) {
      try {
        await deleteDoc(doc(db, 'articles', articleId));
        alert("Artigo apagado com sucesso!");
      } catch (error) {
        console.error("Erro ao apagar artigo:", error);
        alert("Erro ao apagar o artigo.");
      }
    }
  };

  // Função para salvar/atualizar scripts
  const handleSaveScript = async (e) => {
    e.preventDefault();
    if (!newScript.title || !newScript.description) {
      alert("Por favor, preencha o título e a descrição.");
      return;
    }

    try {
      if (isEditingScript) {
        const scriptDoc = doc(db, 'scripts', currentScriptId);
        await updateDoc(scriptDoc, newScript);
        alert("Script atualizado com sucesso!");
      } else {
        await addDoc(collection(db, 'scripts'), {
          ...newScript,
          createdAt: new Date(),
          createdBy: currentUser.uid,
        });
        alert("Script adicionado com sucesso!");
      }
      setShowScriptModal(false);
      setIsEditingScript(false);
      setCurrentScriptId(null);
      setNewScript({ title: '', description: '', department: '' });
    } catch (error) {
      console.error("Erro ao salvar script:", error);
      alert("Ocorreu um erro ao salvar o script.");
    }
  };

  // Função para preparar a edição do script
  const handleEditScript = (script) => {
    setIsEditingScript(true);
    setCurrentScriptId(script.id);
    setNewScript({
      title: script.title,
      description: script.description,
      department: script.department,
    });
    setShowScriptModal(true);
  };

  // Função para apagar um script
  const handleDeleteScript = async (scriptId) => {
    if (window.confirm("Tem certeza que deseja apagar este script?")) {
      try {
        await deleteDoc(doc(db, 'scripts', scriptId));
        alert("Script apagado com sucesso!");
      } catch (error) {
        console.error("Erro ao apagar script:", error);
        alert("Erro ao apagar o script.");
      }
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-section">
          <h1 className="admin-title">Painel Administrativo</h1>
          <p className="admin-subtitle">Controle total sobre a plataforma</p>
        </div>
        <div className="admin-actions">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="admin-btn admin-btn-primary"
          >
            <UserPlus className="btn-icon" />
            Novo Usuário
          </button>
          <button className="admin-btn admin-btn-secondary">
            <Speaker className="btn-icon" />
            Nova Campanha
          </button>
          <button onClick={handleFixMyClaim} className="admin-btn admin-btn-danger">
            Corrigir Minha Permissão (Uso Único)
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon-blue"><Users className="icon" /></div>
          <div className="stat-content"><h3 className="stat-number">{stats.usuariosAtivos}</h3><p className="stat-label">Usuários Ativos</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon-green"><GraduationCap className="icon" /></div>
          <div className="stat-content"><h3 className="stat-number">{stats.modulosCriados}</h3><p className="stat-label">Módulos Criados</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon-orange"><Megaphone className="icon" /></div>
          <div className="stat-content"><h3 className="stat-number">{stats.campanhasAtivas}</h3><p className="stat-label">Campanhas Ativas</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon-purple"><TrendingUp className="icon" /></div>
          <div className="stat-content"><h3 className="stat-number">{stats.engajamento}%</h3><p className="stat-label">Engajamento</p></div>
        </div>
      </div>

      {/* Seção de Gestão Unificada */}
      <div className="admin-management-section">

        {/* Card Gestão de Conteúdo */}
        <div className="management-card">
          <div className="management-header"><div className="management-title"><BookOpen className="management-icon" /><h2>Gestão de Conteúdo</h2></div></div>
          <div className="management-actions">
            <button 
              className="management-btn management-btn-primary"
              onClick={() => setShowModuleModal(true)}
            >
              <GraduationCap className="btn-icon" />
              Adicionar Módulo
            </button>
            <button 
              className="management-btn"
              onClick={() => setShowManageModulesModal(true)} // <-- ALTERADO
            >
              <Settings className="btn-icon" />
              Gerenciar Módulos
            </button>
            <button 
              className="management-btn management-btn-secondary"
              onClick={() => setShowArticleModal(true)} // <-- ALTERADO
            >
              <FileText className="btn-icon" />
              Adicionar Conteúdo
            </button>
            <button 
              className="management-btn"
              onClick={() => setShowManageArticlesModal(true)} // <-- ALTERADO
            >
              <Library className="btn-icon" />
              Gerenciar Conteúdo
            </button>
            <button 
              className="management-btn"
              onClick={() => {
                setIsEditingScript(false);
                setNewScript({ title: '', description: '', department: '' });
                setShowScriptModal(true);
              }}
            >
              <BookOpen className="btn-icon" />
              Adicionar Script
            </button>
            <button 
              className="management-btn"
              onClick={() => setShowManageScriptsModal(true)}
            >
              <Settings className="btn-icon" />
              Gerenciar Scripts
            </button>
          </div>
          <div className="recent-section">
            <h3 className="section-title">Estatísticas de Conteúdo</h3>
            <div className="content-stats">
              <div className="stat-item"><span className="stat-number stat-blue">{contentStats.modulos}</span><span className="stat-label">Módulos</span></div>
              <div className="stat-item"><span className="stat-number stat-green">{contentStats.artigos}</span><span className="stat-label">Artigos</span></div>
              <div className="stat-item"><span className="stat-number stat-orange">{contentStats.videos}</span><span className="stat-label">Vídeos</span></div>
            </div>
          </div>
        </div>

        {/* Card Gestão de Gamificação */}
        <div className="management-card">
          <div className="management-header"><div className="management-title"><Gamepad2 className="management-icon" /><h2>Gestão de Gamificação</h2></div></div>
          <div className="management-actions">
            <button className="management-btn management-btn-primary" onClick={() => handleButtonClick('badges', 'gamificacao')}><Trophy className="btn-icon" />Badges</button>
            <button className="management-btn management-btn-secondary" onClick={() => handleButtonClick('desafios', 'gamificacao')}><Target className="btn-icon" />Desafios</button>
            <button className="management-btn management-btn-secondary" onClick={() => handleButtonClick('recompensas', 'gamificacao')}><Gift className="btn-icon" />Recompensas</button>
          </div>
          <div className="recent-section">
            <h3 className="section-title">Estatísticas de Gamificação</h3>
            <div className="content-stats">
              <div className="stat-item"><span className="stat-number stat-blue">12</span><span className="stat-label">Badges Ativas</span></div>
              <div className="stat-item"><span className="stat-number stat-green">8</span><span className="stat-label">Desafios Ativos</span></div>
              <div className="stat-item"><span className="stat-number stat-orange">15</span><span className="stat-label">Recompensas</span></div>
            </div>
          </div>
        </div>

        {/* Card Analytics e Relatórios */}
        <div className="management-card">
          <div className="management-header"><div className="management-title"><BarChart3 className="management-icon" /><h2>Analytics e Relatórios</h2></div></div>
          <div className="management-actions">
            <button className="management-btn management-btn-primary" onClick={() => handleButtonClick('analytics', 'relatorios')}><BarChart3 className="btn-icon" />Analytics</button>
            <button className="management-btn management-btn-secondary" onClick={() => handleButtonClick('relatorios', 'relatorios')}><FileText className="btn-icon" />Relatórios</button>
            <button className="management-btn management-btn-secondary" onClick={() => handleButtonClick('exportar', 'relatorios')}><Download className="btn-icon" />Exportar Dados</button>
          </div>
          <div className="recent-section">
            <h3 className="section-title">Resumo Semanal</h3>
            <div className="weekly-summary">
              <div className="summary-item"><span className="summary-percentage text-blue-600">+15%</span><span className="summary-label">Engajamento</span></div>
              <div className="summary-item"><span className="summary-percentage text-green-600">+8</span><span className="summary-label">Novos Usuários</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Usuário */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Adicionar Novo Usuário</h3>
            
            <form onSubmit={handleAddUser} className="user-form">
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  value={newUser.name || ''}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={newUser.email || ''}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  value={newUser.password || ''}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cargo (Nível de Acesso)</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="form-select"
                >
                  <option value="USER">Usuário</option>
                  <option value="USER_SDR">SDR</option>
                  <option value="USER_VENDEDOR">Vendedor</option>
                  <option value="ADMIN_CONTEUDO">Admin Conteúdo</option>
                  <option value="ADMIN_OPERACIONAL">Admin Operacional</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Departamento</label>
                <input
                  type="text"
                  value={newUser.department || ''}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="form-input"
                  placeholder="Ex: Vendas, Marketing..."
                />
              </div>

              {/* OBS: O campo de senha foi removido intencionalmente, pois a criação de usuários com senha direto do app não é uma prática segura recomendada pelo Firebase. O ideal é que o Firebase envie um link de redefinição de senha para o primeiro login. */}

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddUserModal(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Módulo */}
      {showModuleModal && (
        <div className="modal-overlay" onClick={() => setShowModuleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Adicionar Novo Módulo de Ensino</h3>

            <form onSubmit={handleSaveModule} className="user-form">
              {/* NOVO CAMPO DE TÍTULO */}
              <div className="form-group">
                <label className="form-label">Título do Módulo</label>
                <div className="input-wrapper">
                  <GraduationCap className="input-icon" />
                  <input
                    type="text"
                    value={newModule.title}
                    onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                    className="form-input"
                    placeholder="Ex: Treinamento de Vendas - Etapa 1"
                    required
                  />
                </div>
              </div>

              {/* Campo Link do Vídeo */}
              <div className="form-group">
                <label className="form-label">Link do Vídeo (YouTube, Vimeo, etc.)</label>
                <div className="input-wrapper">
                  <Video className="input-icon" />
                  <input
                    type="url"
                    value={newModule.videoLink}
                    onChange={(e) => setNewModule({...newModule, videoLink: e.target.value})}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Campo Link do Curso */}
              <div className="form-group">
                <label className="form-label">Link da Plataforma do Curso</label>
                <div className="input-wrapper">
                  <GraduationCap className="input-icon" />
                  <input
                    type="url"
                    value={newModule.courseLink}
                    onChange={(e) => setNewModule({...newModule, courseLink: e.target.value})}
                    className="form-input"
                    placeholder="https://plataforma.com/curso"
                  />
                </div>
              </div>

              {/* Campos de Acesso ao Curso */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Login de Acesso</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      type="text"
                      value={newModule.login}
                      onChange={(e) => setNewModule({...newModule, login: e.target.value})}
                      className="form-input"
                      placeholder="aluno@email.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Senha de Acesso</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type="password"
                      value={newModule.password}
                      onChange={(e) => setNewModule({...newModule, password: e.target.value})}
                      className="form-input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Campo de Pontuação */}
              <div className="form-group">
                <label className="form-label">Pontos por Conclusão</label>
                 <div className="input-wrapper">
                  <Trophy className="input-icon" />
                  <input
                    type="number"
                    value={newModule.points}
                    onChange={(e) => setNewModule({...newModule, points: Number(e.target.value)})}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModuleModal(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Módulos */}
      {showManageModulesModal && (
        <div className="modal-overlay" onClick={() => setShowManageModulesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Gerenciar Módulos de Ensino</h3>
            <div className="admin-list-container">
              {allModules.map((module) => (
                <div key={module.id} className="admin-list-item">
                  <div className="admin-item-info">
                    <GraduationCap className="admin-item-icon" />
                    <span className="admin-item-title">{module.title}</span>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      className="admin-item-btn edit-btn"
                      onClick={() => {
                        handleEditModule(module);
                        setShowManageModulesModal(false); // Fecha o modal de gerenciamento
                      }}
                    >
                      <Edit size={16} /> Editar
                    </button>
                    <button
                      className="admin-item-btn delete-btn"
                      onClick={() => handleDeleteModule(module.id)}
                    >
                      <Trash2 size={16} /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowManageModulesModal(false)}
                className="btn-cancel"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar/Editar Artigo */}
      {showArticleModal && (
        <div className="modal-overlay" onClick={() => setShowArticleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{isEditingArticle ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}</h3>
            <form onSubmit={handleSaveArticle} className="user-form">
              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="form-input"
                  placeholder="Digite o título do artigo"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Conteúdo</label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="form-input"
                  placeholder="Digite o conteúdo aqui..."
                  rows="10"
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowArticleModal(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Artigos */}
      {showManageArticlesModal && (
        <div className="modal-overlay" onClick={() => setShowManageArticlesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Gerenciar Conteúdos</h3>
            <div className="admin-list-container">
              {allArticles.map((article) => (
                <div key={article.id} className="admin-list-item">
                  <div className="admin-item-info">
                    <FileText className="admin-item-icon" />
                    <span className="admin-item-title">{article.title}</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="admin-item-btn edit-btn" onClick={() => { handleEditArticle(article); setShowManageArticlesModal(false); }}>
                      <Edit size={16} /> Editar
                    </button>
                    <button className="admin-item-btn delete-btn" onClick={() => handleDeleteArticle(article.id)}>
                      <Trash2 size={16} /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowManageArticlesModal(false)} className="btn-cancel">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar/Editar Script */}
      {showScriptModal && (
        <div className="modal-overlay" onClick={() => setShowScriptModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{isEditingScript ? 'Editar Script' : 'Adicionar Script à Biblioteca'}</h3>
            <form onSubmit={handleSaveScript} className="user-form">
              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  value={newScript.title}
                  onChange={(e) => setNewScript({ ...newScript, title: e.target.value })}
                  className="form-input"
                  placeholder="Ex: Script de Qualificação"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  value={newScript.description}
                  onChange={(e) => setNewScript({ ...newScript, description: e.target.value })}
                  className="form-input"
                  placeholder="Digite o script ou a descrição aqui..."
                  rows="8"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Departamento</label>
                <input
                  type="text"
                  value={newScript.department}
                  onChange={(e) => setNewScript({ ...newScript, department: e.target.value })}
                  className="form-input"
                  placeholder="Ex: Vendas, SDR, Pós-venda"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowScriptModal(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save">{isEditingScript ? 'Atualizar Script' : 'Salvar Script'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Scripts */}
      {showManageScriptsModal && (
        <div className="modal-overlay" onClick={() => setShowManageScriptsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Gerenciar Scripts</h3>
            <div className="admin-list-container">
              {allScripts.map((script) => (
                <div key={script.id} className="admin-list-item">
                  <div className="admin-item-info">
                    <BookOpen className="admin-item-icon" />
                    <span className="admin-item-title">{script.title}</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="admin-item-btn edit-btn" onClick={() => { handleEditScript(script); setShowManageScriptsModal(false); }}>
                      <Edit size={16} /> Editar
                    </button>
                    <button className="admin-item-btn delete-btn" onClick={() => handleDeleteScript(script.id)}>
                      <Trash2 size={16} /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowManageScriptsModal(false)} className="btn-cancel">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;