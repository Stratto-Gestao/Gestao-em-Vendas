import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  LogOut, 
  Home, 
  GraduationCap, 
  Gamepad2, 
  Briefcase, 
  UserCheck, 
  User, 
  Settings,
  Package,
  PanelTop,
  FileStack,
  BadgeCheck,
  Bot,
  ArrowRightLeft,
  AreaChart,
  ClipboardList,
  BookOpen
} from 'lucide-react';
import AdminPage from './AdminPage';
import AcademiaPage from './AcademiaPage';
import PainelPrincipal from '../pages/SDR/PainelPrincipal';
import GestaoLeads from '../pages/SDR/GestaoLeads';
import Qualificacao from '../pages/SDR/Qualificacao';
import AssistenteIA from '../pages/SDR/AssistenteIA';
import PassagemVendas from '../pages/SDR/PassagemVendas';
import AnalisePerformance from '../pages/SDR/AnalisePerformance';
import TarefasDiarias from '../pages/SDR/TarefasDiarias';
import BaseConhecimento from '../pages/SDR/BaseConhecimento';

const Dashboard = () => {
  const { currentUser, userRole, logout, navConfig } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Mapeamento de ícones
  const iconMap = {
    dashboard: Home,
    academia: GraduationCap,
    gamificacao: Gamepad2,
    vendedor: Briefcase,
    sdr: UserCheck,
    'mr-representacoes': UserCheck,
    perfil: User,
    admin: Settings,
    // Submenu SDR
    painelprincipal: PanelTop,
    gestaoleads: FileStack,
    qualificacao: BadgeCheck,
    assistenteia: Bot,
    passagemvendas: ArrowRightLeft,
    analiseperformance: AreaChart,
    tarefasdiarias: ClipboardList,
    baseconhecimento: BookOpen,
  };

  // Definir submenus
  const submenus = {
    sdr: [
      'PainelPrincipal', 
      'GestaoLeads', 
      'Qualificacao', 
      'AssistenteIA', 
      'PassagemVendas', 
      'AnalisePerformance', 
      'TarefasDiarias', 
      'BaseConhecimento'
    ]
  };

  // Obter menus do usuário
  const userMenus = navConfig[userRole] || navConfig.USER;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleMenuClick = (menuItem) => {
    if (submenus[menuItem]) {
      setOpenSubmenu(openSubmenu === menuItem ? null : menuItem);
    } else {
      setActivePage(menuItem);
      setOpenSubmenu(null);
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'admin':
        return <AdminPage />;
      case 'academia':
        return <AcademiaPage />;
      case 'PainelPrincipal':
        return <PainelPrincipal />;
      case 'GestaoLeads':
        return <GestaoLeads />;
      case 'Qualificacao':
        return <Qualificacao />;
      case 'AssistenteIA':
        return <AssistenteIA />;
      case 'PassagemVendas':
        return <PassagemVendas />;
      case 'AnalisePerformance':
        return <AnalisePerformance />;
      case 'TarefasDiarias':
        return <TarefasDiarias />;
      case 'BaseConhecimento':
        return <BaseConhecimento />;
      default:
        return (
          <>
            {/* Seção de boas-vindas */}
            <div className="welcome-section">
              <h1 className="welcome-title">
                Bem-vindo ao Dashboard! 🎉
              </h1>
              
              <p className="welcome-subtitle">
                Sua migração para React + Tailwind CSS foi um sucesso!
              </p>
            </div>

            {/* Grid de cards de funcionalidades */}
            <div className="features-grid">
              
              {/* Card de sucesso */}
              <div className="feature-card">
                <span className="feature-emoji">✅</span>
                <h3 className="feature-title">Frontend Conectado</h3>
                <p className="feature-description">React + Tailwind funcionando</p>
              </div>

              {/* Card Firebase */}
              <div className="feature-card firebase">
                <span className="feature-emoji">🔥</span>
                <h3 className="feature-title">Firebase Conectado</h3>
                <p className="feature-description">Autenticação funcionando</p>
              </div>

              {/* Card Glassmorphism */}
              <div className="feature-card design">
                <span className="feature-emoji">✨</span>
                <h3 className="feature-title">Design System</h3>
                <p className="feature-description">Glassmorphism aplicado</p>
              </div>
              
            </div>

            {/* Detalhes do usuário */}
            <div className="user-details">
              <p>Usuário: <span>{currentUser?.email}</span></p>
              <p>Permissão: <span>{userRole}</span></p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        
        {/* Header da Sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Package className="icon" />
          </div>
          <div>
            <h1 className="sidebar-title">Embalagens Conceito</h1>
            <p className="sidebar-subtitle"></p>
          </div>
        </div>

        {/* Menu de navegação */}
        <nav className="nav-menu">
          {userMenus.map((menuItem) => {
            const IconComponent = iconMap[menuItem.toLowerCase().replace(/\s+/g, '')] || Home;
            const label = menuItem.toLowerCase() === 'sdr' ? 'SDR' : menuItem.charAt(0).toUpperCase() + menuItem.slice(1).replace('-', ' ');
            const hasSubmenu = submenus[menuItem];
            const isExpanded = openSubmenu === menuItem;
            const isActive = activePage === menuItem;
            return (
              <div key={menuItem}>
                <button
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  data-menu={menuItem}
                  onClick={() => handleMenuClick(menuItem)}
                >
                  <div className="nav-item-content">
                    <IconComponent className="icon" />
                    <span>{label}</span>
                  </div>
                </button>
                {hasSubmenu && isExpanded && (
                  <div className={`submenu ${isExpanded ? 'expanded' : ''}`}>
                    {submenus[menuItem].map((submenuItem) => {
                      const SubmenuIcon = iconMap[submenuItem.toLowerCase().replace(/\s+/g, '')] || Home;
                      return (
                        <button
                          key={submenuItem}
                          className="submenu-item"
                          onClick={() => setActivePage(submenuItem)}
                        >
                          <SubmenuIcon className="icon" />
                          <span>{submenuItem.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Seção de logout */}
        <div className="logout-section">
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <LogOut className="icon" />
            <span>Sair</span>
          </button>
        </div>
        
      </div>

      {/* Área principal */}
      <div className="dashboard-main">
        <div className="main-content">
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;