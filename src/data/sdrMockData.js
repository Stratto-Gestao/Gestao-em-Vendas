// Dados mockados para o SDR
export const initializeSDRData = () => {
  // Dados de exemplo para tarefas do SDR
  const tarefasSDR = [
    {
      id: 1,
      titulo: 'Qualificar leads da campanha LinkedIn',
      descricao: 'Analisar e qualificar os leads recebidos da campanha no LinkedIn',
      tipo: 'Qualificação',
      categoria: 'Prospecção',
      prioridade: 'alta',
      prazo: new Date().toISOString().split('T')[0], // Hoje
      status: 'Em andamento',
      progresso: 60,
      responsavel: 'SDR',
      estimativa: '2 horas',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      titulo: 'Follow-up com prospects TechStart',
      descricao: 'Realizar follow-up com prospects que demonstraram interesse',
      tipo: 'Follow-up',
      categoria: 'Prospecção',
      prioridade: 'média',
      prazo: new Date().toISOString().split('T')[0], // Hoje
      status: 'Pendente',
      progresso: 0,
      responsavel: 'SDR',
      estimativa: '1 hora',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      titulo: 'Agendar reunião com Global Corp',
      descricao: 'Agendar reunião de apresentação com o lead qualificado',
      tipo: 'Reunião',
      categoria: 'Vendas',
      prioridade: 'alta',
      prazo: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Amanhã
      status: 'Concluída',
      progresso: 100,
      responsavel: 'SDR',
      estimativa: '30 minutos',
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      titulo: 'Ligações sequenciais - Lista A',
      descricao: 'Realizar ligações para a lista A de prospects',
      tipo: 'Ligações',
      categoria: 'Prospecção',
      prioridade: 'alta',
      prazo: new Date().toISOString().split('T')[0], // Hoje
      status: 'Em andamento',
      progresso: 75,
      responsavel: 'SDR',
      estimativa: '3 horas',
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      titulo: 'Atualizar CRM com informações dos leads',
      descricao: 'Atualizar o CRM com as informações coletadas nas ligações',
      tipo: 'Administrativo',
      categoria: 'Administrativo',
      prioridade: 'média',
      prazo: new Date().toISOString().split('T')[0], // Hoje
      status: 'Pendente',
      progresso: 0,
      responsavel: 'SDR',
      estimativa: '1 hora',
      createdAt: new Date().toISOString()
    }
  ];

  // Dados de exemplo para atividades do SDR
  const atividadesSDR = [
    {
      id: 1,
      tipo: 'call',
      descricao: 'Ligação para TechStart Solutions - Lead qualificado',
      tempo: '5 min atrás',
      status: 'success',
      detalhes: {
        duracaoLigacao: '8 min',
        resultado: 'Interessado',
        proximoPasso: 'Enviar proposta'
      }
    },
    {
      id: 2,
      tipo: 'email',
      descricao: 'E-mail de follow-up enviado para Inovação Digital',
      tempo: '1h atrás',
      status: 'sent',
      detalhes: {
        assunto: 'Proposta de Solução Tecnológica',
        tipoEmail: 'Follow-up',
        templateUsado: 'Template B'
      }
    },
    {
      id: 3,
      tipo: 'meeting',
      descricao: 'Reunião agendada com Global Corp para sexta-feira',
      tempo: '2h atrás',
      status: 'scheduled',
      detalhes: {
        dataReuniao: '2024-01-19',
        horaReuniao: '14:00',
        tipoReuniao: 'Apresentação'
      }
    },
    {
      id: 4,
      tipo: 'qualification',
      descricao: 'Lead qualificado - Smart Systems (Interesse alto)',
      tempo: '3h atrás',
      status: 'qualified',
      detalhes: {
        pontuacao: 85,
        criterios: ['Orçamento confirmado', 'Decisor identificado', 'Necessidade urgente'],
        proximoPasso: 'Transferir para vendas'
      }
    },
    {
      id: 5,
      tipo: 'call',
      descricao: 'Tentativa de ligação - Innovation Labs (Não atendeu)',
      tempo: '4h atrás',
      status: 'no_answer',
      detalhes: {
        tentativas: 2,
        proximaTentativa: 'Amanhã às 10h',
        observacao: 'Tentar novamente no período da manhã'
      }
    }
  ];

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
      interesse: 'Alto',
      orcamento: 'R$ 50.000',
      timeline: '30 dias',
      reuniaoAgendada: true,
      dataReuniao: '2024-01-19',
      observacoes: 'Muito interessado na solução de automação',
      ultimaInteracao: '2024-01-18',
      criadoEm: new Date(2024, 0, 15).toISOString(), // Janeiro 2024
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
      interesse: 'Médio',
      orcamento: 'R$ 30.000',
      timeline: '60 dias',
      reuniaoAgendada: false,
      observacoes: 'Aguardando aprovação do orçamento',
      ultimaInteracao: '2024-01-17',
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
      interesse: 'Alto',
      orcamento: 'R$ 100.000',
      timeline: '15 dias',
      reuniaoAgendada: false,
      observacoes: 'Decisor principal, muito interessado',
      ultimaInteracao: '2024-01-18',
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
      interesse: 'Alto',
      orcamento: 'R$ 75.000',
      timeline: '45 dias',
      reuniaoAgendada: true,
      dataReuniao: '2024-01-20',
      observacoes: 'Precisa de solução urgente',
      ultimaInteracao: '2024-01-18',
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
      interesse: 'Baixo',
      orcamento: 'Não informado',
      timeline: 'Indefinido',
      reuniaoAgendada: false,
      observacoes: 'Não tem orçamento disponível no momento',
      ultimaInteracao: '2024-01-16',
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
      interesse: 'Médio',
      orcamento: 'R$ 25.000',
      timeline: '90 dias',
      reuniaoAgendada: false,
      observacoes: 'Interessada mas precisa de mais informações',
      ultimaInteracao: '2024-01-17',
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
      interesse: 'Alto',
      orcamento: 'R$ 80.000',
      timeline: '30 dias',
      reuniaoAgendada: false,
      observacoes: 'Precisa de apresentação da solução',
      ultimaInteracao: '2024-01-18',
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
      interesse: 'Alto',
      orcamento: 'R$ 120.000',
      timeline: '20 dias',
      reuniaoAgendada: true,
      dataReuniao: '2024-01-22',
      observacoes: 'Muito interessada, decisor confirmado',
      ultimaInteracao: '2024-01-18',
      criadoEm: new Date(2024, 0, 16).toISOString(),
      tentativas: 2,
      recebido: '16/01/2024'
    }
  ];

  // Métricas de performance do SDR
  const metricsSDR = {
    ligacoesDiarias: {
      meta: 50,
      realizado: 35,
      semana: [45, 38, 42, 35, 48, 40, 32]
    },
    taxaConexao: {
      meta: 40,
      realizado: 35,
      historico: [32, 35, 38, 35, 40, 35, 37]
    },
    qualificacoesSemana: {
      meta: 15,
      realizado: 12,
      historico: [10, 12, 15, 12, 18, 14, 16]
    },
    reunioesAgendadas: {
      meta: 10,
      realizado: 8,
      semana: [2, 1, 3, 2, 0, 1, 2]
    },
    tempoMedioResposta: '2.3h',
    taxaQualificacao: 44.7
  };

  // Salvar no localStorage
  localStorage.setItem('tarefas-sdr', JSON.stringify(tarefasSDR));
  localStorage.setItem('atividades-sdr', JSON.stringify(atividadesSDR));
  localStorage.setItem('leads-sdr', JSON.stringify(leadsSDR));
  localStorage.setItem('metrics-sdr', JSON.stringify(metricsSDR));

  // Também salvar os leads no formato que o Firebase espera
  localStorage.setItem('leads-firebase-mock', JSON.stringify(leadsSDR));

  console.log('Dados mockados do SDR inicializados com sucesso!');
  console.log('Leads criados:', leadsSDR.length);
  console.log('- Qualificados:', leadsSDR.filter(l => l.status === 'Qualificado').length);
  console.log('- Prospectos (Novo/Contatado/Não Qualificado):', leadsSDR.filter(l => 
    l.status === 'Novo' || l.status === 'Contatado' || l.status === 'Não Qualificado'
  ).length);
  console.log('- Taxa de acerto:', (
    (leadsSDR.filter(l => l.status === 'Qualificado').length / leadsSDR.length) * 100
  ).toFixed(1) + '%');
};

// Função para limpar dados do SDR
export const clearSDRData = () => {
  localStorage.removeItem('tarefas-sdr');
  localStorage.removeItem('atividades-sdr');
  localStorage.removeItem('leads-sdr');
  localStorage.removeItem('metrics-sdr');
  console.log('Dados do SDR limpos!');
};
