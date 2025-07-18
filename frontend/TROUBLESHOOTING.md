# Guia de Solução de Problemas - Sistema de Vendas

## Problemas Comuns e Soluções

### 1. Erro de Importação da Planilha

**Problema:** Os dados da planilha não são reconhecidos ou não aparecem no histórico de vendas.

**Soluções:**
1. **Verificar formato da planilha:**
   - Use o formato Excel (.xlsx) ou CSV
   - Certifique-se de que as colunas estão noAno | 0    | 1    | 2    | ... | 11   | Vendido | Faturado
2024| 15000| 18000| 12000| ... | 0    | 111000  | 95000meadas corretamente
   - Baixe o exemplo de planilha disponível no sistema

2. **Estrutura correta da planilha:**
   ```
   Ano | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | Vendido | Faturado
   2024|15000|18000|12000|22000|19000|25000|0|0|0|0|0|0|111000|95000
   ```
   - Coluna "Ano": Ano de referência (2024, 2025, etc.)
   - Colunas 0-11: Valores por mês (0=Janeiro, 1=Fevereiro, etc.)
   - Colunas "Vendido" e "Faturado": Opcionais, para valores totais

3. **Valores deve ser numéricos:**
   - Não use formatação de moeda (R$, vírgulas)
   - Use apenas números (ex: 15000, não R$ 15.000,00)

### 2. Erro de Permissões no Firebase

**Problema:** "Missing or insufficient permissions" ao carregar clientes ou dados.

**Soluções:**
1. **Verificar autenticação:**
   - Faça logout e login novamente
   - Verifique se o usuário tem as permissões corretas

2. **Limpar cache do navegador:**
   - Pressione Ctrl+Shift+Del
   - Limpe cookies e dados de site
   - Recarregue a página

3. **Usar modo offline:**
   - O sistema funciona offline com dados locais
   - Os dados são salvos automaticamente no localStorage

### 3. Erro JSX no Console

**Problema:** Warning sobre "non-boolean attribute jsx".

**Solução:**
- Este é um warning benigno relacionado ao React/Vite
- Não afeta o funcionamento do sistema
- Pode ser ignorado

### 4. Dados Não Aparecem no Histórico

**Problema:** Após importar, os dados não aparecem na página de vendas.

**Soluções:**
1. **Verificar mês selecionado:**
   - Use o seletor de mês/ano no topo da página
   - Navegue para o mês correto dos dados importados

2. **Recarregar dados:**
   - Clique no botão "Atualizar" na página
   - Aguarde o carregamento completo

3. **Verificar localStorage:**
   - Abra as ferramentas do desenvolvedor (F12)
   - Vá para Application > Local Storage
   - Procure por chaves como "historico-vendas-mensais-vendedor"

### 5. Performance e Carregamento

**Problema:** Sistema lento ou não carrega.

**Soluções:**
1. **Limpar dados antigos:**
   - Use a função "Limpar Dados" na página de vendas
   - Isso remove dados antigos e melhora a performance

2. **Verificar conexão:**
   - Certifique-se de que há conexão com a internet
   - O sistema funciona offline, mas sincroniza online

### 6. Comandos Úteis para Debug

**No console do navegador (F12):**

```javascript
// Limpar todos os dados salvos
localStorage.clear();
location.reload();

// Verificar dados salvos
console.log('Histórico:', JSON.parse(localStorage.getItem('historico-vendas-mensais-vendedor') || '[]'));
console.log('Vendas:', JSON.parse(localStorage.getItem('vendas-vendedor') || '[]'));

// Limpar apenas dados específicos
localStorage.removeItem('historico-vendas-mensais-vendedor');
localStorage.removeItem('vendas-vendedor');
localStorage.removeItem('clientes-vendedor');
```

## Contato para Suporte

Se os problemas persistirem, verifique:
1. Console do navegador (F12) para erros específicos
2. Logs detalhados durante a importação
3. Estrutura exata da planilha sendo importada

## Atualizações Recentes

- ✅ Melhorada a lógica de importação da planilha
- ✅ Corrigido erro de permissões no Firebase
- ✅ Adicionado exemplo de planilha para download
- ✅ Melhorado debug e logs de erro
- ✅ Sistema funciona offline com dados locais
