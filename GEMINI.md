# Documento Gemini do Projeto

## Descrição
Este documento serve para orientar a IA sobre as especificidades, padrões e configurações deste projeto.

## Tecnologias Utilizadas
- **Frontend**: React (Vite)
- **Backend**: Firebase Functions (Node.js)
- **Estilização**: CSS Padrão
- **Linting**: ESLint

## Comandos Principais
- `npm install`: Instala as dependências.
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run lint`: Executa o linter.
- `firebase deploy`: Implanta as alterações no Firebase.

## Estrutura do Projeto
- `src/`: Contém todo o código-fonte do frontend.
- `src/components/`: Componentes React reutilizáveis.
- `src/pages/`: Componentes que representam páginas completas.
- `src/contexts/`: Contextos React para gerenciamento de estado.
- `functions/`: Contém o código para as Firebase Functions.
- `public/`: Arquivos estáticos.
- `dist/`: Diretório de build de produção.

## Instruções Adicionais
- Manter a estrutura de pastas existente.
- Seguir as convenções de nomenclatura e estilo do ESLint.
- Todos os novos componentes devem ser funcionais e utilizar hooks.

## Histórico de Implementações (Save Point)
- **Data:** 10 de julho de 2025
- **Resumo:**
  - **Funcionalidade "Biblioteca de Scripts"**:
    - **Admin (`AdminPage.jsx`):** Implementado o CRUD completo para scripts de vendas. O admin pode adicionar, visualizar, editar e excluir scripts através de um modal de gerenciamento. Os dados são salvos na coleção `scripts` do Firestore.
    - **Usuário (`AcademiaPage.jsx`):** Os usuários podem visualizar os scripts de vendas na "Biblioteca de Vendas". Um popup exibe a lista de scripts, e um segundo popup mostra o conteúdo detalhado de cada um. Foi corrigido um bug que causava tela branca ao carregar scripts com campos de dados inconsistentes.
  - **Estrutura da Seção "CRM"**:
    - **Criação de Páginas:** Foram criadas as páginas `VendedorPage.jsx` e `SDRPage.jsx` dentro de `src/pages/CRM/`.
    - **Navegação e Roteamento:** As novas páginas foram integradas ao `Dashboard.jsx`, sendo exibidas corretamente ao clicar nos submenus "Vendedor" e "SDR".
    - **Controle de Acesso:** As páginas possuem proteção de rota que verifica o `userRole` do `AuthContext`, garantindo que apenas usuários com os cargos corretos (Vendedor, SDR ou Super Admin) possam acessá-las.
  - **Estilização e UI/UX**:
    - **Layout das Páginas de CRM:** As páginas de Vendedor e SDR foram estruturadas com um layout de painel, incluindo um cabeçalho e uma grade de cards.
    - **Estilo Glassmorphism:** Foram adicionados estilos CSS em `index.css` para aplicar um design Glassmorphism consistente e elegante aos cards e componentes das novas páginas de CRM, melhorando a experiência visual.