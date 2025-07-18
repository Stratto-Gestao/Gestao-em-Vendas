# 📋 GUIA COMPLETO: Como Formatar a Planilha de Vendas

## 🎯 ENTENDA A LÓGICA

A planilha funciona como um **calendário em formato de tabela**:
- Cada **linha** = um ano completo
- Cada **coluna** = um mês específico
- Os **números das colunas** representam os meses (0=Janeiro, 1=Fevereiro, etc.)
- **IMPORTANTE**: Os valores nas colunas 0-11 representam o **VENDIDO** de cada mês

## 🔧 NOVA LÓGICA DE PROCESSAMENTO

### Como funciona agora:
1. **Colunas 0-11**: Valor **VENDIDO** por mês
2. **Coluna Vendido**: Soma total vendida no ano (opcional)
3. **Coluna Faturado**: Soma total faturada no ano (opcional)
4. **Cálculo do Faturado**: Se houver totais, o faturado mensal é calculado proporcionalmente

### Exemplo de Cálculo:
```
Se Janeiro teve R$ 15.000 vendidos
E o total do ano foi R$ 111.000 vendidos e R$ 95.000 faturados
Então o faturado de Janeiro = 15.000 × (95.000 ÷ 111.000) = R$ 12.838
```

## 📊 ESTRUTURA VISUAL DA PLANILHA

```
┌─────┬───────┬───────┬───────┬───────┬───────┬───────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Ano │   0   │   1   │   2   │   3   │   4   │   5   │  6  │  7  │  8  │  9  │ 10  │ 11  │
│     │ (Jan) │ (Fev) │ (Mar) │ (Abr) │ (Mai) │ (Jun) │(Jul)│(Ago)│(Set)│(Out)│(Nov)│(Dez)│
├─────┼───────┼───────┼───────┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤
│2024 │ 15000 │ 18000 │ 12000 │ 22000 │ 19000 │ 25000 │  0  │  0  │  0  │  0  │  0  │  0  │
│2025 │ 28000 │ 32000 │ 29000 │ 35000 │ 31000 │ 38000 │  0  │  0  │  0  │  0  │  0  │  0  │
└─────┴───────┴───────┴───────┴───────┴───────┴───────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

## 🔢 CORRESPONDÊNCIA DOS MESES

| Número | Mês        | Número | Mês        |
|--------|------------|--------|------------|
| 0      | Janeiro    | 6      | Julho      |
| 1      | Fevereiro  | 7      | Agosto     |
| 2      | Março      | 8      | Setembro   |
| 3      | Abril      | 9      | Outubro    |
| 4      | Maio       | 10     | Novembro   |
| 5      | Junho      | 11     | Dezembro   |

## 💡 EXEMPLO PRÁTICO PASSO A PASSO

### Cenário: Você tem os seguintes dados de vendas:

**2024:**
- Janeiro: R$ 15.000
- Fevereiro: R$ 18.000
- Março: R$ 12.000
- Abril: Não houve vendas
- Maio: R$ 22.000
- Junho: R$ 25.000
- Julho a Dezembro: Não houve vendas

**2025:**
- Janeiro: R$ 28.000
- Fevereiro: R$ 32.000
- Março: R$ 29.000
- Abril: R$ 35.000
- Maio: R$ 31.000
- Junho: R$ 38.000
- Julho a Dezembro: Não houve vendas

### Como transformar em planilha:

**1. Crie os cabeçalhos:**
```
A1: Ano
B1: 0
C1: 1
D1: 2
E1: 3
F1: 4
G1: 5
H1: 6
I1: 7
J1: 8
K1: 9
L1: 10
M1: 11
```

**2. Preencha os dados de 2024:**
```
A2: 2024
B2: 15000  (Janeiro)
C2: 18000  (Fevereiro)
D2: 12000  (Março)
E2: 0      (Abril - não houve vendas)
F2: 22000  (Maio)
G2: 25000  (Junho)
H2: 0      (Julho)
I2: 0      (Agosto)
J2: 0      (Setembro)
K2: 0      (Outubro)
L2: 0      (Novembro)
M2: 0      (Dezembro)
```

**3. Preencha os dados de 2025:**
```
A3: 2025
B3: 28000  (Janeiro)
C3: 32000  (Fevereiro)
D3: 29000  (Março)
E3: 35000  (Abril)
F3: 31000  (Maio)
G3: 38000  (Junho)
H3: 0      (Julho)
I3: 0      (Agosto)
J3: 0      (Setembro)
K3: 0      (Outubro)
L3: 0      (Novembro)
M3: 0      (Dezembro)
```

## ⚠️ REGRAS IMPORTANTES

### ✅ FAÇA ASSIM:
- Use apenas números: `15000`
- Para meses sem vendas: `0`
- Salve como Excel (.xlsx)
- Cada linha = um ano completo

### ❌ NÃO FAÇA ASSIM:
- ❌ R$ 15.000,00 → ✅ 15000
- ❌ Janeiro → ✅ 0
- ❌ Célula vazia → ✅ 0
- ❌ 15,000 → ✅ 15000

## 🚀 TUTORIAL RÁPIDO NO EXCEL

1. **Abra o Excel**
2. **Digite os cabeçalhos** (Ano, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)
3. **Preencha uma linha por ano** com os valores correspondentes
4. **Salve como .xlsx**
5. **Importe no sistema**

## 📈 RESULTADO ESPERADO

Após importar, você verá:
- ✅ Dados aparecendo no histórico de vendas
- ✅ Estatísticas atualizadas por mês
- ✅ Comissões calculadas automaticamente
- ✅ Possibilidade de navegar entre meses/anos

## 🆘 PROBLEMAS COMUNS

**"Nenhum dado foi encontrado"**
- Verifique se as colunas estão nomeadas com números (0, 1, 2...)
- Certifique-se de que há valores numéricos nas células

**"Dados não aparecem no histórico"**
- Use o seletor de mês/ano para navegar para o período correto
- Clique em "Atualizar" após a importação

**"Erro ao processar planilha"**
- Verifique se o arquivo está no formato .xlsx
- Certifique-se de que não há formatação especial nos números
