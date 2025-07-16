import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, BookOpen, Play, FileText, Download, Eye, Star,
  Clock, User, TrendingUp, Award, Video, File, MessageSquare, 
  HelpCircle, ArrowRight, Bookmark, Share2, Copy, ChevronDown,
  Heart, Phone, Mail, RefreshCw, Plus, Shield, X
} from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

function BaseConhecimento() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  
  // Estados para modal de visualização
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  
  // Estados para dados do Firebase
  const [videosData, setVideosData] = useState([]);
  const [guidesData, setGuidesData] = useState([]);
  const [scriptsData, setScriptsData] = useState([]);
  const [coldCallsData, setColdCallsData] = useState([]);
  const [whatsappData, setWhatsappData] = useState([]);
  const [objecoesData, setObjecoesData] = useState([]);
  const [emailTemplatesData, setEmailTemplatesData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do Firebase
  useEffect(() => {
    const unsubscribers = [];

    const collectionsToLoad = [
        { name: 'modules', setter: setVideosData, type: 'video' },
        { name: 'articles', setter: setGuidesData, type: 'guide' },
        { name: 'scripts', setter: setScriptsData, type: 'script' },
        { name: 'coldCalls', setter: setColdCallsData, type: 'coldcall' },
        { name: 'whatsappScripts', setter: setWhatsappData, type: 'whatsapp' },
        { name: 'objecoes', setter: setObjecoesData, type: 'objection' },
        { name: 'emailTemplates', setter: setEmailTemplatesData, type: 'email' },
        { name: 'courses', setter: setCoursesData, type: 'course' },
    ];

    collectionsToLoad.forEach(({ name, setter, type }) => {
        unsubscribers.push(onSnapshot(collection(db, name), (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: type 
            }));
            setter(data);
        }));
    });

    setLoading(false);
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // Combinar todos os tipos de conteúdo em uma única lista
  const allContent = [
    ...videosData, 
    ...guidesData, 
    ...scriptsData,
    ...coldCallsData,
    ...whatsappData,
    ...objecoesData,
    ...emailTemplatesData,
    ...coursesData,
  ];

  // Filtrar conteúdo
  const filteredContent = allContent.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTermLower) ||
      (item.description && item.description.toLowerCase().includes(searchTermLower)) ||
      (item.content && item.content.toLowerCase().includes(searchTermLower)) ||
      (item.script && item.script.toLowerCase().includes(searchTermLower)) ||
      (item.body && item.body.toLowerCase().includes(searchTermLower)) ||
      (item.tags && Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(searchTermLower)));
      
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    const matchesType = selectedType === '' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Categorias e tipos únicos para os dropdowns de filtro
  const categories = [...new Set(allContent.map(item => item.category).filter(Boolean))];
  const types = [...new Set(allContent.map(item => item.type).filter(Boolean))];

  // Estatísticas
  const stats = {
    totalVideos: videosData.length,
    totalGuias: guidesData.length,
    totalScripts: scriptsData.length + coldCallsData.length + whatsappData.length + objecoesData.length + emailTemplatesData.length,
    totalCursos: coursesData.length,
  };

  const handleWatchVideo = async (video) => {
    if (video.videoLink) {
      try {
        await updateDoc(doc(db, 'modules', video.id), { views: increment(1) });
      } catch (error) {
        console.error('Erro ao atualizar visualizações:', error);
      }
      window.open(video.videoLink, '_blank');
    } else {
      alert('Link do vídeo não disponível');
    }
  };

  const toggleFavorite = (id) => {
    setFavoritos(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const openContentModal = (content) => {
    setSelectedContent(content);
    setShowContentModal(true);
  };

  const closeContentModal = () => {
    setShowContentModal(false);
    setSelectedContent(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Básico': return 'text-green-600 bg-green-50';
      case 'Intermediário': return 'text-yellow-600 bg-yellow-50';
      case 'Avançado': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Play size={16} />;
      case 'guide': return <BookOpen size={16} />;
      case 'script': return <FileText size={16} />;
      case 'document': return <File size={16} />;
      case 'course': return <Award size={16} />;
      case 'coldcall': return <Phone size={16} />;
      case 'whatsapp': return <MessageSquare size={16} />;
      case 'objection': return <Shield size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <File size={16} />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
      />
    ));
  };

  const quickAccessData = [
    { name: 'Técnicas de Cold Call', icon: '📞', count: coldCallsData.length, type: 'coldcall' },
    { name: 'Scripts WhatsApp', icon: '💬', count: whatsappData.length, type: 'whatsapp' },
    { name: 'Objeções Comuns', icon: '🛡️', count: objecoesData.length, type: 'objection' },
    { name: 'Templates de Email', icon: '✉️', count: emailTemplatesData.length, type: 'email' },
    { name: 'Vídeos de Treinamento', icon: '🎥', count: videosData.length, type: 'video' },
    { name: 'Cursos de Metodologia', icon: '🎓', count: coursesData.length, type: 'course' }
  ];

  if (loading) {
    return (
      <div className="base-conhecimento-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="base-conhecimento-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Base de Conhecimento</h1>
            <p className="page-subtitle">Central completa de aprendizado e recursos para SDRs</p>
            <div className="header-stats">
              <div className="stat-item"><Video size={16} /><span>{stats.totalVideos} vídeos</span></div>
              <div className="stat-item"><BookOpen size={16} /><span>{stats.totalGuias} guias</span></div>
              <div className="stat-item"><FileText size={16} /><span>{stats.totalScripts} scripts</span></div>
              <div className="stat-item"><Award size={16} /><span>{stats.totalCursos} cursos</span></div>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn secondary" onClick={() => window.location.reload()}><RefreshCw size={16} />Atualizar</button>
            <button className="action-btn primary" onClick={() => alert('Funcionalidade em desenvolvimento')}><Plus size={16} />Sugerir Conteúdo</button>
          </div>
        </div>
      </div>

      <div className="quick-access-section">
        <h3 className="section-title">Acesso Rápido</h3>
        <div className="quick-access-grid">
          {quickAccessData.map((item, index) => (
            <div key={index} className="quick-access-card" onClick={() => { setSelectedType(item.type); setSearchTerm(''); }}>
              <div className="quick-access-icon">{item.icon}</div>
              <div className="quick-access-content">
                <h4 className="quick-access-title">{item.name}</h4>
                <p className="quick-access-count">{item.count} itens</p>
              </div>
              <ArrowRight className="quick-access-arrow" size={16} />
            </div>
          ))}
        </div>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" size={16} />
          <input type="text" placeholder="Buscar por título, descrição ou tags..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
        <div className="filters-container">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select"><option value="">Todas as Categorias</option>{categories.map(category => (<option key={category} value={category}>{category}</option>))}</select>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="filter-select"><option value="">Todos os Tipos</option>{types.map(type => (<option key={type} value={type} style={{textTransform: 'capitalize'}}>{type}</option>))}</select>
          <button className="filter-btn" onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSelectedType(''); }}><RefreshCw size={14} />Limpar Filtros</button>
        </div>
      </div>
      
      <div className="content-section">
        <div className="section-header">
            <div className="section-title-container">
                <BookOpen className="section-icon" size={20} />
                <h3 className="section-title">Conteúdos</h3>
                <span className="section-count">({filteredContent.length})</span>
            </div>
            <ChevronDown className="section-chevron expanded" size={20} />
        </div>
        <div className="section-content expanded">
          {filteredContent.length > 0 ? (
            <>
              {/* Seção de Vídeos */}
              {filteredContent.some(item => item.type === 'video') && (
                <section className="content-section-block">
                  <h4 className="content-section-title">Vídeos de Treinamento</h4>
                  <div className="content-grid">
                    {filteredContent.filter(item => item.type === 'video').map(item => (
                      <div key={item.id} className="video-card">
                        <div className="video-thumbnail">
                          <div className="thumbnail-content">{item.thumbnail || '🎥'}</div>
                          <div className="video-duration">{item.duration || '00:00'}</div>
                          <button className="play-button" onClick={() => handleWatchVideo(item)}><Play size={24} /></button>
                        </div>
                        <div className="video-content">
                          <div className="video-header"><h4 className="video-title">{item.title}</h4><button className={`favorite-btn ${favoritos.includes(item.id) ? 'active' : ''}`} onClick={() => toggleFavorite(item.id)}><Heart size={16} /></button></div>
                          <p className="video-description">{item.description || 'Sem descrição disponível'}</p>
                          <div className="video-meta"><div className="meta-row"><span className={`difficulty-badge ${getDifficultyColor(item.difficulty)}`}>{item.difficulty || 'Intermediário'}</span><div className="video-rating">{renderStars(item.rating || 4.8)}<span className="rating-value">({item.rating || 4.8})</span></div></div><div className="meta-row"><div className="video-stats"><Eye size={12} /><span>{item.views || 0} visualizações</span></div><div className="video-author"><User size={12} /><span>{item.author || 'Instrutor'}</span></div></div></div>
                          <div className="video-tags">{(item.tags || []).map((tag, index) => (<span key={index} className="tag">#{tag}</span>))}</div>
                          <div className="video-actions"><button className="action-btn primary" onClick={() => openContentModal(item)}><Play size={16} />Visualizar</button><button className="action-btn secondary" onClick={() => toggleFavorite(item.id)}><Bookmark size={16} />Salvar</button><button className="action-btn secondary" onClick={() => { navigator.clipboard.writeText(item.videoLink || window.location.href); alert('Link copiado!'); }}><Share2 size={16} />Compartilhar</button></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Seção de Guias */}
              {filteredContent.some(item => item.type === 'guide') && (
                <section className="content-section-block">
                  <h4 className="content-section-title">Guias e Artigos</h4>
                  <div className="content-grid">
                    {filteredContent.filter(item => item.type === 'guide').map(item => (
                      <div key={item.id} className="guide-card">
                        <div className="guide-icon-container">
                          <div className="guide-icon">{item.icon || '📄'}</div>
                          <div className="guide-type">{getTypeIcon(item.type)}</div>
                        </div>
                        <div className="guide-content">
                          <div className="guide-header"><h4 className="guide-title">{item.title}</h4><button className={`favorite-btn ${favoritos.includes(item.id) ? 'active' : ''}`} onClick={() => toggleFavorite(item.id)}><Heart size={16} /></button></div>
                          <p className="guide-description">{item.description || item.content || item.script || item.body || 'Sem descrição disponível'}</p>
                          <div className="guide-meta"><div className="meta-row"><span className={`difficulty-badge ${getDifficultyColor(item.difficulty)}`}>{item.difficulty || 'Intermediário'}</span><div className="guide-rating">{renderStars(item.rating || 4.8)}<span className="rating-value">({item.rating || 4.8})</span></div></div><div className="meta-row"><div className="read-time"><Clock size={12} /><span>{item.readTime || '5 min'}</span></div></div></div>
                          <div className="guide-tags">{(item.tags || []).map((tag, index) => (<span key={index} className="tag">#{tag}</span>))}</div>
                          <div className="guide-actions"><button className="action-btn primary" onClick={() => openContentModal(item)}><BookOpen size={16} />Acessar</button><button className="action-btn secondary" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); }}><Copy size={16} />Copiar Link</button></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Seção de Scripts (inclui script, coldcall, whatsapp, objection, email) */}
              {filteredContent.some(item => ['script','coldcall','whatsapp','objection','email'].includes(item.type)) && (
                <section className="content-section-block">
                  <h4 className="content-section-title">Scripts e Modelos</h4>
                  <div className="content-grid">
                    {filteredContent.filter(item => ['script','coldcall','whatsapp','objection','email'].includes(item.type)).map(item => (
                      <div key={item.id} className="guide-card">
                        <div className="guide-icon-container">
                          <div className="guide-icon">{item.icon || '📄'}</div>
                          <div className="guide-type">{getTypeIcon(item.type)}</div>
                        </div>
                        <div className="guide-content">
                          <div className="guide-header"><h4 className="guide-title">{item.title}</h4><button className={`favorite-btn ${favoritos.includes(item.id) ? 'active' : ''}`} onClick={() => toggleFavorite(item.id)}><Heart size={16} /></button></div>
                          <p className="guide-description">{item.description || item.content || item.script || item.body || 'Sem descrição disponível'}</p>
                          <div className="guide-meta"><div className="meta-row"><span className={`difficulty-badge ${getDifficultyColor(item.difficulty)}`}>{item.difficulty || 'Intermediário'}</span><div className="guide-rating">{renderStars(item.rating || 4.8)}<span className="rating-value">({item.rating || 4.8})</span></div></div><div className="meta-row"><div className="read-time"><Clock size={12} /><span>{item.readTime || '5 min'}</span></div></div></div>
                          <div className="guide-tags">{(item.tags || []).map((tag, index) => (<span key={index} className="tag">#{tag}</span>))}</div>
                          <div className="guide-actions"><button className="action-btn primary" onClick={() => openContentModal(item)}><BookOpen size={16} />Acessar</button><button className="action-btn secondary" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); }}><Copy size={16} />Copiar Link</button></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Seção de Cursos */}
              {filteredContent.some(item => item.type === 'course') && (
                <section className="content-section-block">
                  <h4 className="content-section-title">Cursos Estruturados</h4>
                  <div className="content-grid">
                    {filteredContent.filter(item => item.type === 'course').map(item => (
                      <div key={item.id} className="guide-card">
                        <div className="guide-icon-container">
                          <div className="guide-icon">🎓</div>
                          <div className="guide-type">{getTypeIcon(item.type)}</div>
                        </div>
                        <div className="guide-content">
                          <div className="guide-header"><h4 className="guide-title">{item.title}</h4><button className={`favorite-btn ${favoritos.includes(item.id) ? 'active' : ''}`} onClick={() => toggleFavorite(item.id)}><Heart size={16} /></button></div>
                          <p className="guide-description">{item.description || item.content || 'Sem descrição disponível'}</p>
                          <div className="guide-meta"><div className="meta-row"><span className={`difficulty-badge ${getDifficultyColor(item.difficulty)}`}>{item.difficulty || 'Intermediário'}</span><div className="guide-rating">{renderStars(item.rating || 4.8)}<span className="rating-value">({item.rating || 4.8})</span></div></div><div className="meta-row"><div className="read-time"><BookOpen size={12} /><span>{item.modules ? `${item.modules.length} módulos` : 'Curso'}</span></div></div></div>
                          <div className="guide-tags">{(item.tags || []).map((tag, index) => (<span key={index} className="tag">#{tag}</span>))}</div>
                          <div className="guide-actions"><button className="action-btn primary" onClick={() => openContentModal(item)}><BookOpen size={16} />Acessar</button><button className="action-btn secondary" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); }}><Copy size={16} />Copiar Link</button></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="empty-state">
              <Search size={48} className="empty-icon" />
              <h3>Nenhum conteúdo encontrado</h3>
              <p>Tente ajustar seus filtros ou termos de busca.</p>
            </div>
          )}
        </div>
    </div>

      {/* Modal de Visualização de Conteúdo */}
      {showContentModal && selectedContent && (
        <div className="modal-overlay" onClick={closeContentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-title-icon">
                  {getTypeIcon(selectedContent.type)}
                </div>
                <div>
                  <h3 className="modal-title">{selectedContent.title || 'Título não disponível'}</h3>
                  <p className="modal-subtitle">
                    {selectedContent.type === 'video' ? 'Módulo de Treinamento' :
                     selectedContent.type === 'guide' ? 'Artigo da Base de Conhecimento' :
                     selectedContent.type === 'script' ? 'Script de Vendas' :
                     selectedContent.type === 'coldcall' ? 'Técnica de Cold Call' :
                     selectedContent.type === 'whatsapp' ? 'Script WhatsApp' :
                     selectedContent.type === 'objection' ? 'Objeção e Argumentação' :
                     selectedContent.type === 'email' ? 'Template de Email' :
                     selectedContent.type === 'course' ? 'Curso Estruturado' :
                     'Conteúdo'}
                  </p>
                </div>
              </div>
              <button onClick={closeContentModal} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {selectedContent.type === 'video' && (
                <div className="video-content-view">
                  <div className="content-meta">
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>Duração: {selectedContent.duration || 'Não especificado'}</span>
                    </div>
                    <div className="meta-item">
                      <User size={16} />
                      <span>Instrutor: {selectedContent.author || 'Não especificado'}</span>
                    </div>
                    <div className="meta-item">
                      <span className={`difficulty-badge ${getDifficultyColor(selectedContent.difficulty)}`}>
                        {selectedContent.difficulty || 'Intermediário'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="content-description">
                    <h4>Descrição do Módulo</h4>
                    <p>{selectedContent.description || 'Sem descrição disponível'}</p>
                  </div>
                  
                  {selectedContent.videoLink && (
                    <div className="video-link-section">
                      <h4>Assistir Vídeo</h4>
                      <button 
                        className="video-link-btn"
                        onClick={() => handleWatchVideo(selectedContent)}
                      >
                        <Play size={16} />
                        Assistir Agora
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {selectedContent.type === 'guide' && (
                <div className="guide-content-view">
                  <div className="content-meta">
                    <div className="meta-item">
                      <span className={`difficulty-badge ${getDifficultyColor(selectedContent.difficulty)}`}>
                        {selectedContent.difficulty || 'Intermediário'}
                      </span>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>Tempo de leitura: {selectedContent.readTime || '5 min'}</span>
                    </div>
                  </div>
                  
                  <div className="article-content">
                    <h4>Conteúdo do Artigo</h4>
                    <div className="article-text">
                      {selectedContent.content ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedContent.content.replace(/\n/g, '<br>') }} />
                      ) : (
                        <p>Conteúdo não disponível</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {['script', 'coldcall', 'whatsapp', 'objection', 'email'].includes(selectedContent.type) && (
                <div className="script-content-view">
                  <div className="content-meta">
                    <div className="meta-item">
                      <span className={`difficulty-badge ${getDifficultyColor(selectedContent.difficulty)}`}>
                        {selectedContent.difficulty || 'Intermediário'}
                      </span>
                    </div>
                    {selectedContent.type && (
                      <div className="meta-item">
                        <span className="type-badge">
                          {selectedContent.type === 'script' ? 'Script de Vendas' :
                           selectedContent.type === 'coldcall' ? 'Cold Call' :
                           selectedContent.type === 'whatsapp' ? 'WhatsApp' :
                           selectedContent.type === 'objection' ? 'Objeção' :
                           selectedContent.type === 'email' ? 'Email' : selectedContent.type}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="script-content">
                    <h4>
                      {selectedContent.type === 'script' ? 'Script' :
                       selectedContent.type === 'coldcall' ? 'Técnica de Cold Call' :
                       selectedContent.type === 'whatsapp' ? 'Script WhatsApp' :
                       selectedContent.type === 'objection' ? 'Objeção e Argumentação' :
                       selectedContent.type === 'email' ? 'Template de Email' : 'Conteúdo'}
                    </h4>
                    <div className="script-text">
                      {selectedContent.script || selectedContent.content || selectedContent.body || selectedContent.template || 'Conteúdo não disponível'}
                    </div>
                  </div>
                  
                  {selectedContent.type === 'objection' && selectedContent.response && (
                    <div className="objection-response">
                      <h4>Argumentação</h4>
                      <div className="response-text">
                        {selectedContent.response}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {selectedContent.type === 'course' && (
                <div className="course-content-view">
                  <div className="content-meta">
                    <div className="meta-item">
                      <span className={`difficulty-badge ${getDifficultyColor(selectedContent.difficulty)}`}>
                        {selectedContent.difficulty || 'Intermediário'}
                      </span>
                    </div>
                    {selectedContent.modules && Array.isArray(selectedContent.modules) && selectedContent.modules.length > 0 && (
                      <div className="meta-item">
                        <BookOpen size={16} />
                        <span>{selectedContent.modules.length} módulos</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="course-description">
                    <h4>Descrição do Curso</h4>
                    <p>{selectedContent.description || 'Sem descrição disponível'}</p>
                  </div>
                  
                  {selectedContent.modules && Array.isArray(selectedContent.modules) && selectedContent.modules.length > 0 ? (
                    <div className="course-modules">
                      <h4>Módulos do Curso</h4>
                      <div className="modules-list">
                        {selectedContent.modules.map((module, index) => (
                          <div key={index} className="module-item">
                            <div className="module-number">{index + 1}</div>
                            <div className="module-info">
                              <h5>{module.title || `Módulo ${index + 1}`}</h5>
                              <p>{module.description || 'Sem descrição'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="course-modules">
                      <h4>Conteúdo do Curso</h4>
                      <div className="course-content-text">
                        <p>{selectedContent.content || 'Conteúdo não disponível'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {selectedContent.tags && Array.isArray(selectedContent.tags) && selectedContent.tags.length > 0 && (
                <div className="content-tags">
                  <h4>Tags</h4>
                  <div className="tags-list">
                    {selectedContent.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button onClick={closeContentModal} className="btn-secondary">
                Fechar
              </button>
              {selectedContent.id && (
                <button onClick={() => toggleFavorite(selectedContent.id)} className="btn-primary">
                  <Heart size={16} />
                  {favoritos.includes(selectedContent.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .content-section-block {
          margin-bottom: 3.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .content-section-block:last-child {
          border-bottom: none;
        }
        .content-section-title {
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.01em;
          border-left: 4px solid #3b82f6;
          padding-left: 0.75rem;
          background: linear-gradient(90deg, #f1f5f9 60%, transparent 100%);
        }
        .base-conhecimento-page { padding: 2rem; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); min-height: 100vh; position: relative; animation: fadeInUp 0.6s ease-out forwards; }
        .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; color: #64748b; }
        .loading-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; text-align: center; color: #64748b; width: 100%; }
        .empty-icon { margin-bottom: 1rem; opacity: 0.5; }
        .empty-state h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151; }
        .base-conhecimento-page::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03), transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03), transparent 50%), radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.03), transparent 50%); pointer-events: none; }
        .page-header { position: relative; z-index: 1; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15); transition: all 0.3s ease; }
        .page-header:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
        .header-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem; }
        .header-left { flex: 1; }
        .page-title { font-size: 2.25rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; background: linear-gradient(135deg, #1e293b, #475569); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .page-subtitle { color: #64748b; font-size: 1.1rem; font-weight: 500; margin-bottom: 1rem; }
        .header-stats { display: flex; gap: 2rem; flex-wrap: wrap; }
        .stat-item { display: flex; align-items: center; gap: 0.5rem; color: #475569; font-size: 0.9rem; font-weight: 600; }
        .header-actions { display: flex; gap: 1rem; align-items: center; }
        .action-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 600; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .action-btn.primary { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
        .action-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); }
        .action-btn.secondary { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); color: #475569; border: 1px solid rgba(255, 255, 255, 0.3); }
        .action-btn.secondary:hover { background: rgba(255, 255, 255, 0.95); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
        .quick-access-section { position: relative; z-index: 1; margin-bottom: 2rem; }
        .section-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
        .quick-access-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        .quick-access-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15); position: relative; overflow: hidden; }
        .quick-access-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
        .quick-access-icon { font-size: 2rem; width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; background: rgba(59, 130, 246, 0.1); border-radius: 12px; transition: all 0.3s ease; }
        .quick-access-card:hover .quick-access-icon { transform: scale(1.1); background: rgba(59, 130, 246, 0.15); }
        .quick-access-content { flex: 1; }
        .quick-access-title { font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.25rem; }
        .quick-access-count { color: #64748b; font-size: 0.875rem; }
        .quick-access-arrow { color: #64748b; transition: all 0.3s ease; }
        .quick-access-card:hover .quick-access-arrow { transform: translateX(4px); color: #3b82f6; }
        .filters-section { position: relative; z-index: 1; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15); display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .search-container { position: relative; flex: 1; min-width: 300px; }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #64748b; }
        .search-input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 8px; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); color: #1e293b; font-size: 0.875rem; transition: all 0.3s ease; }
        .search-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); background: rgba(255, 255, 255, 0.9); transform: translateY(-1px); }
        .filters-container { display: flex; gap: 1rem; align-items: center; }
        .filter-select { padding: 0.75rem 1rem; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 8px; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); color: #1e293b; font-size: 0.875rem; min-width: 150px; transition: all 0.3s ease; }
        .filter-select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); background: rgba(255, 255, 255, 0.9); transform: translateY(-1px); }
        .filter-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 8px; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); color: #64748b; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; }
        .filter-btn:hover { background: rgba(255, 255, 255, 0.9); color: #1e293b; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); }
        .content-section { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15); overflow: hidden; }
        .section-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(241, 245, 249, 0.8); display: flex; justify-content: space-between; align-items: center; }
        .section-title-container { display: flex; align-items: center; gap: 0.75rem; }
        .section-icon { color: #3b82f6; }
        .section-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0; }
        .section-count { background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
        .section-chevron.expanded { transform: rotate(180deg); }
        .section-content.expanded { padding: 2rem; }
        .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
        
        .video-card, .guide-card { 
          display: flex; 
          flex-direction: column; 
          background: rgba(248, 250, 252, 0.8); 
          border: 1px solid rgba(226, 232, 240, 0.8); 
          border-radius: 16px; 
          transition: all 0.3s ease; 
          position: relative; 
          /* overflow: hidden; Foi removido daqui para corrigir o corte do ícone */
        }
        
        .video-card:hover, .guide-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); border-color: rgba(148, 163, 184, 0.5); }
        .video-thumbnail { position: relative; height: 200px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; border-radius: 12px 12px 0 0; }
        .thumbnail-content { font-size: 4rem; filter: grayscale(0.2); }
        .video-duration { position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0, 0, 0, 0.7); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
        .play-button { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); width: 4rem; height: 4rem; border-radius: 50%; background: rgba(255, 255, 255, 0.9); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #3b82f6; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); opacity: 0; }
        .video-card:hover .play-button { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        .play-button:hover { transform: translate(-50%, -50%) scale(1.1); background: white; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); }
        .video-content, .guide-content { flex-grow: 1; display: flex; flex-direction: column; padding: 1.5rem; position: relative; z-index: 2; }
        .video-header, .guide-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
        .video-title, .guide-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; line-height: 1.3; flex: 1; margin-right: 1rem; }
        .favorite-btn { background: none; border: none; cursor: pointer; padding: 0.25rem; border-radius: 50%; transition: all 0.3s ease; color: #cbd5e1; }
        .favorite-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; transform: scale(1.1); }
        .favorite-btn.active { color: #ef4444; }
        .video-description, .guide-description { color: #64748b; font-size: 0.9rem; line-height: 1.4; margin-bottom: 1rem; flex-grow: 1; min-height: 60px; }
        .video-meta, .guide-meta { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
        .meta-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
        .difficulty-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; border: 1px solid; }
        .text-green-600 { color: #16a34a; border-color: #16a34a; } .bg-green-50 { background-color: #f0fdf4; }
        .text-yellow-600 { color: #ca8a04; border-color: #ca8a04; } .bg-yellow-50 { background-color: #fefce8; }
        .text-red-600 { color: #dc2626; border-color: #dc2626; } .bg-red-50 { background-color: #fef2f2; }
        .text-gray-600 { color: #4b5563; border-color: #4b5563; } .bg-gray-50 { background-color: #f9fafb; }
        .video-rating, .guide-rating { display: flex; align-items: center; gap: 0.25rem; }
        .rating-value { font-size: 0.75rem; color: #64748b; font-weight: 600; margin-left: 0.25rem; }
        .video-stats, .video-author, .read-time { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: #64748b; }
        .video-tags, .guide-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .tag { background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 600; }
        .video-actions, .guide-actions { display: flex; gap: 0.75rem; margin-top: auto; }
        .guide-icon-container { position: relative; margin-bottom: 1rem; }
        .guide-icon { font-size: 3rem; display: flex; align-items: center; justify-content: center; width: 4rem; height: 4rem; background: rgba(59, 130, 246, 0.1); border-radius: 12px; transition: all 0.3s ease; }
        .guide-icon-container:hover .guide-icon { transform: scale(1.05); }
        .guide-type { position: absolute; top: -0.5rem; right: 3rem; background: #3b82f6; color: white; border-radius: 50%; width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); border: 2px solid white; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 1024px) { .content-grid { grid-template-columns: 1fr; } .quick-access-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); } }
        @media (max-width: 768px) { .base-conhecimento-page { padding: 1rem; } .page-title { font-size: 1.875rem; } .header-content { flex-direction: column; text-align: center; align-items: center; } .header-stats { justify-content: center; } .filters-section { flex-direction: column; align-items: stretch; } .search-container { min-width: auto; } .filters-container { flex-direction: column; align-items: stretch; width: 100%; } .video-actions, .guide-actions { flex-direction: row; flex-wrap: wrap; } }
        .text-yellow-400 { color: #facc15; } .fill-current { fill: currentColor; } .text-gray-300 { color: #d1d5db; }
        
        /* Modal Styles */
        .modal-overlay { 
          position: fixed; 
          top: 0; 
          left: 0; 
          right: 0; 
          bottom: 0; 
          background: rgba(0, 0, 0, 0.5); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 1000; 
          padding: 2rem; 
        }
        
        .modal-content { 
          background: white; 
          border-radius: 20px; 
          max-width: 800px; 
          width: 100%; 
          max-height: 90vh; 
          overflow-y: auto; 
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); 
          position: relative;
        }
        
        .modal-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          padding: 2rem 2rem 1rem; 
          border-bottom: 1px solid #e2e8f0; 
        }
        
        .modal-title-section { 
          display: flex; 
          align-items: flex-start; 
          gap: 1rem; 
        }
        
        .modal-title-icon { 
          width: 3rem; 
          height: 3rem; 
          background: rgba(59, 130, 246, 0.1); 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #3b82f6; 
          margin-top: 0.25rem;
        }
        
        .modal-title { 
          font-size: 1.5rem; 
          font-weight: 700; 
          color: #1e293b; 
          margin: 0 0 0.5rem 0; 
        }
        
        .modal-subtitle { 
          color: #64748b; 
          font-size: 0.875rem; 
          margin: 0; 
        }
        
        .modal-close-btn { 
          background: none; 
          border: none; 
          font-size: 1.5rem; 
          cursor: pointer; 
          color: #64748b; 
          padding: 0.5rem; 
          border-radius: 50%; 
          transition: all 0.3s ease; 
        }
        
        .modal-close-btn:hover { 
          background: #f1f5f9; 
          color: #1e293b; 
        }
        
        .modal-body { 
          padding: 2rem; 
        }
        
        .content-meta { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 1rem; 
          margin-bottom: 1.5rem; 
        }
        
        .meta-item { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          color: #64748b; 
          font-size: 0.875rem; 
        }
        
        .content-description, 
        .article-content, 
        .script-content, 
        .objection-response, 
        .course-description { 
          margin-bottom: 1.5rem; 
        }
        
        .content-description h4, 
        .article-content h4, 
        .script-content h4, 
        .objection-response h4, 
        .course-description h4 { 
          font-size: 1.125rem; 
          font-weight: 600; 
          color: #1e293b; 
          margin-bottom: 0.75rem; 
        }
        
        .article-text, 
        .script-text, 
        .response-text { 
          background: #f8fafc; 
          border: 1px solid #e2e8f0; 
          border-radius: 12px; 
          padding: 1.5rem; 
          font-size: 0.9rem; 
          line-height: 1.6; 
          color: #374151; 
          white-space: pre-wrap; 
        }
        
        .video-link-section { 
          margin-bottom: 1.5rem; 
        }
        
        .video-link-btn { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          background: linear-gradient(135deg, #3b82f6, #2563eb); 
          color: white; 
          border: none; 
          border-radius: 8px; 
          padding: 0.75rem 1.5rem; 
          font-weight: 600; 
          cursor: pointer; 
          transition: all 0.3s ease; 
        }
        
        .video-link-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); 
        }
        
        .type-badge { 
          background: rgba(139, 92, 246, 0.1); 
          color: #8b5cf6; 
          padding: 0.25rem 0.75rem; 
          border-radius: 12px; 
          font-size: 0.75rem; 
          font-weight: 600; 
        }
        
        .course-modules { 
          margin-bottom: 1.5rem; 
        }
        
        .course-content-text { 
          background: #f8fafc; 
          border: 1px solid #e2e8f0; 
          border-radius: 12px; 
          padding: 1.5rem; 
          font-size: 0.9rem; 
          line-height: 1.6; 
          color: #374151; 
        }
        
        .modules-list { 
          display: flex; 
          flex-direction: column; 
          gap: 1rem; 
        }
        
        .module-item { 
          display: flex; 
          align-items: flex-start; 
          gap: 1rem; 
          padding: 1rem; 
          background: #f8fafc; 
          border: 1px solid #e2e8f0; 
          border-radius: 8px; 
        }
        
        .module-number { 
          width: 2rem; 
          height: 2rem; 
          background: #3b82f6; 
          color: white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 600; 
          font-size: 0.875rem; 
          flex-shrink: 0; 
        }
        
        .module-info h5 { 
          font-size: 1rem; 
          font-weight: 600; 
          color: #1e293b; 
          margin: 0 0 0.25rem 0; 
        }
        
        .module-info p { 
          color: #64748b; 
          font-size: 0.875rem; 
          margin: 0; 
        }
        
        .content-tags { 
          margin-top: 1.5rem; 
          padding-top: 1.5rem; 
          border-top: 1px solid #e2e8f0; 
        }
        
        .tags-list { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 0.5rem; 
        }
        
        .modal-footer { 
          display: flex; 
          justify-content: flex-end; 
          gap: 1rem; 
          padding: 1.5rem 2rem; 
          border-top: 1px solid #e2e8f0; 
        }
        
        .btn-secondary { 
          background: #f8fafc; 
          border: 1px solid #e2e8f0; 
          color: #64748b; 
          padding: 0.75rem 1.5rem; 
          border-radius: 8px; 
          font-weight: 600; 
          cursor: pointer; 
          transition: all 0.3s ease; 
        }
        
        .btn-secondary:hover { 
          background: #f1f5f9; 
          border-color: #cbd5e1; 
          color: #475569; 
        }
        
        .btn-primary { 
          background: linear-gradient(135deg, #3b82f6, #2563eb); 
          color: white; 
          border: none; 
          padding: 0.75rem 1.5rem; 
          border-radius: 8px; 
          font-weight: 600; 
          cursor: pointer; 
          transition: all 0.3s ease; 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
        }
        
        .btn-primary:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); 
        }
        
        @media (max-width: 768px) { 
          .modal-overlay { 
            padding: 1rem; 
          }
          
          .modal-content { 
            max-height: 95vh; 
          }
          
          .modal-header { 
            padding: 1.5rem; 
          }
          
          .modal-body { 
            padding: 1.5rem; 
          }
          
          .modal-footer { 
            padding: 1.5rem; 
            flex-direction: column; 
          }
          
          .content-meta { 
            flex-direction: column; 
            gap: 0.5rem; 
          }
        }
      `}</style>
    </div>
  );
}

export default BaseConhecimento;