import React, { useState } from 'react';
import { Award, Star, Trophy, Target, ShieldCheck, Zap, Gem, Crown, User, HelpCircle, Gift, Coffee, Headphones, Plane } from 'lucide-react';

const Gamificacao = () => {
  // Mock data - Em uma aplicação real, estes dados viriam da sua API
  const [currentUserStats, setCurrentUserStats] = useState({
    points: 4280,
    rank: 4,
    achievements: 8,
    missions: 2,
    nextLevelPoints: 5000,
  });

  const [leaderboardData, setLeaderboardData] = useState([
    { rank: 1, name: 'Ana Costa', points: 7150, avatar: 'AC', isCurrentUser: false, trend: 'up' },
    { rank: 2, name: 'Bruno Silva', points: 6890, avatar: 'BS', isCurrentUser: false, trend: 'up' },
    { rank: 3, name: 'Carlos Mendes', points: 5520, avatar: 'CM', isCurrentUser: false, trend: 'down' },
    { rank: 4, name: 'Você', points: 4280, avatar: 'VC', isCurrentUser: true, trend: 'up' },
    { rank: 5, name: 'Daniela Lima', points: 3910, avatar: 'DL', isCurrentUser: false, trend: 'down' },
    { rank: 6, name: 'Eduardo Reis', points: 3750, avatar: 'ER', isCurrentUser: false, trend: 'up' },
    { rank: 7, name: 'Fernanda Dias', points: 3400, avatar: 'FD', isCurrentUser: false, trend: 'up' },
  ]);

  const [achievementsData, setAchievementsData] = useState([
    { id: 1, name: 'Primeiro Negócio', icon: Star, unlocked: true, description: 'Feche seu primeiro negócio na plataforma.' },
    { id: 2, name: 'Rei do Contato', icon: User, unlocked: true, description: 'Realize 50 ligações em uma semana.' },
    { id: 3, name: 'Mestre da Proposta', icon: Award, unlocked: true, description: 'Envie 10 propostas com mais de 80% de aceite.' },
    { id: 4, name: 'Vendedor de Elite', icon: Crown, unlocked: true, description: 'Alcance R$ 100.000 em vendas no mês.' },
    { id: 5, name: 'Imbatível', icon: ShieldCheck, unlocked: false, description: 'Fique em 1º lugar no ranking por 3 meses seguidos.' },
    { id: 6, name: 'Tubarão de Vendas', icon: Gem, unlocked: false, description: 'Feche um negócio acima de R$ 500.000.' },
    { id: 7, name: 'Velocista', icon: Zap, unlocked: true, description: 'Feche 5 negócios em uma única semana.' },
    { id: 8, name: 'Maratonista', icon: Trophy, unlocked: false, description: 'Complete 100% de todas as missões em um mês.' },
  ]);

  const [missionsData, setMissionsData] = useState([
    { id: 1, title: 'Missão Semanal: Follow-up', description: 'Realize 20 atividades de follow-up.', reward: 250, progress: 15, goal: 20 },
    { id: 2, title: 'Desafio do Ticket Médio', description: 'Aumente seu ticket médio em 15%.', reward: 500, progress: 8, goal: 15 },
    { id: 3, title: 'Conquista Rápida: Novo Lead', description: 'Qualifique 5 novos leads hoje.', reward: 100, progress: 4, goal: 5 },
  ]);
  
  // NOVO: Mock data para os prêmios
  const [rewardsData, setRewardsData] = useState([
      { id: 1, name: 'Vale-presente iFood R$50', cost: 2500, icon: Gift },
      { id: 2, name: 'Café da Tarde com a Diretoria', cost: 4000, icon: Coffee },
      { id: 3, name: 'Meio Dia de Folga', cost: 7500, icon: Plane },
      { id: 4, name: 'Headset Gamer Pro', cost: 10000, icon: Headphones },
  ]);

  const getRankColor = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'default';
  };

  return (
    <div className="gamificacao-page">
      {/* Cabeçalho da Página */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Painel de Gamificação</h1>
            <p className="page-subtitle">Acompanhe seu progresso, compita e ganhe recompensas!</p>
          </div>
          <div className="header-actions">
            <button className="action-btn secondary">
              <HelpCircle size={16} />
              Como funciona?
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas Rápidas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <Star size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{currentUserStats.points.toLocaleString('pt-BR')}</div>
            <div className="stat-label">Meus Pontos (XP)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">#{currentUserStats.rank}</div>
            <div className="stat-label">Posição no Ranking</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{currentUserStats.achievements}</div>
            <div className="stat-label">Conquistas Desbloqueadas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{currentUserStats.missions}</div>
            <div className="stat-label">Missões Ativas</div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal da Página (Layout de 2 Colunas) */}
      <div className="main-content-grid">
        {/* Coluna da Esquerda */}
        <div className="main-column">
          <div className="content-card leaderboard-card">
            <h3 className="card-title">
              <Trophy size={20} /> Ranking de Performance
            </h3>
            <ul className="leaderboard-list">
              {leaderboardData.map(user => (
                <li key={user.rank} className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''} rank-${getRankColor(user.rank)}`}>
                  <div className="rank-details">
                    <span className="rank-position">#{user.rank}</span>
                    <div className="user-avatar">{user.avatar}</div>
                    <span className="user-name">{user.name}</span>
                  </div>
                  <div className="points-details">
                    <span className="user-points">{user.points.toLocaleString('pt-BR')} XP</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="content-card missions-card">
            <h3 className="card-title">
              <Target size={20} /> Missões e Desafios
            </h3>
            <div className="missions-list">
              {missionsData.map(mission => {
                const progressPercentage = (mission.progress / mission.goal) * 100;
                return (
                  <div key={mission.id} className="mission-item">
                    <div className="mission-header">
                      <h4 className="mission-title">{mission.title}</h4>
                      <span className="mission-reward">+{mission.reward} XP</span>
                    </div>
                    <p className="mission-description">{mission.description}</p>
                    <div className="mission-progress">
                      <div className="progress-bar-background">
                        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                      <span className="progress-text">{mission.progress}/{mission.goal}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna da Direita */}
        <div className="main-column">
           <div className="content-card user-progress-card">
             <h3 className="card-title">Meu Progresso</h3>
             <div className="level-info">
               <span>Nível Atual: Mestre</span>
               <span>Próximo Nível: Lenda</span>
             </div>
             <div className="progress-bar-background large">
               <div className="progress-bar-fill gradient" style={{ width: `${(currentUserStats.points / currentUserStats.nextLevelPoints) * 100}%` }}>
                 <span className="xp-text">{currentUserStats.points.toLocaleString('pt-BR')} / {currentUserStats.nextLevelPoints.toLocaleString('pt-BR')} XP</span>
               </div>
             </div>
          </div>
          {/* NOVO CARD DE PRÊMIOS */}
          <div className="content-card rewards-card">
            <h3 className="card-title">
                <Gift size={20} /> Loja de Prêmios
            </h3>
            <div className="user-points-display">
                <span>Seus Pontos:</span>
                <span className="points-value">{currentUserStats.points.toLocaleString('pt-BR')} XP</span>
            </div>
            <ul className="rewards-list">
                {rewardsData.map(reward => (
                    <li key={reward.id} className="reward-item">
                        <div className="reward-info">
                            <div className="reward-icon">
                                <reward.icon size={22} />
                            </div>
                            <div>
                                <p className="reward-name">{reward.name}</p>
                                <p className="reward-cost">{reward.cost.toLocaleString('pt-BR')} XP</p>
                            </div>
                        </div>
                        <button 
                          className="redeem-btn" 
                          disabled={currentUserStats.points < reward.cost}
                        >
                          Resgatar
                        </button>
                    </li>
                ))}
            </ul>
          </div>
          <div className="content-card achievements-card">
            <h3 className="card-title">
              <Award size={20} /> Medalhas e Conquistas
            </h3>
            <div className="achievements-grid">
              {achievementsData.map(ach => (
                <div key={ach.id} className={`achievement-badge ${ach.unlocked ? 'unlocked' : 'locked'}`} data-tooltip={ach.description}>
                  <ach.icon size={32} />
                  <span className="achievement-name">{ach.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Animações e Estilos Globais */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gamificacao-page {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          animation: fadeInUp 0.6s ease-out;
        }

        /* Estilos Reutilizados do Projeto */
        .page-header {
          position: relative;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1e293b;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 1.1rem;
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
        }
        
        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          color: #475569;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .action-btn:hover {
           transform: translateY(-4px);
           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }

        .stat-icon {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.purple { background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.1)); color: #8b5cf6; }
        .stat-icon.blue { background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.1)); color: #3b82f6; }
        .stat-icon.green { background: linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.1)); color: #10b981; }
        .stat-icon.orange { background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1)); color: #f59e0b; }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        /* Layout Principal */
        .main-content-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          align-items: start;
        }
        
        .main-column {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .content-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .content-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Coluna do Ranking */
        .leaderboard-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .leaderboard-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: rgba(248, 250, 252, 0.7);
          transition: all 0.3s ease;
        }
        
        .leaderboard-item:hover {
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.9);
        }
        
        .leaderboard-item.current-user {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .rank-details, .points-details {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .rank-position {
          font-size: 1rem;
          font-weight: 700;
          color: #64748b;
          width: 2rem;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }
        
        .user-name {
          font-weight: 600;
          color: #334155;
        }

        .user-points {
          font-weight: 700;
          color: #166534;
          background: rgba(34, 197, 94, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
        }
        
        .leaderboard-item.rank-gold .user-avatar { background: linear-gradient(135deg, #fde047, #f59e0b); }
        .leaderboard-item.rank-silver .user-avatar { background: linear-gradient(135deg, #e5e7eb, #9ca3af); }
        .leaderboard-item.rank-bronze .user-avatar { background: linear-gradient(135deg, #fcd34d, #d97706); }


        /* Coluna de Conquistas */
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        }
        
        .achievement-badge {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .achievement-badge.unlocked {
          background: rgba(255, 255, 255, 0.7);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .achievement-badge.locked {
          background: rgba(226, 232, 240, 0.5);
          color: #94a3b8;
          filter: grayscale(80%);
          opacity: 0.6;
        }
        
        .achievement-badge:hover {
          transform: translateY(-5px);
          filter: grayscale(0%);
          opacity: 1;
        }
        
        .achievement-name {
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .achievement-badge:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 110%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #1e293b;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          white-space: nowrap;
          z-index: 10;
          opacity: 1;
          animation: fadeInUp 0.3s;
        }

        /* Coluna de Missões */
        .missions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .mission-item {
          padding: 1rem;
          border-radius: 12px;
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s ease;
        }
        
        .mission-item:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        }

        .mission-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .mission-title {
          font-size: 1rem;
          font-weight: 700;
          color: #334155;
          margin: 0;
        }
        
        .mission-reward {
          font-weight: 700;
          color: #ca8a04;
          background: rgba(252, 211, 77, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
        }

        .mission-description {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 1rem 0;
        }

        .mission-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .progress-bar-background {
          flex: 1;
          height: 10px;
          background-color: rgba(226, 232, 240, 0.8);
          border-radius: 5px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          border-radius: 5px;
          transition: width 0.5s ease;
        }
        
        .progress-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
        }

        /* Card de Progresso Pessoal */
        .user-progress-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .level-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.75rem;
        }
        
        .progress-bar-background.large {
          height: 2rem;
          border-radius: 1rem;
        }
        
        .progress-bar-fill.gradient {
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .xp-text {
          color: white;
          font-weight: 700;
          font-size: 0.8rem;
          position: absolute;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        /* Card de Prêmios */
        .user-points-display {
            background: rgba(248, 250, 252, 0.7);
            padding: 0.75rem;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            font-weight: 600;
        }
        .user-points-display .points-value {
            color: #166534;
            font-weight: 700;
        }
        .rewards-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .reward-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        .reward-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .reward-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            flex-shrink: 0;
        }
        .reward-name {
            font-weight: 600;
            color: #334155;
            margin: 0;
        }
        .reward-cost {
            font-size: 0.8rem;
            font-weight: 500;
            color: #64748b;
            margin: 0;
        }
        .redeem-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .redeem-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .redeem-btn:disabled {
            background: #d1d5db;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }


        /* Responsividade */
        @media (max-width: 1024px) {
          .main-content-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .gamificacao-page {
            padding: 1rem;
          }
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

export default Gamificacao;