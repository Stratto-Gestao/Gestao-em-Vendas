import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { FileText, Library, Star, Video } from 'lucide-react';

const AcademiaPage = () => {
  const { currentUser } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null); // Para visualizar um script completo

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch Modules
        const modulesCollection = collection(db, 'modules');
        const q = query(modulesCollection, orderBy('createdAt', 'desc'));
        const moduleSnapshot = await getDocs(q);
        const modulesList = moduleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setModules(modulesList);

        // Fetch Articles
        const articlesCollection = collection(db, 'articles');
        const articlesQuery = query(articlesCollection, orderBy('createdAt', 'desc'));
        const articlesSnapshot = await getDocs(articlesQuery);
        const articlesList = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticles(articlesList);

        // Fetch Scripts
        const scriptsCollection = collection(db, 'scripts');
        const scriptsQuery = query(scriptsCollection, orderBy('createdAt', 'desc'));
        const scriptsSnapshot = await getDocs(scriptsQuery);
        const scriptsList = scriptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setScripts(scriptsList);

        // Fetch User Data
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [currentUser]);

  const handleVideoClick = (module) => {
    const url = module.videoLink || module.courseLink;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert("Nenhum link disponível para este módulo.");
    }
  };

  const handleMarkAsCompleted = async (event, moduleId, points) => {
    event.stopPropagation();
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        completedModules: arrayUnion(moduleId),
        'stats.totalPoints': increment(points)
      });

      setUserData(prevData => ({
        ...prevData,
        completedModules: [...(prevData.completedModules || []), moduleId],
        stats: {
          ...prevData.stats,
          totalPoints: (prevData.stats?.totalPoints || 0) + points,
        }
      }));
      alert(`Parabéns! Você ganhou ${points} pontos!`);
    } catch (error) {
      console.error("Erro ao marcar como concluído:", error);
      alert("Ocorreu um erro ao registrar sua pontuação.");
    }
  };

  const videoModules = modules.filter(module => module.type === 'video_course');

  if (loading) {
    return <p>Carregando academia...</p>;
  }

  return (
    <div className="academia-page">
      <div className="page-header">
        <h1 className="main-title">Academia de Conhecimento</h1>
        <p className="main-subtitle">Aqui você encontra todos os materiais para seu aprendizado e desenvolvimento.</p>
      </div>

      <div className="modules-grid">
        <div className="academy-card" onClick={() => setShowVideoModal(true)}>
            <div className="academy-card-icon-wrapper"><Video size={32} /></div>
            <h3 className="academy-card-title">Vídeos Educativos</h3>
            <p className="academy-card-subtitle">{videoModules.length} {videoModules.length === 1 ? 'vídeo disponível' : 'vídeos disponíveis'}</p>
        </div>
        <div className="academy-card" onClick={() => setShowArticleModal(true)}>
            <div className="academy-card-icon-wrapper"><FileText size={32} /></div>
            <h3 className="academy-card-title">Artigos e Textos</h3>
            <p className="academy-card-subtitle">{articles.length} {articles.length === 1 ? 'artigo disponível' : 'artigos disponíveis'}</p>
        </div>
        <div className="academy-card" onClick={() => setShowScriptModal(true)}>
            <div className="academy-card-icon-wrapper"><Library size={32} /></div>
            <h3 className="academy-card-title">Biblioteca de Vendas</h3>
            <p className="academy-card-subtitle">{scripts.length} {scripts.length === 1 ? 'script disponível' : 'scripts disponíveis'}</p>
        </div>
      </div>

      {/* Modal Vídeos */}
      {showVideoModal && (
        <div className="modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="video-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Vídeos Educativos</h3>
              <button onClick={() => setShowVideoModal(false)} className="close-button">&times;</button>
            </div>
            <div className="video-list-content">
              {videoModules.length > 0 ? (
                videoModules.map(video => {
                  const isCompleted = userData?.completedModules?.includes(video.id);
                  return (
                    <div 
                      key={video.id} 
                      className="video-item-card"
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className="video-thumbnail-placeholder"><Video size={48} /></div>
                      <div className="video-info">
                        <h4 className="video-title">{video.title}</h4>
                        <p className="video-points"><Star size={14} /> {video.points} Pontos</p>
                      </div>
                      <button 
                        className={`video-complete-button ${isCompleted ? 'completed' : ''}`}
                        onClick={(e) => handleMarkAsCompleted(e, video.id, video.points)}
                        disabled={isCompleted}
                      >
                        {isCompleted ? 'Concluído ✔' : 'Marcar como Concluído'}
                      </button>
                    </div>
                  )
                })
              ) : (
                <p>Nenhum vídeo educativo foi adicionado ainda.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Lista de Artigos */}
      {showArticleModal && !selectedArticle && (
        <div className="modal-overlay" onClick={() => setShowArticleModal(false)}>
          <div className="video-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Artigos e Textos</h3>
              <button onClick={() => setShowArticleModal(false)} className="close-button">&times;</button>
            </div>
            <div className="video-list-content">
              {articles.length > 0 ? (
                articles.map(article => (
                  <div key={article.id} className="video-item-card" onClick={() => setSelectedArticle(article)}>
                    <div className="video-thumbnail-placeholder"><FileText size={48} /></div>
                    <div className="video-info">
                      <h4 className="video-title">{article.title}</h4>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum artigo foi adicionado ainda.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualização de Artigo */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="video-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedArticle.title}</h3>
              <button onClick={() => setSelectedArticle(null)} className="close-button">&times;</button>
            </div>
            <div className="video-list-content" style={{padding: '1rem', whiteSpace: 'pre-wrap'}}>
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}

      {/* Modal Lista de Scripts */}
      {showScriptModal && !selectedScript && (
        <div className="modal-overlay" onClick={() => setShowScriptModal(false)}>
          <div className="video-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Biblioteca de Vendas</h3>
              <button onClick={() => setShowScriptModal(false)} className="close-button">&times;</button>
            </div>
            <div className="video-list-content">
              {scripts.length > 0 ? (
                scripts.map(script => {
                  const content = script.description || script.content || '';
                  return (
                    <div key={script.id} className="video-item-card" onClick={() => setSelectedScript(script)}>
                      <div className="video-thumbnail-placeholder"><Library size={48} /></div>
                      <div className="video-info">
                        <h4 className="video-title">{script.title}</h4>
                        <p className="video-content-preview">
                          {content.substring(0, 100)}{content.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Nenhum script de vendas foi adicionado ainda.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualização de Script */}
      {selectedScript && (
        <div className="modal-overlay" onClick={() => setSelectedScript(null)}>
          <div className="video-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedScript.title}</h3>
              <button onClick={() => setSelectedScript(null)} className="close-button">&times;</button>
            </div>
            <div className="video-list-content" style={{padding: '1rem', whiteSpace: 'pre-wrap'}}>
              {selectedScript.description || selectedScript.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademiaPage;