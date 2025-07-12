import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  LogOut, Home, GraduationCap, Gamepad2, Briefcase, UserCheck, User, Settings,
  Package, PanelTop, FileStack, BadgeCheck, Bot, ArrowRightLeft, AreaChart,
  ClipboardList, BookOpen, Users as ClientesIcon, DollarSign, ListTodo
} from 'lucide-react';

// Páginas Admin e Academia
import AdminPage from './AdminPage';
import AcademiaPage from './AcademiaPage';

// Páginas SDR
import PainelPrincipalSDR from '../pages/SDR/PainelPrincipal';
import GestaoLeads from '../pages/SDR/GestaoLeads';
import Qualificacao from '../pages/SDR/Qualificacao';
import AssistenteIA from '../pages/SDR/AssistenteIA';
import PassagemVendas from '../pages/SDR/PassagemVendas';
import AnalisePerformance from '../pages/SDR/AnalisePerformance';
import TarefasDiarias from '../pages/SDR/TarefasDiarias';
import BaseConhecimento from '../pages/SDR/BaseConhecimento';

// --- NOVAS PÁGINAS DO VENDEDOR ---
import PainelPrincipalVendedor from '../pages/Vendedor/PainelPrincipalVendedor';
import Clientes from '../pages/Vendedor/Clientes';
import GestaoNegocios from '../pages/Vendedor/GestaoNegocios';
import TarefasDiariasVendedor from '../pages/Vendedor/TarefasDiariasVendedor';
import AssistenteIAVendedor from '../pages/Vendedor/AssistenteIAVendedor';
import TarefasDiariasVendedor2 from '../pages/Vendedor/TarefasDiariasVendedor2';
import BaseConhecimentoVendedor from '../pages/Vendedor/BaseConhecimentoVendedor';

const Dashboard = () => {
  const { currentUser, userRole, logout, navConfig } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Mapeamento de Ícones ATUALIZADO
  const iconMap = {
    // Genéricos
    dashboard: Home,
    academia: GraduationCap,
    gamificacao: Gamepad2,
    perfil: User,
    admin: Settings,
    
    // SDR
    sdr: UserCheck,
    painelprincipal: PanelTop,
    gestaoleads: FileStack,
    qualificacao: BadgeCheck,
    assistenteia: Bot,
    passagemvendas: ArrowRightLeft,
    analiseperformance: AreaChart,
    tarefasdiarias: ClipboardList,
    baseconhecimento: BookOpen,
    
    // --- NOVOS ÍCONES DO VENDEDOR ---
    vendedor: Briefcase,
    painelvendedor: PanelTop, // Reutilizando
    clientes: ClientesIcon,
    gestaonegocios: DollarSign,
    tarefasvendedor: ListTodo,
  };

  // Submenus ATUALIZADO
  const submenus = {
    sdr: [
      { id: 'PainelPrincipal', label: 'Painel Principal' },
      { id: 'GestaoLeads', label: 'Gestão de Leads' },
      { id: 'Qualificacao', label: 'Qualificação' },
      { id: 'AssistenteIA', label: 'Assistente IA' },
      { id: 'PassagemVendas', label: 'Passagem p/ Vendas' },
      { id: 'AnalisePerformance', label: 'Performance' },
      { id: 'TarefasDiarias', label: 'Tarefas' },
      { id: 'BaseConhecimento', label: 'Conhecimento' },
    ],
    // --- NOVO SUBMENU VENDEDOR ---
    vendedor: [
      { id: 'PainelVendedor', label: 'Painel Principal' },
      { id: 'Clientes', label: 'Clientes' },
      { id: 'GestaoNegocios', label: 'Gestão de Negócios' },
      { id: 'TarefasVendedor', label: 'Tarefas Diárias' },
      { id: 'AssistenteIAVendedor', label: 'Assistente I.A.' },
      { id: 'TarefasDiariasVendedor2', label: 'Tarefas Diárias (Cópia)' },
      { id: 'BaseConhecimentoVendedor', label: 'Base de Conhecimento' },
    ]
  };

  const userMenus = navConfig[userRole] || navConfig.USER;

  const handleMenuClick = (menuItem) => {
    if (submenus[menuItem]) {
      setOpenSubmenu(openSubmenu === menuItem ? null : menuItem);
    } else {
      setActivePage(menuItem);
      setOpenSubmenu(null);
    }
  };

  // Lógica de renderização de página ATUALIZADA
  const renderActivePage = () => {
    switch (activePage) {
      // Páginas Vendedor
      case 'PainelVendedor': return <PainelPrincipalVendedor />;
      case 'Clientes': return <Clientes />;
      case 'GestaoNegocios': return <GestaoNegocios />;
      case 'TarefasVendedor': return <TarefasDiariasVendedor />;
      case 'AssistenteIAVendedor': return <AssistenteIAVendedor />;
      case 'TarefasDiariasVendedor2': return <TarefasDiariasVendedor2 />;
      case 'BaseConhecimentoVendedor': return <BaseConhecimentoVendedor />;
      
      // Páginas SDR
      case 'PainelPrincipal': return <PainelPrincipalSDR />;
      case 'GestaoLeads': return <GestaoLeads />;
      case 'Qualificacao': return <Qualificacao />;
      case 'AssistenteIA': return <AssistenteIA />;
      case 'PassagemVendas': return <PassagemVendas />;
      case 'AnalisePerformance': return <AnalisePerformance />;
      case 'TarefasDiarias': return <TarefasDiarias />;
      case 'BaseConhecimento': return <BaseConhecimento />;
      
      // Páginas Gerais
      case 'admin': return <AdminPage />;
      case 'academia': return <AcademiaPage />;
      default: return (<div><h1>Bem-vindo!</h1></div>);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo"><Package className="icon" /></div>
          <div><h1 className="sidebar-title">Embalagens Conceito</h1></div>
        </div>

        <nav className="nav-menu">
          {userMenus.map((menuItem) => {
            const IconComponent = iconMap[menuItem.toLowerCase()] || Home;
            const label = menuItem.charAt(0).toUpperCase() + menuItem.slice(1);
            const hasSubmenu = submenus[menuItem];
            const isExpanded = openSubmenu === menuItem;
            
            return (
              <div key={menuItem}>
                <button className={`nav-item ${activePage === menuItem ? 'active' : ''}`} onClick={() => handleMenuClick(menuItem)}>
                  <div className="nav-item-content"><IconComponent className="icon" /><span>{label}</span></div>
                </button>
                {hasSubmenu && isExpanded && (
                  <div className={`submenu expanded`}>
                    {submenus[menuItem].map((submenuItem) => {
                      const SubmenuIcon = iconMap[submenuItem.id.toLowerCase()] || Home;
                      return (
                        <button key={submenuItem.id} className="submenu-item" onClick={() => setActivePage(submenuItem.id)}>
                          <SubmenuIcon className="icon" />
                          <span>{submenuItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="logout-section">
          <button onClick={() => logout()} className="logout-button">
            <LogOut className="icon" /><span>Sair</span>
          </button>
        </div>
      </div>
      <div className="dashboard-main">
        <div className="main-content">{renderActivePage()}</div>
      </div>
    </div>
  );
};

export default Dashboard;