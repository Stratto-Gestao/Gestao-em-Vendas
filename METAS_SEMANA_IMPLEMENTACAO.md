# Implementação de Metas da Semana

## Funcionalidades Implementadas

### 1. Painel de Administração (AdminPage.jsx)

#### Novo Card "Metas da Semana"
- **Localização**: Adicionado após o card de "Campanhas de Vendas"
- **Funcionalidades**:
  - Visualização do número total de metas criadas
  - Contador de metas ativas
  - Indicador de progresso médio das metas
  - Botões para criar nova meta e gerenciar metas existentes

#### Modal "Nova Meta da Semana"
- **Campos de Meta**:
  - Título da meta
  - Descrição
  - Data de início da semana
  - Data de fim da semana
  - Meta de vendas realizadas
  - Meta de valor de vendas (R$)
  - Meta de clientes recuperados
  - Meta de novos clientes
  - Status (ativa/pausada/concluída)

- **Campos de Progresso**:
  - Vendas realizadas (atualizadas pelo vendedor)
  - Valor de vendas (atualizadas pelo vendedor)
  - Clientes recuperados (atualizados pelo vendedor)
  - Novos clientes (atualizados pelo vendedor)

#### Modal "Gerenciar Metas da Semana"
- Lista todas as metas criadas
- Permite editar metas existentes
- Permite excluir metas
- Mostra progresso atual de cada meta
- Exibe informações de status e datas

#### Funcionalidades Técnicas
- **Armazenamento**: localStorage com chave 'metas-semana-admin'
- **Cálculo automático de progresso**: Baseado na média das 4 métricas
- **Sincronização**: Mudanças são refletidas automaticamente no painel do vendedor
- **Validações**: Campos obrigatórios e formatos corretos

### 2. Painel do Vendedor (PainelPrincipalVendedor.jsx)

#### Card "Performance Individual" Atualizado
- **Comportamento**: Agora mostra as métricas das metas da semana quando disponíveis
- **Métricas Sincronizadas**:
  - Vendas Realizadas (atual/meta)
  - Valor de Vendas (atual/meta)
  - Clientes Recuperados (atual/meta)
  - Novos Clientes (atual/meta)
- **Fallback**: Mantém métricas antigas de tarefas quando não há metas definidas

#### Card "Metas da Semana" Atualizado
- **Sincronização**: Carrega metas ativas do localStorage do admin
- **Visualização**: Mostra 4 cards com as métricas principais
- **Botão "Atualizar Progresso"**: Permite ao vendedor atualizar seus números
- **Estado vazio**: Mensagem informativa quando não há metas definidas

#### Modal "Atualizar Progresso da Meta"
- **Campos editáveis**:
  - Vendas realizadas
  - Valor de vendas
  - Clientes recuperados
  - Novos clientes
- **Indicadores**: Mostra a meta de cada campo
- **Atualização automática**: Recalcula progresso e atualiza localStorage

#### Funcionalidades Técnicas
- **Carregamento automático**: Metas são carregadas na inicialização
- **Listener de mudanças**: Detecta mudanças no localStorage e atualiza automaticamente
- **Cálculo de progresso**: Cada métrica mostra percentual individual
- **Validações**: Apenas números positivos são aceitos

### 3. Armazenamento e Sincronização

#### Estrutura de Dados
```javascript
{
  id: timestamp,
  titulo: "Meta Semanal - Janeiro 2025",
  descricao: "Objetivos da semana...",
  semanaInicio: "2025-01-13",
  semanaFim: "2025-01-19",
  
  // Metas definidas pelo admin
  metaVendasRealizadas: 50,
  metaValorVendas: 50000,
  metaClientesRecuperados: 15,
  metaNovosClientes: 25,
  
  // Progresso atual (atualizado pelo vendedor)
  vendasRealizadas: 42,
  valorVendas: 45000,
  clientesRecuperados: 12,
  novosClientes: 20,
  
  // Calculado automaticamente
  progresso: 85, // média das 4 métricas
  
  status: "ativa",
  createdAt: "2025-01-15T10:30:00.000Z",
  updatedAt: "2025-01-15T16:45:00.000Z"
}
```

#### Sincronização
- **localStorage**: Usado para persistência entre sessões
- **Event Listeners**: Detectam mudanças em tempo real
- **Chaves utilizadas**:
  - `metas-semana-admin`: Armazena todas as metas
  - Filtragem automática por status "ativa"

### 4. Fluxo de Uso

#### Para o Administrador:
1. Acessa o painel administrativo
2. Clica em "Nova Meta" no card "Metas da Semana"
3. Define as metas para a semana (vendas, valor, clientes)
4. Salva a meta (status ativa por padrão)
5. Pode gerenciar metas existentes através do botão "Gerenciar"

#### Para o Vendedor:
1. Visualiza as metas no card "Metas da Semana"
2. Acompanha progresso no card "Performance Individual"
3. Clica em "Atualizar Progresso" para inserir resultados
4. Insere os números alcançados em cada métrica
5. Confirma a atualização
6. Vê o progresso atualizado em tempo real

### 5. Características Técnicas

#### Responsividade
- Layout adaptativo para diferentes tamanhos de tela
- Cards se reorganizam automaticamente

#### Performance
- Cálculos otimizados de progresso
- Atualizações apenas quando necessário
- Uso eficiente do localStorage

#### Usabilidade
- Interface intuitiva e moderna
- Feedback visual claro (barras de progresso, cores)
- Validações em tempo real
- Mensagens de confirmação

#### Manutenibilidade
- Código organizado em funções específicas
- Estados bem definidos
- Comentários explicativos
- Separação clara entre lógica e apresentação

## Arquivos Modificados

1. **AdminPage.jsx**: Adicionadas funcionalidades de criação e gerenciamento de metas
2. **PainelPrincipalVendedor.jsx**: Sincronização e atualização de progresso
3. **METAS_SEMANA_IMPLEMENTACAO.md**: Documentação da implementação

## Próximos Passos (Sugestões)

1. **Histórico de Metas**: Implementar visualização de metas passadas
2. **Relatórios**: Gerar relatórios de desempenho baseados nas metas
3. **Notificações**: Alertas quando metas são atingidas ou próximas do prazo
4. **Metas por Equipe**: Expandir para múltiplos vendedores
5. **Integração com API**: Migrar de localStorage para banco de dados
