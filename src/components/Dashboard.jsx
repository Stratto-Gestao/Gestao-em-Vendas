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
  BookOpen,
  Users,
  DollarSign,
  ListTodo,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import AdminPage from './AdminPage';
import AcademiaPage from './AcademiaPage';
import PainelPrincipal from '../pages/SDR/PainelPrincipal';
import GestaoLeads from '../pages/SDR/GestaoLeads';
import AssistenteIA from '../pages/SDR/AssistenteIA';
import PassagemVendas from '../pages/SDR/PassagemVendas';
import AnalisePerformance from '../pages/SDR/AnalisePerformance';
import TarefasDiarias from '../pages/SDR/TarefasDiarias';
// import BaseConhecimento from '../pages/SDR/BaseConhecimento';
import PainelPrincipalVendedor from '../pages/Vendedor/PainelPrincipalVendedor';
import Clientes from '../pages/Vendedor/Clientes';
import GestaoNegocios from '../pages/Vendedor/GestaoNegocios';
import TarefasDiariasVendedor from '../pages/Vendedor/TarefasDiariasVendedor';
import AssistenteIAVendedor from '../pages/Vendedor/AssistenteIAVendedor';
import Vendas from '../pages/Vendedor/Vendas';
// import BaseConhecimentoVendedor from '../pages/Vendedor/BaseConhecimentoVendedor';
import Gamificacao from '../pages/Gamificacao';
import MrRepresentacoes from '../pages/MrRepresentacoes';

