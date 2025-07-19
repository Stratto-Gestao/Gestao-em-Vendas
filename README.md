# Plataforma de Gestão em Vendas

Uma plataforma completa de gestão de vendas construída com React, Vite e Firebase, oferecendo funcionalidades para SDRs, Vendedores e Administradores.

## 🚀 Funcionalidades

- **Dashboard Administrativo**: Gerenciamento completo de usuários, conteúdos e métricas
- **Painel SDR**: Gestão de leads, tarefas diárias e análise de performance
- **Painel Vendedor**: Gerenciamento de negócios, clientes e vendas
- **Academia**: Base de conhecimento com artigos, scripts e cursos
- **Gamificação**: Sistema de pontuação e recompensas
- **Assistente IA**: Suporte inteligente para vendas
- **MR Representações**: Gestão de licitações e representações

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, Vite 7, Tailwind CSS 4
- **Backend**: Firebase (Firestore, Authentication, Functions, Storage)
- **Bibliotecas**: 
  - Framer Motion (animações)
  - Recharts (gráficos)
  - Lucide React (ícones)
  - XLSX (manipulação de planilhas)
  - Axios (requisições HTTP)

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Stratto-Gestao/Gestao-em-Vendas.git
   cd Gestao-em-Vendas/frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas credenciais do Firebase:
   ```env
   VITE_API_KEY=sua_api_key_aqui
   VITE_AUTH_DOMAIN=seu_auth_domain_aqui
   VITE_PROJECT_ID=seu_project_id_aqui
   VITE_STORAGE_BUCKET=seu_storage_bucket_aqui
   VITE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
   VITE_APP_ID=seu_app_id_aqui
   ```

4. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication (Email/Password)
   - Ative Firestore Database
   - Ative Storage
   - Configure as regras de segurança do Firestore usando o arquivo `firestore.rules`

## 🚀 Como Executar

### Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── admin/           # Componentes específicos do admin
│   ├── AcademiaPage.jsx # Página da academia
│   ├── AdminPage.jsx    # Página administrativa
│   ├── Dashboard.jsx    # Dashboard principal
│   └── ...
├── pages/               # Páginas da aplicação
│   ├── SDR/            # Páginas específicas do SDR
│   ├── Vendedor/       # Páginas específicas do vendedor
│   ├── Gamificacao.jsx # Página de gamificação
│   └── ...
├── hooks/               # Hooks personalizados
│   ├── admin/          # Hooks para funcionalidades admin
│   ├── useAuth.js      # Hook de autenticação
│   └── ...
├── contexts/            # Contextos React
│   ├── AuthContext.jsx # Contexto de autenticação
│   └── ...
├── config/              # Configurações
│   └── firebase.js     # Configuração do Firebase
├── assets/              # Recursos estáticos
└── styles/              # Estilos globais
```

## 🔧 Configuração do Firebase

### Firestore Rules
As regras de segurança estão no arquivo `firestore.rules`. Para aplicá-las:

```bash
firebase deploy --only firestore:rules
```

### Firebase Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

## 🎯 Funcionalidades por Perfil

### Super Admin
- Gerenciamento completo de usuários
- Controle total sobre conteúdos
- Acesso a todas as métricas
- Configurações do sistema

### SDR (Sales Development Representative)
- Gestão de leads
- Tarefas diárias
- Análise de performance
- Passagem de vendas
- Base de conhecimento

### Vendedor
- Gerenciamento de negócios
- Controle de clientes
- Registro de vendas
- Análise de performance
- Assistente IA

### MR Responsável
- Gestão de licitações
- Controle de representações
- Relatórios específicos

## 🔒 Segurança

- Autenticação via Firebase Auth
- Regras de segurança no Firestore
- Validação de roles e permissões
- Variáveis de ambiente para credenciais
- Sanitização de dados de entrada

## 📊 Métricas e Analytics

- Dashboard com métricas em tempo real
- Análise de performance por usuário
- Relatórios de vendas
- Tracking de atividades
- Gamificação com pontuação

## 🎮 Sistema de Gamificação

- Pontuação por atividades
- Níveis e conquistas
- Ranking de usuários
- Recompensas e prêmios
- Desafios mensais

## 🤖 Assistente IA

- Suporte inteligente para vendas
- Análise de conversas
- Sugestões de abordagem
- Automação de tarefas
- Chat interativo

## 📚 Base de Conhecimento

- Artigos e tutoriais
- Scripts de cold calling
- Templates de WhatsApp
- Tratamento de objeções
- Cursos e treinamentos

## 🚀 Deploy

### Firebase Hosting
```bash
# Build do projeto
npm run build

# Deploy para Firebase
firebase deploy
```

### Outras Opções
- Vercel
- Netlify
- AWS S3 + CloudFront

## 🧪 Testes

```bash
# Executar testes
npm run test

# Executar testes com coverage
npm run test:coverage
```

## 📄 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview da build
- `npm run lint` - Executa o linter
- `npm run test` - Executa testes

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Crie uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

## 🔄 Versionamento

Usamos [SemVer](http://semver.org/) para versionamento. Para as versões disponíveis, veja as [tags neste repositório](https://github.com/seu-usuario/gestao-em-vendas/tags).

## 🎨 Customização

### Temas
O projeto usa Tailwind CSS com temas customizáveis. Para personalizar:

1. Edite `tailwind.config.js`
2. Modifique as variáveis CSS em `src/index.css`
3. Atualize os componentes conforme necessário

### Adicionar Novos Módulos
1. Crie o componente na pasta apropriada
2. Adicione as rotas necessárias
3. Configure as permissões no Firestore
4. Atualize a documentação
