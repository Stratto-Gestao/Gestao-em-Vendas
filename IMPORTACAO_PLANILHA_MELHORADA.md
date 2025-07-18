# 📋 Importação de Planilha - Versão Melhorada

## 🎯 Novo Comportamento

### Lógica de Processamento
A importação da planilha agora funciona da seguinte forma:

1. **Colunas 0-11**: Representam o valor **VENDIDO** de cada mês
2. **Valor Faturado**: Calculado proporcionalmente baseado nos totais
3. **Totais**: Colunas "Vendido" e "Faturado" são usadas para calcular proporções

### Exemplo Prático

**Planilha de Entrada:**
```
Ano | 0     | 1     | 2     | ... | 11 | Vendido | Faturado
2024| 15000 | 18000 | 12000 | ... | 0  | 111000  | 95000
```

**Processamento:**
- Janeiro 2024: **Vendido** = 15.000 (direto da coluna 0)
- Janeiro 2024: **Faturado** = 12.838 (15.000 × 95.000/111.000)
- Fevereiro 2024: **Vendido** = 18.000 (direto da coluna 1)
- Fevereiro 2024: **Faturado** = 15.405 (18.000 × 95.000/111.000)

## 🔧 Melhorias Implementadas

### 1. Cálculo Proporcional do Faturamento
- Se houver totais de "Vendido" e "Faturado", o sistema calcula a proporção
- O valor faturado de cada mês é calculado como: `valor_vendido_mes × (total_faturado / total_vendido)`

### 2. Clareza na Interface
- Instruções mais claras sobre o que cada coluna representa
- Exemplo visual da estrutura da planilha
- Explicação da lógica de processamento

### 3. Botão de Confirmação
- O botão "Confirmar Importação" aparece apenas quando há dados para importar
- Estado de loading durante o processamento
- Feedback visual claro do progresso

## 📊 Estrutura da Planilha

### Formato Recomendado
```
Ano | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | Vendido | Faturado
2024|15000|18000|12000|22000|19000|25000|0|0|0|0|0|0|111000|95000
2025|28000|32000|29000|35000|31000|38000|0|0|0|0|0|0|193000|180000
```

### Onde:
- **Ano**: Ano de referência (2024, 2025, etc.)
- **Colunas 0-11**: Valor **VENDIDO** por mês (0=Jan, 1=Fev, ..., 11=Dez)
- **Vendido**: Soma total vendida no ano (opcional para cálculos)
- **Faturado**: Soma total faturada no ano (opcional para cálculos)

## 🚀 Como Usar

1. **Preparar a Planilha**:
   - Crie uma planilha Excel (.xlsx)
   - Use a estrutura mostrada acima
   - Preencha os valores vendidos mês a mês

2. **Fazer Upload**:
   - Clique em "Importar Histórico de Vendas"
   - Selecione o arquivo da planilha
   - Aguarde o processamento

3. **Revisar Preview**:
   - Verifique os dados processados
   - Confirme se os valores estão corretos
   - Clique em "Confirmar Importação"

4. **Verificar Resultado**:
   - Os dados aparecerão no histórico de vendas
   - Use o seletor de mês/ano para navegar
   - Comissões serão calculadas automaticamente

## 🛠️ Vantagens da Nova Lógica

1. **Clareza**: Fica claro que colunas 0-11 são valores vendidos
2. **Proporcionalidade**: Faturamento é calculado proporcionalmente
3. **Flexibilidade**: Funciona com ou sem totais
4. **Precisão**: Valores são arredondados corretamente
5. **Consistência**: Dados ficam organizados por mês

## 📝 Exemplo de Uso Real

### Cenário: Vendas de 2024
- Janeiro: R$ 15.000 vendidos
- Fevereiro: R$ 18.000 vendidos
- Março: R$ 12.000 vendidos
- Total do ano: R$ 111.000 vendidos, R$ 95.000 faturados

### Planilha:
```
Ano | 0     | 1     | 2     | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11| Vendido | Faturado
2024| 15000 | 18000 | 12000 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 111000  | 95000
```

### Resultado:
- Janeiro 2024: Vendido R$ 15.000, Faturado R$ 12.838
- Fevereiro 2024: Vendido R$ 18.000, Faturado R$ 15.405
- Março 2024: Vendido R$ 12.000, Faturado R$ 10.270

## 🎉 Benefícios

- ✅ Interface mais intuitiva
- ✅ Cálculos mais precisos
- ✅ Processo de importação mais claro
- ✅ Menos erros de interpretação
- ✅ Melhor organização dos dados
- ✅ Feedback visual aprimorado
