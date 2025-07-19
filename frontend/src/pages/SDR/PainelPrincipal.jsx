import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Target, Clock, TrendingUp, TrendingDown, Plus, 
  Phone, Mail, Calendar, Activity, Award, CheckCircle, AlertCircle,
  Star, Flag, MessageSquare, FileText, ArrowRight, Eye, Download,
  Zap, Filter, Search, RefreshCw, PlayCircle, Pause, Timer, MessageCircle,
  X, Save, Printer
} from 'lucide-react';
import { auth, db } from '../../config/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Componente de Estilos: Injeta o CSS diretamente no DOM.
const PainelStyles = () => (
  <style>{`
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      overflow-x: hidden;
    }
    
    :root {
      --primary-text: #111827;
      --secondary-text: #6b7280;
      --accent-blue: #3b82f6;
      --accent-green: #10b981;
      --accent-purple: #8b5cf6;
      --accent-orange: #f59e0b;
      --accent-red: #ef4444;
      --border-color: #f3f4f6;
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
    }
    
    .dashboard-container {
      background: var(--bg-secondary);
      min-height: 100vh;
      padding: 2rem;
      max-width: none;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    
    .dashboard-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .dashboard-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(0, 0, 0, 0.06);
    }
    
    .metric-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      height: 100%;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
      border-radius: 16px 16px 0 0;
    }
    
    .metric-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }
    
    .metric-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0.5rem 0;
    }
    
    .metric-label {
      color: var(--secondary-text);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .metric-trend {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 500;
      margin-top: 0.5rem;
    }
    
    .trend-positive { color: var(--accent-green); }
    .trend-negative { color: var(--accent-red); }
    .trend-neutral { color: var(--secondary-text); }
    
    .progress-bar-container {
      background: #e5e7eb;
      border-radius: 12px;
      height: 8px;
      overflow: hidden;
      margin: 1rem 0;
    }
    
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
      border-radius: 12px;
      transition: width 0.3s ease;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      margin-bottom: 0.75rem;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .activity-item:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateX(5px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    
    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      color: white;
    }
    
    .task-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      margin-bottom: 0.75rem;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .task-item:hover {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    
    .task-priority {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 0.75rem;
    }
    
    .priority-high { background: var(--accent-red); }
    .priority-medium { background: var(--accent-orange); }
    .priority-low { background: var(--accent-green); }
    
    .quick-action-btn {
      background: var(--accent-blue);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
      font-size: 0.9rem;
      height: 40px;
      min-width: 120px;
    }
    
    .quick-action-btn:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary-text);
    }
    
    .fade-in-up {
      animation: fadeInUp 0.6s ease-out;
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
    
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      width: 100%;
    }
    
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      width: 100%;
    }
    
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      width: 100%;
    }
    
    @media (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
      .grid-3 { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .dashboard-container { padding: 1rem; }
    }
    
    .chart-container {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      margin: 1rem 0;
    }
    
    .origem-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 8px;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }
    
    .origem-item:hover {
      background: rgba(255, 255, 255, 0.8);
      transform: translateX(3px);
    }
    
    .origem-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--primary-text);
    }
    
    .origem-value {
      font-weight: 600;
      color: var(--accent-blue);
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      margin-bottom: 0.75rem;
      transition: all 0.3s ease;
      border-left: 4px solid var(--accent-blue);
    }
    
    .meta-item:hover {
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    
    .meta-info {
      flex: 1;
    }
    
    .meta-titulo {
      font-weight: 600;
      color: var(--primary-text);
      margin-bottom: 0.25rem;
    }
    
    .meta-valor {
      font-size: 0.85rem;
      color: var(--secondary-text);
    }
    
    .meta-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .status-atingida { color: var(--accent-green); }
    .status-progresso { color: var(--accent-orange); }
    .status-pendente { color: var(--accent-red); }
    
    .campanha-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      margin-bottom: 0.75rem;
      transition: all 0.3s ease;
      border-left: 4px solid var(--accent-purple);
    }
    
    .campanha-item:hover {
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    
    .campanha-info {
      flex: 1;
    }
    
    .campanha-titulo {
      font-weight: 600;
      color: var(--primary-text);
      margin-bottom: 0.25rem;
    }
    
    .campanha-descricao {
      font-size: 0.85rem;
      color: var(--secondary-text);
    }
    
    .campanha-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .status-ativa { color: var(--accent-green); }
    .status-pausada { color: var(--accent-orange); }
    .status-finalizada { color: var(--accent-red); }
    
    .fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }
    
    .fade-in-up > * {
      width: 100%;
      max-width: 100%;
    }
    
    .pie-chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 250px;
      margin: 1rem 0;
    }
    
    .pie-chart {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(
        var(--accent-blue) 0deg 0deg,
        var(--accent-green) 0deg 0deg,
        var(--accent-orange) 0deg 0deg,
        var(--accent-purple) 0deg 0deg,
        var(--accent-red) 0deg 360deg
      );
      position: relative;
      margin-bottom: 1rem;
    }
    
    .pie-chart::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    
    .pie-chart-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 1;
    }
    
    .pie-chart-total {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0;
    }
    
    .pie-chart-label {
      font-size: 0.75rem;
      color: var(--secondary-text);
      margin: 0;
    }
    
    .pie-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin-top: 1rem;
    }
    
    .pie-legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }
    
    .pie-legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .pie-legend-text {
      color: var(--primary-text);
      font-weight: 500;
    }
    
    .pie-legend-value {
      color: var(--secondary-text);
      font-weight: 600;
    }
    
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .popup-content {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }
    
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .popup-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary-text);
      margin: 0;
    }
    
    .popup-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    
    .popup-close:hover {
      background: var(--border-color);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--primary-text);
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .form-input:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      resize: vertical;
      min-height: 100px;
      transition: border-color 0.2s;
    }
    
    .form-textarea:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      transition: border-color 0.2s;
    }
    
    .form-select:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .popup-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }
    
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: 1px solid var(--border-color);
      background: white;
      color: var(--primary-text);
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-secondary:hover {
      background: var(--border-color);
    }
    
    .btn-primary {
      padding: 0.75rem 1.5rem;
      border: none;
      background: var(--accent-blue);
      color: white;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .leads-list {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.5rem;
    }
    
    .lead-item {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .lead-checkbox {
      margin-right: 0.75rem;
    }
    
    .lead-info {
      flex: 1;
    }
    
    .lead-name {
      font-weight: 500;
      color: var(--primary-text);
      margin-bottom: 0.25rem;
    }
    
    .lead-details {
      font-size: 0.85rem;
      color: var(--secondary-text);
    }
    
    .mini-action-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .mini-action-card:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .mini-action-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .mini-action-content {
      flex: 1;
      min-width: 0;
    }

    .mini-action-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--primary-text);
      margin-bottom: 0.25rem;
      line-height: 1.2;
    }

    .mini-action-desc {
      font-size: 0.8rem;
      color: var(--secondary-text);
      opacity: 0.9;
      line-height: 1.2;
    }

    @media (max-width: 768px) {
      .mini-action-card {
        padding: 0.8rem;
        gap: 0.8rem;
      }
      
      .mini-action-icon {
        width: 40px;
        height: 40px;
      }
      
      .mini-action-title {
        font-size: 0.8rem;
      }
      
      .mini-action-desc {
        font-size: 0.7rem;
      }
    }

    @media (max-width: 480px) {
      .mini-action-card {
        flex-direction: column;
        text-align: center;
        padding: 1rem;
      }
      
      .mini-action-icon {
        width: 44px;
        height: 44px;
      }
    }
  `}</style>
);


