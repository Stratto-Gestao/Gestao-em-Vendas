import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, BookOpen, Play, FileText, Download, Eye, Star,
  Clock, User, Tag, TrendingUp, Award, Target, Lightbulb, Video,
  File, Headphones, Book, MessageSquare, HelpCircle, Zap, Brain,
  CheckCircle, ArrowRight, ExternalLink, Bookmark, Share2, Copy,
  Calendar, Users, Globe, Smartphone, Monitor, Tablet, ChevronDown,
  ChevronRight, Heart, ThumbsUp, BarChart3, PieChart, LineChart,
  Phone, Mail, Settings, Info, AlertCircle, RefreshCw, Plus
} from 'lucide-react';

function BaseConhecimento() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  // Dados dos vídeos de treinamento
  const videosData = [];

  // Dados dos guias e artigos
  const guidesData = [];

  // Dados das ferramentas e recursos
  const toolsData = [];

  // Combinar todos os dados
  const allContent = [...videosData, ...guidesData, ...toolsData];

  // Filtrar conteúdo
  const filteredContent = allContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    const matchesType = selectedType === '' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Categorias e tipos únicos
  const categories = [...new Set(allContent.map(item => item.category))];
  const types = [...new Set(allContent.map(item => item.type))];

  // Estatísticas
  const stats = {
    totalVideos: videosData.length,
    totalGuias: guidesData.filter(item => item.type === 'guide').length,
    totalScripts: guidesData.filter(item => item.type === 'script').length,
    totalFerramentas: toolsData.length,
    totalVisualizacoes: videosData.reduce((sum, video) => sum + video.views, 0),
    favoritos: favoritos.length
  };

  // Funções
  const toggleFavorite = (id) => {
    setFavoritos(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
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
      case 'tool': return <Settings size={16} />;
      case 'qa': return <HelpCircle size={16} />;
      default: return <File size={16} />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
      />
    ));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const quickAccessData = [
    { name: 'Técnicas de Cold Call', icon: '📞', count: 15, category: 'scripts' },
    { name: 'Metodologia BANT', icon: '✅', count: 8, category: 'guides' },
    { name: 'Objeções Comuns', icon: '🛡️', count: 12, category: 'responses' },
    { name: 'Templates de Email', icon: '✉️', count: 20, category: 'templates' },
    { name: 'Calculadoras', icon: '🧮', count: 5, category: 'tools' },
    { name: 'Vídeos de Treinamento', icon: '🎥', count: 25, category: 'videos' }
  ];

  return (
    <div className="base-conhecimento-page">
      {/* Header Principal */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Base de Conhecimento</h1>
            <p className="page-subtitle">Central completa de aprendizado e recursos para SDRs</p>
            <div className="header-stats">
              <div className="stat-item">
                <Video size={16} />
                <span>{stats.totalVideos} vídeos</span>
              </div>
              <div className="stat-item">
                <BookOpen size={16} />
                <span>{stats.totalGuias} guias</span>
              </div>
              <div className="stat-item">
                <FileText size={16} />
                <span>{stats.totalScripts} scripts</span>
              </div>
              <div className="stat-item">
                <Settings size={16} />
                <span>{stats.totalFerramentas} ferramentas</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn secondary">
              <RefreshCw size={16} />
              Atualizar
            </button>
            <button className="action-btn primary">
              <Plus size={16} />
              Sugerir Conteúdo
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Play size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalVisualizacoes.toLocaleString()}</div>
            <div className="stat-label">Visualizações Totais</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              +18% este mês
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Brain size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{allContent.length}</div>
            <div className="stat-label">Conteúdos Disponíveis</div>
            <div className="stat-trend positive">
              <Zap size={12} />
              Sempre atualizando
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">4.8</div>
            <div className="stat-label">Avaliação Média</div>
            <div className="stat-trend">
              {renderStars(4.8)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Heart size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.favoritos}</div>
            <div className="stat-label">Seus Favoritos</div>
            <div className="stat-trend">
              <Bookmark size={12} />
              Salvos para depois
            </div>
          </div>
        </div>
      </div>

      {/* Acesso Rápido */}
      <div className="quick-access-section">
        <h3 className="section-title">Acesso Rápido</h3>
        <div className="quick-access-grid">
          {quickAccessData.map((item, index) => (
            <div key={index} className="quick-access-card">
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

      {/* Filtros e Busca */}
      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar por título, descrição ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Tipos</option>
            <option value="video">Vídeos</option>
            <option value="guide">Guias</option>
            <option value="script">Scripts</option>
            <option value="document">Documentos</option>
            <option value="course">Cursos</option>
            <option value="tool">Ferramentas</option>
            <option value="qa">Perguntas & Respostas</option>
          </select>

          <button className="filter-btn">
            <Filter size={16} />
            Filtros Avançados
          </button>
        </div>
      </div>

      {/* Seções de Conteúdo */}
      <div className="content-sections">
        {/* Vídeos de Treinamento */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('videos')}>
            <div className="section-title-container">
              <Video className="section-icon" size={20} />
              <h3 className="section-title">Vídeos de Treinamento</h3>
              <span className="section-count">({videosData.length})</span>
            </div>
            <ChevronDown 
              className={`section-chevron ${expandedSections.videos ? 'expanded' : ''}`} 
              size={20} 
            />
          </div>
          
          <div className={`section-content ${expandedSections.videos ? 'expanded' : ''}`}>
            <div className="videos-grid">
              {videosData.map(video => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail">
                    <div className="thumbnail-content">{video.thumbnail}</div>
                    <div className="video-duration">{video.duration}</div>
                    <button className="play-button">
                      <Play size={24} />
                    </button>
                  </div>
                  
                  <div className="video-content">
                    <div className="video-header">
                      <h4 className="video-title">{video.title}</h4>
                      <button 
                        className={`favorite-btn ${favoritos.includes(video.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(video.id)}
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                    
                    <p className="video-description">{video.description}</p>
                    
                    <div className="video-meta">
                      <div className="meta-row">
                        <span className={`difficulty-badge ${getDifficultyColor(video.difficulty)}`}>
                          {video.difficulty}
                        </span>
                        <div className="video-rating">
                          {renderStars(video.rating)}
                          <span className="rating-value">({video.rating})</span>
                        </div>
                      </div>
                      
                      <div className="meta-row">
                        <div className="video-stats">
                          <Eye size={12} />
                          <span>{video.views} visualizações</span>
                        </div>
                        <div className="video-author">
                          <User size={12} />
                          <span>{video.author}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="video-tags">
                      {video.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                    
                    <div className="video-actions">
                      <button className="action-btn primary">
                        <Play size={16} />
                        Assistir
                      </button>
                      <button className="action-btn secondary">
                        <Bookmark size={16} />
                        Salvar
                      </button>
                      <button className="action-btn secondary">
                        <Share2 size={16} />
                        Compartilhar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guias e Documentos */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('guides')}>
            <div className="section-title-container">
              <BookOpen className="section-icon" size={20} />
              <h3 className="section-title">Guias e Documentos</h3>
              <span className="section-count">({guidesData.length})</span>
            </div>
            <ChevronDown 
              className={`section-chevron ${expandedSections.guides ? 'expanded' : ''}`} 
              size={20} 
            />
          </div>
          
          <div className={`section-content ${expandedSections.guides ? 'expanded' : ''}`}>
            <div className="guides-grid">
              {guidesData.map(guide => (
                <div key={guide.id} className="guide-card">
                  <div className="guide-icon-container">
                    <div className="guide-icon">{guide.icon}</div>
                    <div className="guide-type">{getTypeIcon(guide.type)}</div>
                  </div>
                  
                  <div className="guide-content">
                    <div className="guide-header">
                      <h4 className="guide-title">{guide.title}</h4>
                      <button 
                        className={`favorite-btn ${favoritos.includes(guide.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(guide.id)}
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                    
                    <p className="guide-description">{guide.description}</p>
                    
                    <div className="guide-meta">
                      <span className={`difficulty-badge ${getDifficultyColor(guide.difficulty)}`}>
                        {guide.difficulty}
                      </span>
                      <div className="read-time">
                        <Clock size={12} />
                        <span>{guide.readTime}</span>
                      </div>
                      <div className="guide-rating">
                        {renderStars(guide.rating)}
                        <span className="rating-value">({guide.rating})</span>
                      </div>
                    </div>
                    
                    <div className="guide-tags">
                      {guide.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                    
                    <div className="guide-actions">
                      <button className="action-btn primary">
                        <BookOpen size={16} />
                        Acessar
                      </button>
                      <button className="action-btn secondary">
                        <Download size={16} />
                        Download
                      </button>
                      <button className="action-btn secondary">
                        <Copy size={16} />
                        Copiar Link
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ferramentas e Recursos */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('tools')}>
            <div className="section-title-container">
              <Settings className="section-icon" size={20} />
              <h3 className="section-title">Ferramentas e Recursos</h3>
              <span className="section-count">({toolsData.length})</span>
            </div>
            <ChevronDown 
              className={`section-chevron ${expandedSections.tools ? 'expanded' : ''}`} 
              size={20} 
            />
          </div>
          
          <div className={`section-content ${expandedSections.tools ? 'expanded' : ''}`}>
            <div className="tools-grid">
              {toolsData.map(tool => (
                <div key={tool.id} className="tool-card">
                  <div className="tool-icon-container">
                    <div className="tool-icon">{tool.icon}</div>
                    {tool.isExternal && <ExternalLink className="external-icon" size={12} />}
                  </div>
                  
                  <div className="tool-content">
                    <h4 className="tool-title">{tool.title}</h4>
                    <p className="tool-description">{tool.description}</p>
                    <span className="tool-category">{tool.category}</span>
                  </div>
                  
                  <div className="tool-actions">
                    <button className="action-btn primary full-width">
                      <Zap size={16} />
                      Usar Ferramenta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Ajuda e Suporte */}
      <div className="help-section">
        <div className="help-header">
          <h3 className="section-title">Precisa de Ajuda?</h3>
          <p className="section-subtitle">Nossa equipe está sempre pronta para ajudar você</p>
        </div>
        
        <div className="help-grid">
          <div className="help-card">
            <div className="help-icon">
              <MessageSquare size={24} />
            </div>
            <h4 className="help-title">Chat ao Vivo</h4>
            <p className="help-description">Converse com nosso time de suporte em tempo real</p>
            <button className="help-btn">
              Iniciar Chat
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="help-card">
            <div className="help-icon">
              <HelpCircle size={24} />
            </div>
            <h4 className="help-title">FAQ</h4>
            <p className="help-description">Encontre respostas para as perguntas mais frequentes</p>
            <button className="help-btn">
              Ver FAQ
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="help-card">
            <div className="help-icon">
              <Mail size={24} />
            </div>
            <h4 className="help-title">Suporte por Email</h4>
            <p className="help-description">Envie sua dúvida e receba uma resposta detalhada</p>
            <button className="help-btn">
              Enviar Email
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .base-conhecimento-page {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .base-conhecimento-page::before {
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
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 600;
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

        .action-btn.full-width {
          width: 100%;
          justify-content: center;
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

        /* Acesso Rápido */
        .quick-access-section {
          position: relative;
          z-index: 1;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .quick-access-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }

        .quick-access-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .quick-access-card:hover::before {
          left: 100%;
        }

        .quick-access-card:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .quick-access-icon {
          font-size: 2rem;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .quick-access-card:hover .quick-access-icon {
          transform: scale(1.1);
          background: rgba(59, 130, 246, 0.15);
        }

        .quick-access-content {
          flex: 1;
        }

        .quick-access-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .quick-access-count {
          color: #64748b;
          font-size: 0.875rem;
        }

        .quick-access-arrow {
          color: #64748b;
          transition: all 0.3s ease;
        }

        .quick-access-card:hover .quick-access-arrow {
          transform: translateX(4px);
          color: #3b82f6;
        }

        /* Filtros */
        .filters-section {
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
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
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

        .filters-container {
          display: flex;
          gap: 1rem;
          align-items: center;
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

        .filter-btn {
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

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        /* Seções de Conteúdo */
        .content-sections {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .content-section {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          overflow: hidden;
        }

        .section-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .section-header:hover {
          background: rgba(248, 250, 252, 0.5);
        }

        .section-title-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-icon {
          color: #3b82f6;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .section-count {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .section-chevron {
          color: #64748b;
          transition: transform 0.3s ease;
        }

        .section-chevron.expanded {
          transform: rotate(180deg);
        }

        .section-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .section-content.expanded {
          max-height: 2000px;
          padding: 2rem;
        }

        /* Grids de Conteúdo */
        .videos-grid,
        .guides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        /* Cards de Vídeo */
        .video-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .video-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
          z-index: 1;
        }

        .video-card:hover::before {
          left: 100%;
        }

        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .video-thumbnail {
          position: relative;
          height: 200px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .thumbnail-content {
          font-size: 4rem;
          filter: grayscale(0.2);
        }

        .video-duration {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .play-button:hover {
          transform: translate(-50%, -50%) scale(1.1);
          background: white;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .video-content {
          padding: 1.5rem;
          position: relative;
          z-index: 2;
        }

        .video-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .video-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
          flex: 1;
          margin-right: 1rem;
        }

        .favorite-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          transition: all 0.3s ease;
          color: #cbd5e1;
        }

        .favorite-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          transform: scale(1.1);
        }

        .favorite-btn.active {
          color: #ef4444;
        }

        .video-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .video-meta,
        .guide-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .difficulty-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid;
        }

        .text-green-600 { color: #16a34a; }
        .text-yellow-600 { color: #ca8a04; }
        .text-red-600 { color: #dc2626; }
        .text-gray-600 { color: #4b5563; }
        .bg-green-50 { background-color: #f0fdf4; }
        .bg-yellow-50 { background-color: #fefce8; }
        .bg-red-50 { background-color: #fef2f2; }
        .bg-gray-50 { background-color: #f9fafb; }

        .video-rating,
        .guide-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .rating-value {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .video-stats {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .video-author {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .read-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .video-tags,
        .guide-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .tag {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .video-actions,
        .guide-actions {
          display: flex;
          gap: 0.75rem;
        }

        /* Cards de Guia */
        .guide-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .guide-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .guide-card:hover::before {
          left: 100%;
        }

        .guide-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .guide-icon-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .guide-icon {
          font-size: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 4rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 12px;
        }

        .guide-type {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .guide-content {
          position: relative;
          z-index: 2;
        }

        .guide-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .guide-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
          flex: 1;
          margin-right: 1rem;
        }

        .guide-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        /* Cards de Ferramentas */
        .tool-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .tool-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .tool-card:hover::before {
          left: 100%;
        }

        .tool-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .tool-icon-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .tool-icon {
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3.5rem;
          height: 3.5rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 12px;
        }

        .external-icon {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          background: #8b5cf6;
          color: white;
          border-radius: 50%;
          width: 1rem;
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tool-content {
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .tool-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .tool-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .tool-category {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .tool-actions {
          margin-top: auto;
        }

        /* Seção de Ajuda */
        .help-section {
          position: relative;
          z-index: 1;
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

        .help-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }

        .help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .help-card {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .help-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .help-card:hover::before {
          left: 100%;
        }

        .help-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .help-icon {
          width: 3.5rem;
          height: 3.5rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: #3b82f6;
          transition: all 0.3s ease;
        }

        .help-card:hover .help-icon {
          transform: scale(1.1);
          background: rgba(59, 130, 246, 0.15);
        }

        .help-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .help-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1.5rem;
        }

        .help-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .help-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .help-btn:hover::before {
          left: 100%;
        }

        .help-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
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

        /* Estados iniciais expandidos */
        .section-content.expanded {
          max-height: none;
        }

        /* Animações escalonadas */
        .video-card:nth-child(1),
        .guide-card:nth-child(1),
        .tool-card:nth-child(1) {
          animation-delay: 0.1s;
        }

        .video-card:nth-child(2),
        .guide-card:nth-child(2),
        .tool-card:nth-child(2) {
          animation-delay: 0.2s;
        }

        .video-card:nth-child(3),
        .guide-card:nth-child(3),
        .tool-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        .video-card:nth-child(4),
        .guide-card:nth-child(4),
        .tool-card:nth-child(4) {
          animation-delay: 0.4s;
        }

        /* Responsividade */
        @media (max-width: 1024px) {
          .videos-grid,
          .guides-grid {
            grid-template-columns: 1fr;
          }

          .tools-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }

          .quick-access-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .base-conhecimento-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.875rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .header-stats {
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            min-width: auto;
          }

          .filters-container {
            flex-direction: column;
          }

          .video-actions,
          .guide-actions {
            flex-direction: column;
          }

          .meta-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .help-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .page-header,
          .content-section,
          .help-section {
            padding: 1.5rem;
          }

          .video-card,
          .guide-card,
          .tool-card,
          .help-card {
            padding: 1rem;
          }

          .stat-card {
            padding: 1rem;
          }

          .section-content.expanded {
            padding: 1.5rem;
          }

          .video-thumbnail {
            height: 150px;
          }

          .thumbnail-content {
            font-size: 3rem;
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
        .help-btn:focus,
        .filter-btn:focus,
        .play-button:focus,
        .favorite-btn:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .content-section,
          .help-section,
          .video-card,
          .guide-card,
          .tool-card,
          .help-card {
            border: 2px solid #1e293b;
          }
          
          .page-title,
          .section-title,
          .video-title,
          .guide-title,
          .tool-title,
          .help-title {
            color: #000;
          }
        }

        /* Print Styles */
        @media print {
          .base-conhecimento-page {
            background: white;
          }
          
          .page-header,
          .content-section,
          .help-section,
          .video-card,
          .guide-card,
          .tool-card {
            background: white;
            border: 1px solid #000;
            box-shadow: none;
          }
          
          .action-btn,
          .help-btn,
          .filter-btn,
          .play-button {
            display: none;
          }
        }

        /* Melhorias específicas */
        .video-thumbnail::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(0,0,0,0.1), transparent);
        }

        .guide-icon-container:hover .guide-icon {
          transform: scale(1.05);
        }

        .tool-icon-container:hover .tool-icon {
          transform: scale(1.05);
        }

        /* Estados de loading */
        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Indicadores visuais */
        .new-content::after {
          content: 'NOVO';
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #ef4444;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .popular-content::after {
          content: 'POPULAR';
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #f59e0b;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* Micro-interações */
        .play-button {
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .video-card:hover .play-button {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }

        /* Customização do scrollbar */
        .section-content::-webkit-scrollbar {
          width: 6px;
        }

        .section-content::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }

        .section-content::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }

        .section-content::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }

        /* Estados ativos */
        .quick-access-card.active {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .filter-select.active,
        .search-input.active {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        /* Melhorias de tipografia */
        .video-title,
        .guide-title,
        .tool-title,
        .help-title {
          letter-spacing: -0.025em;
        }

        .page-title {
          letter-spacing: -0.05em;
        }

        /* Expansão automática das seções populares */
        .content-section:first-child .section-content {
          max-height: none;
          padding: 2rem;
        }

        .content-section:first-child .section-chevron {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}

export default BaseConhecimento;