const Dashboard = () => {
  const { currentUser, userRole, logout, navConfig } = useAuth();
  
  // Obter menus do usuário
  const userMenus = navConfig[userRole] || navConfig.USER;

  // Definir página inicial baseada nas permissões do usuário
  const getInitialPage = () => {
    if (userMenus.includes('dashboard')) return 'dashboard';
    if (userMenus.includes('vendedor')) return 'vendedor';
    if (userMenus.includes('sdr')) return 'sdr';
    if (userMenus.includes('mr-representacoes')) return 'mr-representacoes';
    if (userMenus.includes('academia')) return 'academia';
    return userMenus[0] || 'perfil';
  };

  const [activePage, setActivePage] = useState(getInitialPage());
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
    // qualificacao: BadgeCheck,
    assistenteia: Bot,
    passagemvendas: ArrowRightLeft,
    analiseperformance: AreaChart,
    tarefasdiarias: ClipboardList,
    // baseconhecimento: BookOpen,
    // Submenu Vendedor
    painelprincipalvendedor: PanelTop,
    clientes: Users,
    gestaonegocios: DollarSign,
    vendas: CheckCircle2,
    tarefasdiariasvendedor: ListTodo,
    assistenteiavendedor: Lightbulb,
    // baseconhecimentovendedor: BookOpen,
  };

  // Definir submenus
  const submenus = {
    sdr: [
      'PainelPrincipal', 
      'GestaoLeads', 
      'AssistenteIA', 
      'PassagemVendas', 
      'AnalisePerformance', 
      'TarefasDiarias'
    ],
    vendedor: [
      'PainelPrincipalVendedor',
      'Clientes',
      'GestaoNegocios',
      'Vendas',
      'TarefasDiariasVendedor',
      'AssistenteIAVendedor'
    ]
  };


  // Função para verificar se o usuário pode acessar uma página
  const canAccessPage = (page) => {
    // SUPER_ADMIN tem acesso total
    if (userRole === 'SUPER_ADMIN') {
      return true;
    }
    return userMenus.includes(page);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleMenuClick = (menuItem) => {
    // SUPER_ADMIN sempre tem acesso
    if (userRole === 'SUPER_ADMIN') {
      if (submenus[menuItem]) {
        setOpenSubmenu(openSubmenu === menuItem ? null : menuItem);
      } else {
        setActivePage(menuItem);
        setOpenSubmenu(null);
      }
      return;
    }

    // Verificar se o usuário tem permissão para acessar este menu
    if (!canAccessPage(menuItem)) {
      alert('Você não tem permissão para acessar esta página!');
      return;
    }

    if (submenus[menuItem]) {
      setOpenSubmenu(openSubmenu === menuItem ? null : menuItem);
    } else {
      setActivePage(menuItem);
      setOpenSubmenu(null);
    }
  };

  const setActivePageWithValidation = (page) => {
    // SUPER_ADMIN sempre tem acesso
    if (userRole === 'SUPER_ADMIN') {
      setActivePage(page);
      setOpenSubmenu(null);
      return;
    }

    // Determinar o módulo base da página
    let baseModule = '';
    const pageLower = page.toLowerCase();
    
    // Páginas do Vendedor
    if (pageLower.includes('vendedor') || pageLower.includes('cliente') || pageLower.includes('negocio') || pageLower.includes('vendas')) {
      baseModule = 'vendedor';
    }
    // Páginas do SDR
    else if (pageLower.includes('sdr') || pageLower.includes('lead') || pageLower.includes('qualificacao') || 
             pageLower.includes('assistente') || pageLower.includes('passagem') || pageLower.includes('analise') || 
             pageLower.includes('tarefa') || page === 'PainelPrincipal') {
      baseModule = 'sdr';
    }
    // Páginas do MR
    else if (pageLower.includes('mr') || pageLower.includes('representacoes')) {
      baseModule = 'mr-representacoes';
    }
    // Páginas gerais
    else {
      baseModule = pageLower;
    }

    // Verificar se o usuário tem acesso ao módulo
    if (!canAccessPage(baseModule)) {
      alert('Você não tem permissão para acessar esta página!');
      return;
    }

    setActivePage(page);
    setOpenSubmenu(null);
  };

  const renderActivePage = () => {
    // Validar acesso antes de renderizar
    const validatePageAccess = (page, requiredPermission) => {
      // SUPER_ADMIN sempre tem acesso
      if (userRole === 'SUPER_ADMIN') {
        return page;
      }
      
      // Verificar se o usuário tem acesso ao módulo principal
      if (!canAccessPage(requiredPermission)) {
        return (
          <div className="access-denied">
            <div className="access-denied-content">
              <h2>Acesso Negado</h2>
              <p>Você não tem permissão para acessar esta página.</p>
              <p>Sua permissão atual: <strong>{userRole}</strong></p>
              <p>Permissão necessária: <strong>{requiredPermission}</strong></p>
            </div>
          </div>
        );
      }
      return page;
    };

    switch (activePage) {
      case 'admin':
        return validatePageAccess(<AdminPage />, 'admin');
      case 'academia':
        return validatePageAccess(<AcademiaPage />, 'academia');
      case 'gamificacao':
        return validatePageAccess(<Gamificacao />, 'gamificacao');
      case 'mr-representacoes':
        return validatePageAccess(<MrRepresentacoes />, 'mr-representacoes');
      
      // Módulo Vendedor - redireciona para primeira sub-página
      case 'vendedor':
        return validatePageAccess(<PainelPrincipalVendedor />, 'vendedor');
      
      // Módulo SDR - redireciona para primeira sub-página
      case 'sdr':
        return validatePageAccess(<PainelPrincipal />, 'sdr');
      
      // Páginas SDR - todas requerem acesso ao módulo 'sdr'
      case 'PainelPrincipal':
        return validatePageAccess(<PainelPrincipal />, 'sdr');
      case 'GestaoLeads':
        return validatePageAccess(<GestaoLeads />, 'sdr');
      // case 'Qualificacao':
      //   return validatePageAccess(<Qualificacao />, 'sdr');
      case 'AssistenteIA':
        return validatePageAccess(<AssistenteIA />, 'sdr');
      case 'PassagemVendas':
        return validatePageAccess(<PassagemVendas />, 'sdr');
      case 'AnalisePerformance':
        return validatePageAccess(<AnalisePerformance />, 'sdr');
      case 'TarefasDiarias':
        return validatePageAccess(<TarefasDiarias />, 'sdr');
      
      // Páginas Vendedor - todas requerem acesso ao módulo 'vendedor'
      case 'PainelPrincipalVendedor':
        return validatePageAccess(<PainelPrincipalVendedor />, 'vendedor');
      case 'Clientes':
        return validatePageAccess(<Clientes />, 'vendedor');
      case 'GestaoNegocios':
        return validatePageAccess(<GestaoNegocios />, 'vendedor');
      case 'Vendas':
        return validatePageAccess(<Vendas />, 'vendedor');
      case 'TarefasDiariasVendedor':
        return validatePageAccess(<TarefasDiariasVendedor />, 'vendedor');
      case 'AssistenteIAVendedor':
        return validatePageAccess(<AssistenteIAVendedor />, 'vendedor');
      // case 'BaseConhecimentoVendedor':
      //   return <BaseConhecimentoVendedor />;
      case 'mr-representacoes':
        return validatePageAccess(<MrRepresentacoes />, 'mr-representacoes');
      case 'gamificacao':
        return validatePageAccess(<Gamificacao />, 'gamificacao');
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
            
            // Mapeamento de labels customizado para menu compacto
            const labelMap = {
              'sdr': 'SDR',
              'vendedor': 'Vendas',
              'academia': 'Academia',
              'gamificacao': 'Gamificação',
              'admin': 'Admin',
              'dashboard': 'Dashboard',
              'mr-representacoes': 'MR',
              'perfil': 'Perfil'
            };
            
            const label = labelMap[menuItem] || menuItem.charAt(0).toUpperCase() + menuItem.slice(1).replace('-', ' ');
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
                    <IconComponent className="icon menu-icon-gray" />
                    <span>{label}</span>
                  </div>
                </button>
                {hasSubmenu && isExpanded && (
                  <div className={`submenu ${isExpanded ? 'expanded' : ''}`}>
                    {submenus[menuItem].map((submenuItem) => {
                      const SubmenuIcon = iconMap[submenuItem.toLowerCase().replace(/\s+/g, '')] || Home;
                      
                      // Mapeamento de labels para submenus compactos
                      const submenuLabelMap = {
                        'PainelPrincipal': 'Painel',
                        'PainelPrincipalVendedor': 'Painel',
                        'GestaoLeads': 'Leads',
                        'GestaoNegocios': 'Negócios',
                      // 'Qualificacao': 'Qualific.',
                        'AssistenteIA': 'IA',
                        'AssistenteIAVendedor': 'IA',
                        'PassagemVendas': 'Passagem',
                        'AnalisePerformance': 'Performance',
                        'TarefasDiarias': 'Tarefas',
                        'TarefasDiariasVendedor': 'Tarefas',
                        'Clientes': 'Clientes',
                        'Vendas': 'Vendas'
                      };
                      
                      const submenuLabel = submenuLabelMap[submenuItem] || submenuItem.replace(/([A-Z])/g, ' $1').trim();
                      
                      return (
                        <button
                          key={submenuItem}
                          className="submenu-item"
                          onClick={() => setActivePageWithValidation(submenuItem)}
                        >
                          <SubmenuIcon className="icon menu-icon-gray" />
                          <span>{submenuLabel}</span>
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

// Estilo global para ícones do menu
const style = document.createElement('style');
style.innerHTML = `
  .menu-icon-gray { color: #64748b !important; }
  
  .access-denied {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .access-denied-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .access-denied-content h2 {
    color: #dc2626;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .access-denied-content p {
    color: #6b7280;
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .access-denied-content strong {
    color: #1f2937;
  }
`;
document.head.appendChild(style);