function PainelPrincipal({ setActivePage: setActivePageProp }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leads, setLeads] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [metasSemanais, setMetasSemanais] = useState([]);
  const [campanhasSemanais, setCampanhasSemanais] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSequenciaPopup, setShowSequenciaPopup] = useState(false);
  const [sequenciaForm, setSequenciaForm] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    leadsSelecionados: [],
    observacoes: ''
  });
  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    loadSDRData();
    return () => clearInterval(timer);
  }, []);

  const loadSDRData = async () => {
    setLoading(true);
    try {
      // Carregar leads do Firebase
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      const leadsData = leadsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Se não há leads no Firebase, carregar dados mockados
      if (leadsData.length === 0) {
        const mockLeads = localStorage.getItem('leads-firebase-mock');
        if (mockLeads) {
          setLeads(JSON.parse(mockLeads));
        } else {
          // Dados mockados padrão se não houver nenhum
          const leadsDefault = [
            {
              id: 1,
              nome: 'João Silva',
              empresa: 'TechStart Solutions',
              email: 'joao.silva@techstart.com',
              telefone: '(11) 9999-1234',
              cargo: 'Diretor de TI',
              origem: 'LinkedIn',
              status: 'Qualificado',
              pontuacao: 85,
              criadoEm: new Date(2024, 0, 15).toISOString(),
              tentativas: 3,
              recebido: '15/01/2024'
            },
            {
              id: 2,
              nome: 'Maria Santos',
              empresa: 'Global Corp',
              email: 'maria.santos@globalcorp.com',
              telefone: '(11) 8888-5678',
              cargo: 'Gerente de Operações',
              origem: 'Website',
              status: 'Contatado',
              pontuacao: 70,
              criadoEm: new Date(2024, 0, 10).toISOString(),
              tentativas: 2,
              recebido: '10/01/2024'
            },
            {
              id: 3,
              nome: 'Pedro Oliveira',
              empresa: 'Inovação Digital',
              email: 'pedro.oliveira@inovacaodigital.com',
              telefone: '(11) 7777-9012',
              cargo: 'CEO',
              origem: 'Indicação',
              status: 'Novo',
              pontuacao: 90,
              criadoEm: new Date(2024, 0, 18).toISOString(),
              tentativas: 0,
              recebido: '18/01/2024'
            },
            {
              id: 4,
              nome: 'Ana Costa',
              empresa: 'Smart Systems',
              email: 'ana.costa@smartsystems.com',
              telefone: '(11) 6666-3456',
              cargo: 'Diretora Comercial',
              origem: 'E-mail Marketing',
              status: 'Qualificado',
              pontuacao: 80,
              criadoEm: new Date(2024, 0, 12).toISOString(),
              tentativas: 2,
              recebido: '12/01/2024'
            },
            {
              id: 5,
              nome: 'Carlos Mendes',
              empresa: 'Future Tech',
              email: 'carlos.mendes@futuretech.com',
              telefone: '(11) 5555-7890',
              cargo: 'CTO',
              origem: 'LinkedIn',
              status: 'Não Qualificado',
              pontuacao: 35,
              criadoEm: new Date(2024, 0, 8).toISOString(),
              tentativas: 4,
              recebido: '08/01/2024'
            }
          ];
          setLeads(leadsDefault);
        }
      } else {
        setLeads(leadsData);
      }

      // Carregar tarefas do localStorage
      const savedTarefas = localStorage.getItem('tarefas-sdr');
      if (savedTarefas) {
        setTarefas(JSON.parse(savedTarefas));
      } else {
        // Dados mockados de exemplo para tarefas SDR
        const tarefasDefault = [
          {
            id: 1,
            titulo: 'Qualificar leads da campanha LinkedIn',
            tipo: 'Qualificação',
            prioridade: 'alta',
            prazo: new Date().toISOString().split('T')[0],
            status: 'Em andamento',
            progresso: 60
          },
          {
            id: 2,
            titulo: 'Follow-up com prospects TechStart',
            tipo: 'Follow-up',
            prioridade: 'média',
            prazo: new Date().toISOString().split('T')[0],
            status: 'Pendente',
            progresso: 0
          },
          {
            id: 3,
            titulo: 'Agendar reunião com Global Corp',
            tipo: 'Reunião',
            prioridade: 'alta',
            prazo: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            status: 'Concluída',
            progresso: 100
          }
        ];
        setTarefas(tarefasDefault);
        localStorage.setItem('tarefas-sdr', JSON.stringify(tarefasDefault));
      }

      // Carregar atividades recentes
      const savedAtividades = localStorage.getItem('atividades-sdr');
      if (savedAtividades) {
        setAtividades(JSON.parse(savedAtividades));
      } else {
        // Dados mockados de exemplo para atividades SDR
        const atividadesDefault = [
          {
            id: 1,
            tipo: 'call',
            descricao: 'Ligação para TechStart Solutions',
            tempo: '5 min atrás',
            status: 'success'
          },
          {
            id: 2,
            tipo: 'email',
            descricao: 'E-mail enviado para Inovação Digital',
            tempo: '1h atrás',
            status: 'sent'
          },
          {
            id: 3,
            tipo: 'meeting',
            descricao: 'Reunião agendada com Global Corp',
            tempo: '2h atrás',
            status: 'scheduled'
          },
          {
            id: 4,
            tipo: 'qualification',
            descricao: 'Lead qualificado - Smart Systems',
            tempo: '3h atrás',
            status: 'qualified'
          }
        ];
        setAtividades(atividadesDefault);
        localStorage.setItem('atividades-sdr', JSON.stringify(atividadesDefault));
      }

      // Carregar metas semanais
      const savedMetas = localStorage.getItem('metas-semanais-sdr');
      if (savedMetas) {
        setMetasSemanais(JSON.parse(savedMetas));
      } else {
        // Dados mockados de exemplo para metas semanais
        const metasDefault = [
          {
            id: 1,
            titulo: 'Ligações Semanais',
            valor: 250,
            atual: 127,
            tipo: 'ligacoes',
            status: 'progresso',
            prazo: '2024-01-21'
          },
          {
            id: 2,
            titulo: 'Leads Qualificados',
            valor: 15,
            atual: 8,
            tipo: 'qualificacao',
            status: 'progresso',
            prazo: '2024-01-21'
          },
          {
            id: 3,
            titulo: 'Reuniões Agendadas',
            valor: 8,
            atual: 5,
            tipo: 'reunioes',
            status: 'progresso',
            prazo: '2024-01-21'
          },
          {
            id: 4,
            titulo: 'Follow-ups Enviados',
            valor: 50,
            atual: 32,
            tipo: 'followups',
            status: 'progresso',
            prazo: '2024-01-21'
          }
        ];
        setMetasSemanais(metasDefault);
        localStorage.setItem('metas-semanais-sdr', JSON.stringify(metasDefault));
      }

      // Carregar campanhas semanais
      const savedCampanhas = localStorage.getItem('campanhas-semanais-sdr');
      if (savedCampanhas) {
        setCampanhasSemanais(JSON.parse(savedCampanhas));
      } else {
        // Dados mockados de exemplo para campanhas semanais
        const campanhasDefault = [
          {
            id: 1,
            titulo: 'Campanha LinkedIn B2B',
            descricao: 'Prospecção ativa em empresas de tecnologia',
            status: 'ativa',
            leads: 45,
            tipo: 'prospeccao',
            inicioEm: '2024-01-15',
            fimEm: '2024-01-21'
          },
          {
            id: 2,
            titulo: 'E-mail Marketing Mensal',
            descricao: 'Campanha de nutrição de leads',
            status: 'ativa',
            leads: 32,
            tipo: 'nutricao',
            inicioEm: '2024-01-10',
            fimEm: '2024-01-31'
          },
          {
            id: 3,
            titulo: 'Webinar Tech Solutions',
            descricao: 'Captação via evento online',
            status: 'pausada',
            leads: 18,
            tipo: 'evento',
            inicioEm: '2024-01-08',
            fimEm: '2024-01-25'
          },
          {
            id: 4,
            titulo: 'Campanha Indicações',
            descricao: 'Programa de indicações de clientes',
            status: 'finalizada',
            leads: 12,
            tipo: 'indicacao',
            inicioEm: '2024-01-01',
            fimEm: '2024-01-14'
          }
        ];
        setCampanhasSemanais(campanhasDefault);
        localStorage.setItem('campanhas-semanais-sdr', JSON.stringify(campanhasDefault));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do SDR:', error);
      // Em caso de erro, usar dados mockados mínimos
      setLeads([
        {
          id: 1,
          nome: 'Lead de Exemplo',
          empresa: 'Empresa Teste',
          status: 'Qualificado',
          criadoEm: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSDRData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Cálculos das métricas baseadas nos dados reais dos leads
  const calcularMetricas = () => {
    // Leads qualificados
    const leadsQualificados = leads.filter(lead => lead.status === 'Qualificado').length;
    
    // Leads prospectos (Novo, Contatado, Não Qualificado)
    const leadsProspectos = leads.filter(lead => 
      lead.status === 'Novo' || 
      lead.status === 'Contatado' || 
      lead.status === 'Não Qualificado'
    ).length;
    
    // Taxa de acerto (média de leads qualificados em relação aos prospectos)
    const totalLeadsProcessados = leadsQualificados + leadsProspectos;
    const taxaAcerto = totalLeadsProcessados > 0 ? 
      ((leadsQualificados / totalLeadsProcessados) * 100).toFixed(1) : 0;
    
    // Ligações do mês (simulado baseado em atividades + dados mockados)
    const ligacoesDoMes = 127; // Simulado - pode ser integrado com dados reais
    
    // Dados do mês atual
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    
    // Filtrar leads criados neste mês
    const leadsDoMes = leads.filter(lead => {
      if (lead.criadoEm) {
        const dataLead = new Date(lead.criadoEm);
        return dataLead.getMonth() === mesAtual && dataLead.getFullYear() === anoAtual;
      }
      return false;
    });
    
    const leadsProspectosDoMes = leadsDoMes.filter(lead => 
      lead.status === 'Novo' || 
      lead.status === 'Contatado' || 
      lead.status === 'Não Qualificado'
    ).length;
    
    return {
      leadsQualificados,
      ligacoesDoMes,
      leadsProspectosDoMes: leadsProspectosDoMes || leadsProspectos, // Fallback
      taxaAcerto: parseFloat(taxaAcerto)
    };
  };

  const metricas = calcularMetricas();

  // Calcular origem dos leads
  const calcularOrigemLeads = () => {
    const origens = {};
    leads.forEach(lead => {
      const origem = lead.origem || 'Não informado';
      origens[origem] = (origens[origem] || 0) + 1;
    });
    
    return Object.entries(origens)
      .map(([origem, quantidade]) => ({ origem, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade);
  };

  // Calcular evolução de performance baseada nas metas
  const calcularEvolucaoPerformance = () => {
    const metasAtingidas = metasSemanais.filter(meta => meta.atual >= meta.valor).length;
    const metasProgresso = metasSemanais.filter(meta => meta.atual < meta.valor && meta.atual > 0).length;
    const metasPendentes = metasSemanais.filter(meta => meta.atual === 0).length;
    
    const percentualGeral = metasSemanais.length > 0 ? 
      ((metasAtingidas / metasSemanais.length) * 100).toFixed(1) : 0;
    
    return {
      metasAtingidas,
      metasProgresso,
      metasPendentes,
      percentualGeral: parseFloat(percentualGeral)
    };
  };

  // Calcular atividade semanal
  const calcularAtividadeSemanal = () => {
    const hoje = new Date();
    const inicioSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
    
    const tarefasSemana = tarefas.filter(tarefa => {
      const dataTarefa = new Date(tarefa.prazo);
      return dataTarefa >= inicioSemana;
    });
    
    const tarefasCompletas = tarefasSemana.filter(t => t.status === 'Concluída').length;
    const tarefasAndamento = tarefasSemana.filter(t => t.status === 'Em andamento').length;
    const tarefasPendentes = tarefasSemana.filter(t => t.status === 'Pendente').length;
    
    return {
      total: tarefasSemana.length,
      completas: tarefasCompletas,
      andamento: tarefasAndamento,
      pendentes: tarefasPendentes,
      percentualCompletas: tarefasSemana.length > 0 ? 
        ((tarefasCompletas / tarefasSemana.length) * 100).toFixed(1) : 0
    };
  };

  const origemLeads = calcularOrigemLeads();
  const evolucaoPerformance = calcularEvolucaoPerformance();
  const atividadeSemanal = calcularAtividadeSemanal();

  // Gerar gráfico de pizza para origem dos leads
  const gerarGraficoPizza = () => {
    const cores = [
      'var(--accent-blue)', 
      'var(--accent-green)', 
      'var(--accent-orange)', 
      'var(--accent-purple)', 
      'var(--accent-red)'
    ];
    
    const total = origemLeads.reduce((acc, item) => acc + item.quantidade, 0);
    let acumulado = 0;
    
    const gradientSegments = origemLeads.map((item, index) => {
      const porcentagem = (item.quantidade / total) * 100;
      const graus = (porcentagem / 100) * 360;
      const inicioGraus = (acumulado / total) * 360;
      const fimGraus = inicioGraus + graus;
      
      acumulado += item.quantidade;
      
      return {
        ...item,
        porcentagem: porcentagem.toFixed(1),
        inicioGraus,
        fimGraus,
        cor: cores[index % cores.length]
      };
    });
    
    const gradientString = gradientSegments.map((segment, index) => {
      const nextStart = index < gradientSegments.length - 1 ? gradientSegments[index + 1].inicioGraus : 360;
      return `${segment.cor} ${segment.inicioGraus}deg ${segment.fimGraus}deg`;
    }).join(', ');
    
    return { gradientString, segments: gradientSegments, total };
  };

  const graficoPizza = gerarGraficoPizza();

  // Funções para as ações dos botões
  const handleIniciarSequencia = () => {
    setShowSequenciaPopup(true);
    setSequenciaForm({
      titulo: '',
      descricao: '',
      prioridade: 'media',
      leadsSelecionados: [],
      observacoes: ''
    });
  };

  const handleSalvarSequencia = () => {
    if (!sequenciaForm.titulo || sequenciaForm.leadsSelecionados.length === 0) {
      alert('Preencha o título e selecione pelo menos um lead');
      return;
    }

    const novaTarefa = {
      id: Date.now(),
      titulo: sequenciaForm.titulo,
      descricao: sequenciaForm.descricao,
      tipo: 'Sequência de Ligações',
      prioridade: sequenciaForm.prioridade,
      prazo: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      progresso: 0,
      leads: sequenciaForm.leadsSelecionados,
      observacoes: sequenciaForm.observacoes,
      criadoEm: new Date().toISOString()
    };

    const tarefasAtuais = JSON.parse(localStorage.getItem('tarefas-sdr') || '[]');
    tarefasAtuais.push(novaTarefa);
    localStorage.setItem('tarefas-sdr', JSON.stringify(tarefasAtuais));
    
    setTarefas(tarefasAtuais);
    setShowSequenciaPopup(false);
    
    alert('Sequência de ligações salva com sucesso!');
  };

  const handleImprimirSequencia = () => {
    const leadsInfo = sequenciaForm.leadsSelecionados.map(leadId => {
      const lead = leads.find(l => l.id === leadId);
      return `${lead?.nome} - ${lead?.empresa} - ${lead?.telefone}`;
    }).join('\n');

    const conteudo = `
SEQUÊNCIA DE LIGAÇÕES
=====================

Título: ${sequenciaForm.titulo}
Descrição: ${sequenciaForm.descricao}
Prioridade: ${sequenciaForm.prioridade}
Data: ${new Date().toLocaleDateString('pt-BR')}

LEADS SELECIONADOS:
${leadsInfo}

OBSERVAÇÕES:
${sequenciaForm.observacoes}

=====================
Gerado em: ${new Date().toLocaleString('pt-BR')}
    `;

    const novaJanela = window.open('', '_blank');
    novaJanela.document.write(`
      <html>
        <head>
          <title>Sequência de Ligações - ${sequenciaForm.titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${conteudo}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    novaJanela.document.close();
  };

  const handleEnviarEmail = () => {
    const emailCorpo = `Olá,

Gostaria de entrar em contato sobre nossos serviços.

Atenciosamente,
Equipe SDR`;
    
    const mailtoLink = `mailto:?subject=Contato - Oportunidade de Negócio&body=${encodeURIComponent(emailCorpo)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleEnviarWhatsApp = () => {
    const mensagem = `Olá! Sou da equipe SDR e gostaria de conversar sobre uma oportunidade de negócio que pode ser interessante para você.`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleQualificarLeads = () => {
    // Função para navegar para a página de Gestão de Leads do SDR
    console.log('Navegando para GestaoLeads');
    
    // Usar a prop setActivePage do Dashboard
    if (setActivePageProp) {
      setActivePageProp('GestaoLeads');
    } else if (window.parent && window.parent.setActivePage) {
      window.parent.setActivePage('GestaoLeads');
    } else {
      // Fallback para navegação local
      setActivePage('GestaoLeads');
      console.log('Usando fallback local para GestaoLeads');
    }
  };

  const handleTransferirVendas = () => {
    // Função para navegar para a página de Passagem de Vendas do SDR
    console.log('Navegando para PassagemVendas');
    
    // Usar a prop setActivePage do Dashboard
    if (setActivePageProp) {
      setActivePageProp('PassagemVendas');
    } else if (window.parent && window.parent.setActivePage) {
      window.parent.setActivePage('PassagemVendas');
    } else {
      // Fallback para navegação local
      setActivePage('PassagemVendas');
      console.log('Usando fallback local para PassagemVendas');
    }
  };

  const handleLeadSelection = (leadId) => {
    setSequenciaForm(prev => ({
      ...prev,
      leadsSelecionados: prev.leadsSelecionados.includes(leadId)
        ? prev.leadsSelecionados.filter(id => id !== leadId)
        : [...prev.leadsSelecionados, leadId]
    }));
  };

  // Métricas para os cards do topo
  const metricasCards = [
    { 
      label: "Leads Qualificados", 
      value: metricas.leadsQualificados, 
      icon: Target, 
      color: 'var(--accent-green)',
      trend: metricas.leadsQualificados > 0 ? "+12% vs mês anterior" : "Nenhum lead qualificado ainda", 
      isPositive: metricas.leadsQualificados > 0,
      meta: "Meta mensal: 50"
    },
    { 
      label: "Ligações do Mês", 
      value: metricas.ligacoesDoMes, 
      icon: Phone, 
      color: 'var(--accent-blue)',
      trend: "Meta: 200 ligações", 
      isPositive: metricas.ligacoesDoMes >= 100,
      progress: (metricas.ligacoesDoMes / 200) * 100
    },
    { 
      label: "Leads Prospectos", 
      value: metricas.leadsProspectosDoMes, 
      icon: Users, 
      color: 'var(--accent-purple)',
      trend: "+18% vs mês anterior", 
      isPositive: true,
      meta: "Novo, Contatado, Não Qualificado"
    },
    { 
      label: "Taxa de Acerto", 
      value: `${metricas.taxaAcerto}%`, 
      icon: BarChart3, 
      color: 'var(--accent-orange)',
      trend: metricas.taxaAcerto >= 25 ? "Acima da média" : "Abaixo da média", 
      isPositive: metricas.taxaAcerto >= 25,
      meta: "Qualificados / Total processados"
    }
  ];

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'qualification': return Target;
      default: return Activity;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'var(--accent-green)';
      case 'sent': return 'var(--accent-blue)';
      case 'scheduled': return 'var(--accent-orange)';
      case 'qualified': return 'var(--accent-purple)';
      default: return 'var(--secondary-text)';
    }
  };

  if (loading) {
    return (
      <>
        <PainelStyles />
        <div className="dashboard-container">
          <div className="dashboard-card" style={{ textAlign: 'center' }}>
            <div style={{ padding: '2rem' }}>
              <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }} />
              <h2>Carregando dados do SDR...</h2>
              <p style={{ color: 'var(--secondary-text)' }}>
                Buscando informações dos leads e atividades
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PainelStyles />
      <div className="dashboard-container">
        <div className="fade-in-up">
          {/* Header */}
          <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-text)', marginBottom: '0.5rem' }}>
                  Painel Principal SDR
                </h1>
                <p style={{ color: 'var(--secondary-text)', fontSize: '1.1rem' }}>
                  Última atualização: {currentDate.toLocaleDateString('pt-BR')} às {currentDate.toLocaleTimeString('pt-BR')}
                </p>
              </div>
              <button 
                className="quick-action-btn"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Atualizar Dados
              </button>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            {metricasCards.map((metrica, index) => (
              <div key={index} className="metric-card">
                <div className="metric-label">{metrica.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="metric-value">{metrica.value}</div>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    backgroundColor: metrica.color + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: metrica.color
                  }}>
                    <metrica.icon size={24} />
                  </div>
                </div>
                {metrica.progress && (
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${Math.min(metrica.progress, 100)}%` }}
                    />
                  </div>
                )}
                <div className={`metric-trend ${metrica.isPositive ? 'trend-positive' : 'trend-negative'}`}>
                  {metrica.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span style={{ marginLeft: '0.25rem' }}>
                    {metrica.trend}
                  </span>
                </div>
                {metrica.meta && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginTop: '0.25rem' }}>
                    {metrica.meta}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Segunda linha - Ações Rápidas */}
          <div style={{ marginBottom: '2rem' }}>
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">⚡ Ações Rápidas</h2>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--secondary-text)' 
                }}>
                  Ferramentas essenciais para o SDR
                </div>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                padding: '0.5rem 0'
              }}>
                <div className="mini-action-card" onClick={handleIniciarSequencia}>
                  <div className="mini-action-icon" style={{ backgroundColor: 'var(--accent-blue)' }}>
                    <Phone size={20} />
                  </div>
                  <div className="mini-action-content">
                    <div className="mini-action-title">Sequência de Ligações</div>
                    <div className="mini-action-desc">Criar roteiro de calls</div>
                  </div>
                </div>
                
                <div className="mini-action-card" onClick={handleEnviarEmail}>
                  <div className="mini-action-icon" style={{ backgroundColor: 'var(--accent-green)' }}>
                    <Mail size={20} />
                  </div>
                  <div className="mini-action-content">
                    <div className="mini-action-title">E-mail em Massa</div>
                    <div className="mini-action-desc">Enviar para múltiplos leads</div>
                  </div>
                </div>
                
                <div className="mini-action-card" onClick={handleEnviarWhatsApp}>
                  <div className="mini-action-icon" style={{ backgroundColor: 'var(--accent-orange)' }}>
                    <MessageCircle size={20} />
                  </div>
                  <div className="mini-action-content">
                    <div className="mini-action-title">WhatsApp</div>
                    <div className="mini-action-desc">Contato direto</div>
                  </div>
                </div>
                
                <div className="mini-action-card" onClick={handleQualificarLeads}>
                  <div className="mini-action-icon" style={{ backgroundColor: 'var(--accent-purple)' }}>
                    <Target size={20} />
                  </div>
                  <div className="mini-action-content">
                    <div className="mini-action-title">Qualificar Leads</div>
                    <div className="mini-action-desc">Gerenciar pipeline</div>
                  </div>
                </div>
                
                <div className="mini-action-card" onClick={handleTransferirVendas}>
                  <div className="mini-action-icon" style={{ backgroundColor: 'var(--accent-red)' }}>
                    <ArrowRight size={20} />
                  </div>
                  <div className="mini-action-content">
                    <div className="mini-action-title">Transferir Vendas</div>
                    <div className="mini-action-desc">Passar para vendedor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terceira linha - Origem dos Leads e Atividades */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {/* Origem dos Leads */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Origem dos Leads</h2>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--secondary-text)' 
                }}>
                  Total: {leads.length} leads
                </div>
              </div>
              {origemLeads.length > 0 ? (
                <div>
                  <div className="pie-chart-container">
                    <div 
                      className="pie-chart"
                      style={{ 
                        background: `conic-gradient(${graficoPizza.gradientString})` 
                      }}
                    >
                      <div className="pie-chart-center">
                        <div className="pie-chart-total">{graficoPizza.total}</div>
                        <div className="pie-chart-label">Leads</div>
                      </div>
                    </div>
                  </div>
                  <div className="pie-legend">
                    {graficoPizza.segments.map((segment, index) => (
                      <div key={index} className="pie-legend-item">
                        <div 
                          className="pie-legend-color"
                          style={{ backgroundColor: segment.cor }}
                        />
                        <span className="pie-legend-text">{segment.origem}</span>
                        <span className="pie-legend-value">
                          {segment.quantidade} ({segment.porcentagem}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary-text)' }}>
                  <BarChart3 size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>Nenhum lead encontrado</p>
                </div>
              )}
            </div>

            {/* Atividades Recentes */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Atividades Recentes</h2>
                <button className="quick-action-btn" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
                  <Eye size={16} />
                  Ver Todas
                </button>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {atividades.map((atividade) => {
                  const IconComponent = getActivityIcon(atividade.tipo);
                  return (
                    <div key={atividade.id} className="activity-item">
                      <div 
                        className="activity-icon"
                        style={{ backgroundColor: getActivityColor(atividade.status) }}
                      >
                        <IconComponent size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: 'var(--primary-text)' }}>
                          {atividade.descricao}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                          {atividade.tempo}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Terceira linha - 4 Cards: Metas, Performance, Atividade, Campanhas */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            {/* Metas Semanais */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Metas Semanais</h2>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--secondary-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Flag size={14} />
                  Semana atual
                </div>
              </div>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {metasSemanais.map((meta) => (
                  <div key={meta.id} className="meta-item">
                    <div className="meta-info">
                      <div className="meta-titulo">{meta.titulo}</div>
                      <div className="meta-valor">
                        {meta.atual} / {meta.valor}
                      </div>
                      <div className="progress-bar-container" style={{ margin: '0.5rem 0' }}>
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${Math.min((meta.atual / meta.valor) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className={`meta-status ${
                      meta.atual >= meta.valor ? 'status-atingida' : 
                      meta.atual > 0 ? 'status-progresso' : 'status-pendente'
                    }`}>
                      {meta.atual >= meta.valor ? (
                        <>
                          <CheckCircle size={16} />
                          Atingida
                        </>
                      ) : meta.atual > 0 ? (
                        <>
                          <Clock size={16} />
                          {((meta.atual / meta.valor) * 100).toFixed(0)}%
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} />
                          Pendente
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evolução de Performance */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Evolução de Performance</h2>
                <div style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '700',
                  color: 'var(--accent-blue)'
                }}>
                  {evolucaoPerformance.percentualGeral}%
                </div>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700',
                  color: 'var(--primary-text)',
                  marginBottom: '0.5rem'
                }}>
                  {evolucaoPerformance.metasAtingidas}/{metasSemanais.length}
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--secondary-text)' 
                }}>
                  Metas atingidas esta semana
                </div>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />
                    <span style={{ fontSize: '0.9rem' }}>Atingidas</span>
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--accent-green)' }}>
                    {evolucaoPerformance.metasAtingidas}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: 'var(--accent-orange)' }} />
                    <span style={{ fontSize: '0.9rem' }}>Em Progresso</span>
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--accent-orange)' }}>
                    {evolucaoPerformance.metasProgresso}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} style={{ color: 'var(--accent-red)' }} />
                    <span style={{ fontSize: '0.9rem' }}>Pendentes</span>
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--accent-red)' }}>
                    {evolucaoPerformance.metasPendentes}
                  </span>
                </div>
              </div>
            </div>

            {/* Atividade Semanal */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Atividade Semanal</h2>
                <div style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '700',
                  color: 'var(--accent-green)'
                }}>
                  {atividadeSemanal.percentualCompletas}%
                </div>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700',
                  color: 'var(--primary-text)',
                  marginBottom: '0.5rem'
                }}>
                  {atividadeSemanal.completas}/{atividadeSemanal.total}
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--secondary-text)' 
                }}>
                  Tarefas concluídas esta semana
                </div>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />
                    <span style={{ fontSize: '0.9rem' }}>Concluídas</span>
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--accent-green)' }}>
                    {atividadeSemanal.completas}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={16} style={{ color: 'var(--accent-orange)' }} />
                    <span style={{ fontSize: '0.9rem' }}>Em Andamento</span>
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--accent-orange)' }}>
                    {atividadeSemanal.andamento}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: 'var(--accent-red)' }} />
                    <span style={{ fontSize: '0.9rem' }}>Pendentes</span>
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--accent-red)' }}>
                    {atividadeSemanal.pendentes}
                  </span>
                </div>
              </div>
            </div>

            {/* Campanhas da Semana */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Campanhas da Semana</h2>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--secondary-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Zap size={14} />
                  Ativas: {campanhasSemanais.filter(c => c.status === 'ativa').length}
                </div>
              </div>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {campanhasSemanais.map((campanha) => (
                  <div key={campanha.id} className="campanha-item">
                    <div className="campanha-info">
                      <div className="campanha-titulo">{campanha.titulo}</div>
                      <div className="campanha-descricao">
                        {campanha.descricao}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--secondary-text)',
                        marginTop: '0.25rem'
                      }}>
                        {campanha.leads} leads • {campanha.tipo}
                      </div>
                    </div>
                    <div className={`campanha-status ${
                      campanha.status === 'ativa' ? 'status-ativa' : 
                      campanha.status === 'pausada' ? 'status-pausada' : 'status-finalizada'
                    }`}>
                      {campanha.status === 'ativa' ? (
                        <>
                          <PlayCircle size={16} />
                          Ativa
                        </>
                      ) : campanha.status === 'pausada' ? (
                        <>
                          <Pause size={16} />
                          Pausada
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Finalizada
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popup para Sequência de Ligações */}
          {showSequenciaPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <div className="popup-header">
                  <h3 className="popup-title">Criar Sequência de Ligações</h3>
                  <button className="popup-close" onClick={() => setShowSequenciaPopup(false)}>
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSalvarSequencia(); }}>
                  <div className="form-group">
                    <label className="form-label">Título da Sequência</label>
                    <input
                      type="text"
                      className="form-input"
                      value={sequenciaForm.titulo}
                      onChange={(e) => setSequenciaForm(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Ex: Ligações para leads LinkedIn"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Descrição</label>
                    <textarea
                      className="form-textarea"
                      value={sequenciaForm.descricao}
                      onChange={(e) => setSequenciaForm(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Descreva o objetivo e estratégia da sequência"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prioridade</label>
                    <select
                      className="form-select"
                      value={sequenciaForm.prioridade}
                      onChange={(e) => setSequenciaForm(prev => ({ ...prev, prioridade: e.target.value }))}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Selecionar Leads</label>
                    <div className="leads-list">
                      {leads.map(lead => (
                        <div key={lead.id} className="lead-item">
                          <input
                            type="checkbox"
                            className="lead-checkbox"
                            checked={sequenciaForm.leadsSelecionados.includes(lead.id)}
                            onChange={() => handleLeadSelection(lead.id)}
                          />
                          <div className="lead-info">
                            <div className="lead-name">{lead.nome}</div>
                            <div className="lead-details">
                              {lead.empresa} • {lead.telefone} • {lead.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Observações</label>
                    <textarea
                      className="form-textarea"
                      value={sequenciaForm.observacoes}
                      onChange={(e) => setSequenciaForm(prev => ({ ...prev, observacoes: e.target.value }))}
                      placeholder="Anotações adicionais sobre a sequência"
                    />
                  </div>

                  <div className="popup-actions">
                    <button type="button" className="btn-secondary" onClick={handleImprimirSequencia}>
                      <Printer size={16} style={{ marginRight: '0.5rem' }} />
                      Imprimir
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setShowSequenciaPopup(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={16} style={{ marginRight: '0.5rem' }} />
                      Salvar Sequência
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PainelPrincipal;