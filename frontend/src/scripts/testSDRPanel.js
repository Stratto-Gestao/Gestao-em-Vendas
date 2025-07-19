// Script para testar o painel do SDR
import { initializeSDRData, clearSDRData } from '../data/sdrMockData.js';

// Inicializar dados de teste
console.log('Inicializando dados de teste para o SDR...');
initializeSDRData();

// Verificar se os dados foram carregados corretamente
const tarefas = JSON.parse(localStorage.getItem('tarefas-sdr') || '[]');
const atividades = JSON.parse(localStorage.getItem('atividades-sdr') || '[]');
const leads = JSON.parse(localStorage.getItem('leads-sdr') || '[]');
const metrics = JSON.parse(localStorage.getItem('metrics-sdr') || '{}');

console.log('Dados carregados:');
console.log('- Tarefas:', tarefas.length);
console.log('- Atividades:', atividades.length);
console.log('- Leads:', leads.length);
console.log('- Métricas:', Object.keys(metrics).length);

// Simular algumas interações
console.log('\nSimulando interações do SDR...');

// Adicionar uma nova atividade
const novaAtividade = {
  id: Date.now(),
  tipo: 'call',
  descricao: 'Ligação de teste - Novo Lead Qualificado',
  tempo: 'Agora',
  status: 'success',
  detalhes: {
    duracaoLigacao: '5 min',
    resultado: 'Interessado',
    proximoPasso: 'Agendar reunião'
  }
};

atividades.unshift(novaAtividade);
localStorage.setItem('atividades-sdr', JSON.stringify(atividades));

// Atualizar progresso de uma tarefa
const tarefaAtualizada = tarefas.find(t => t.id === 1);
if (tarefaAtualizada) {
  tarefaAtualizada.progresso = 80;
  tarefaAtualizada.status = 'Em andamento';
  localStorage.setItem('tarefas-sdr', JSON.stringify(tarefas));
}

// Adicionar um novo lead
const novoLead = {
  id: Date.now(),
  nome: 'Carlos Mendes',
  empresa: 'Future Tech',
  email: 'carlos.mendes@futuretech.com',
  telefone: '(11) 5555-7890',
  cargo: 'CTO',
  fonte: 'LinkedIn',
  status: 'Novo',
  pontuacao: 75,
  interesse: 'Alto',
  orcamento: 'R$ 60.000',
  timeline: '30 dias',
  reuniaoAgendada: false,
  observacoes: 'Interessado em automação de processos',
  ultimaInteracao: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString()
};

leads.push(novoLead);
localStorage.setItem('leads-sdr', JSON.stringify(leads));

console.log('Simulação concluída!');
console.log('O painel do SDR agora possui dados de teste atualizados.');
console.log('\nPara limpar os dados de teste, execute: clearSDRData()');
