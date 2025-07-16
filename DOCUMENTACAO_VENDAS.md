# Página de Vendas - Documentação

## Visão Geral

A página de Vendas foi criada para permitir o controle eficiente do processo de vendas e faturamento, separando claramente as duas operações conforme o fluxo de negócio da empresa.

## Processo de Negócio

### Fluxo Atual
1. **Venda realizada** (ex: Junho) - Pedido é registrado
2. **Faturamento** pode ocorrer em mês diferente (ex: Julho ou Agosto)
3. **Comissão** é calculada sobre o valor faturado, não sobre o vendido

### Problema Solucionado
- Separação clara entre vendas e faturamento
- Controle de comissões baseado em faturamento real
- Relatórios precisos para gestão

## Funcionalidades Implementadas

### 1. Estatísticas Dashboard
- **Total Vendido**: Soma de todos os pedidos do mês
- **Total Faturado**: Soma de todos os faturamentos do mês
- **Ticket Médio**: Valor médio por pedido
- **Pedidos Pendentes**: Quantidade de pedidos ainda não faturados

### 2. Card: Vendas do Mês
**Objetivo**: Registrar novos pedidos realizados

**Campos do formulário**:
- Número do Pedido (obrigatório)
- Nome do Cliente (obrigatório)
- Valor do Pedido (obrigatório)
- Data do Pedido (obrigatório)
- Previsão de Faturamento (opcional)

**Funcionalidades**:
- Validação de campos obrigatórios
- Formatação automática de valores monetários
- Armazenamento no Firebase Firestore
- Feedback visual de sucesso/erro

### 3. Card: Faturamento do Mês
**Objetivo**: Registrar valores efetivamente faturados

**Campos do formulário**:
- Número do Pedido (obrigatório)
- Valor Faturado (obrigatório)
- Data de Faturamento (obrigatório)

**Funcionalidades**:
- Vinculação automática com pedidos existentes
- Formatação automática de valores monetários
- Armazenamento no Firebase Firestore
- Feedback visual de sucesso/erro

### 4. Card: Histórico de Pedidos
**Objetivo**: Visualizar consolidado de vendas e faturamentos

**Informações exibidas**:
- Número do Pedido
- Nome do Cliente
- Valor Vendido
- Valor Faturado
- Data de Faturamento
- Status (Faturado/Pendente)

**Funcionalidades**:
- Busca por número de pedido ou cliente
- Tabela responsiva
- Indicadores visuais de status
- Filtros por período

## Estrutura Técnica

### Coleções Firebase
1. **vendas**: Armazena informações dos pedidos
2. **faturamentos**: Armazena informações dos faturamentos

### Regras de Segurança
- Usuários só podem acessar seus próprios dados
- Admins têm acesso completo
- Validação de propriedade dos dados

### Componentes React
- Estado local para gerenciar formulários
- Hooks para Firebase operations
- Formatação de moeda em BRL
- Validação de formulários

## Relatórios Gerados

### 1. Relatório de Vendas do Mês
- Lista todos os pedidos do mês atual
- Mostra valores vendidos
- Previsão de faturamento

### 2. Relatório de Faturamento do Mês
- Lista todos os faturamentos do mês atual
- Base para cálculo de comissões
- Controle de fluxo de caixa

### 3. Histórico Consolidado
- Visão completa pedido x faturamento
- Identificação de pedidos pendentes
- Análise de performance

## Benefícios da Implementação

1. **Controle Financeiro**: Separação clara entre vendas e faturamento
2. **Cálculo Preciso**: Comissões baseadas em faturamento real
3. **Gestão Eficiente**: Identificação rápida de pendências
4. **Relatórios Confiáveis**: Dados organizados e acessíveis
5. **Interface Intuitiva**: Fluxo simples e claro para o usuário

## Próximos Passos Sugeridos

1. **Notificações**: Alertas para pedidos próximos do vencimento
2. **Dashboards Gerenciais**: Relatórios consolidados para gestão
3. **Integração**: Conexão com ERP/sistemas externos
4. **Exportação**: Relatórios em Excel/PDF
5. **Métricas Avançadas**: Análise de performance e tendências

## Uso da Página

1. **Acesso**: Menu Vendedor > Vendas
2. **Registrar Venda**: Clicar no botão "Adicionar Venda"
3. **Registrar Faturamento**: Clicar no botão "Adicionar Faturamento"
4. **Consultar Histórico**: Clicar no botão "Ver Histórico"
5. **Filtros**: Usar busca para encontrar pedidos específicos

## Manutenção

- Dados armazenados no Firebase Firestore
- Backup automático pelo Firebase
- Regras de segurança aplicadas
- Logs de erro disponíveis no console
