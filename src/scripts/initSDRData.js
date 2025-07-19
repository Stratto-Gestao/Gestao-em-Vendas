// Script para inicializar dados mockados do SDR no console do navegador
// Execute este código no console do navegador para inicializar os dados de teste

console.log('🚀 Inicializando dados mockados do SDR...');

// Dados de exemplo para leads do SDR
const leadsSDR = [
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
  },
  {
    id: 6,
    nome: 'Fernanda Lima',
    empresa: 'Startup Pro',
    email: 'fernanda.lima@startuppro.com',
    telefone: '(11) 4444-5678',
    cargo: 'Fundadora',
    origem: 'Website',
    status: 'Contatado',
    pontuacao: 65,
    criadoEm: new Date(2024, 0, 14).toISOString(),
    tentativas: 1,
    recebido: '14/01/2024'
  },
  {
    id: 7,
    nome: 'Ricardo Souza',
    empresa: 'MegaCorp',
    email: 'ricardo.souza@megacorp.com',
    telefone: '(11) 3333-9876',
    cargo: 'Gerente de TI',
    origem: 'Indicação',
    status: 'Novo',
    pontuacao: 75,
    criadoEm: new Date(2024, 0, 17).toISOString(),
    tentativas: 0,
    recebido: '17/01/2024'
  },
  {
    id: 8,
    nome: 'Lucia Ferreira',
    empresa: 'InnovateTech',
    email: 'lucia.ferreira@innovatetech.com',
    telefone: '(11) 2222-1234',
    cargo: 'Diretora de Operações',
    origem: 'E-mail Marketing',
    status: 'Qualificado',
    pontuacao: 88,
    criadoEm: new Date(2024, 0, 16).toISOString(),
    tentativas: 2,
    recebido: '16/01/2024'
  }
];

// Dados de exemplo para tarefas do SDR
const tarefasSDR = [
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

// Dados de exemplo para atividades do SDR
const atividadesSDR = [
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

// Salvar no localStorage
localStorage.setItem('tarefas-sdr', JSON.stringify(tarefasSDR));
localStorage.setItem('atividades-sdr', JSON.stringify(atividadesSDR));
localStorage.setItem('leads-firebase-mock', JSON.stringify(leadsSDR));

// Calcular métricas
const leadsQualificados = leadsSDR.filter(l => l.status === 'Qualificado').length;
const leadsProspectos = leadsSDR.filter(l => 
  l.status === 'Novo' || l.status === 'Contatado' || l.status === 'Não Qualificado'
).length;
const taxaAcerto = ((leadsQualificados / leadsSDR.length) * 100).toFixed(1);

console.log('✅ Dados mockados do SDR inicializados com sucesso!');
console.log('📊 Estatísticas:');
console.log('├── Total de leads:', leadsSDR.length);
console.log('├── Leads qualificados:', leadsQualificados);
console.log('├── Leads prospectos:', leadsProspectos);
console.log('├── Taxa de acerto:', taxaAcerto + '%');
console.log('├── Tarefas criadas:', tarefasSDR.length);
console.log('└── Atividades criadas:', atividadesSDR.length);
console.log('');
console.log('🔄 Recarregue a página para ver os dados no painel do SDR!');

// Função para limpar dados
window.clearSDRData = function() {
  localStorage.removeItem('tarefas-sdr');
  localStorage.removeItem('atividades-sdr');
  localStorage.removeItem('leads-firebase-mock');
  console.log('🗑️ Dados do SDR limpos!');
};

console.log('💡 Para limpar os dados, execute: clearSDRData()');
