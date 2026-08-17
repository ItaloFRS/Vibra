# Vibra - Plataforma All-in-One de Ingressos Sociais

O **Vibra** é uma plataforma inovadora que transforma a compra de ingressos para eventos em uma jornada social integrada de ponta a ponta. Em vez de limitar-se a uma transação financeira, o Vibra conecta frequentadores de eventos por interesses mútuos antes, durante e após o evento através de chats em tempo real e de um motor de match contextual.

Para entender as diretrizes de desenvolvimento do repositório, consulte o arquivo [GEMINI.md]. Para mais detalhes sobre o design system do projeto, veja [STITCH_DESIGN.md].

---

## 🚀 Visão Geral e Conceito do Produto

O ecossistema é voltado para dois públicos principais:
1. **Consumidores Finais (B2C):** Frequentadores de eventos que utilizam o aplicativo mobile para descobrir festas, comprar ingressos e interagir com outras pessoas que vão ao mesmo evento.
2. **Produtores de Eventos (B2B):** Organizadores locais e agências que utilizam o dashboard web para gerenciar vendas, analisar métricas demográficas e de engajamento da comunidade e moderar as salas de chat.

### Diferenciais do MVP
* **Match Contextual:** Usuários que adicionaram um evento aos favoritos ou que compraram o ingresso entram em uma fila de match específica daquele evento, permitindo a formação de conexões de valor.
* **Comunidades e Chats Dinâmicos:** Cada evento conta com canais de texto em tempo real (como transporte/carona, VIP e geral) estruturados estilo Discord para conectar as pessoas de forma engajadora.
* **Design "The Living Pulse":** Uma identidade visual premium e orgânica com cantos arredondados amplos, glassmorphism e ausência de linhas divisórias rígidas de 1px (a regra do *No-Line*), seguindo o protótipo fiel do Google Stitch.
* **Carteira Digital Offline:** Armazenamento local seguro no aplicativo para acessar ingressos e códigos QR mesmo em locais sem conexão com a internet.

---

## 🛠️ Stack Tecnológica

O monorepo está estruturado com as seguintes tecnologias:

### 📱 Front-end Mobile (B2C)
* **Framework:** React Native com Expo (Managed Workflow).
* **Navegação:** Expo Router (baseado em arquivos).
* **Estilização:** Tailwind CSS (via NativeWind).
* **Gerenciamento de Estado:** TanStack Query (React Query) para cache e chamadas de API resilientes.
* **Real-time:** SockJS e StompJS para WebSockets do chat.
* **Geolocalização:** Expo Location para descoberta de eventos locais.

### 💻 Front-end Web (B2B)
* **Framework:** React + Vite (para builds extremamente rápidos).
* **Página Inicial/Landing Page:** Next.js, Framer Motion e Remotion para uma experiência cinematográfica e com foco em SEO.
* **Gráficos:** Recharts / Chart.js para dashboards demográficos e métricas financeiras.

### ⚙️ Back-end
* **Linguagem & Framework:** Java 21 (com Virtual Threads para alta concorrência de mensagens) e Spring Boot 3.x.
* **Segurança:** Spring Security + Stateless JWT.
* **Comunicação:** Spring WebSocket com protocolo STOMP.
* **Banco de Dados:** PostgreSQL 17 (com uso de colunas JSONB para dados semiflexíveis de preferências e logs).
* **Mídias e Object Storage:** Integração direta com a API do Cloudinary para CDN e otimização dinâmica de imagens.
* **Gateway de Pagamento:** API oficial do Mercado Pago para vendas transacionais seguras (ACID).

---

## 🏗️ Metodologia de Desenvolvimento e IA

O projeto foi construído utilizando metodologias modernas de engenharia com apoio de inteligência artificial:

1. **SDD (Spec-Driven Development):** Todo o desenvolvimento foi guiado por especificações robustas criadas de forma prévia. O layout e as interações foram extraídos e reproduzidos a partir do Google Stitch com fidelidade rigorosa.
2. **TDD (Test-Driven Development):** Escrita prévia de testes automatizados com cobertura superior a 80% em novos códigos, utilizando JUnit/Mockito no backend e React Native Testing Library no frontend.
3. **Gemini como Copiloto de IA:** Utilizado de forma orquestrada para interpretar especificações e traduzi-las em implementações limpas e modulares.
4. **Condutor:** Ferramenta dedicada a gerenciar e manter o contexto das "tracks" de desenvolvimento ao longo do projeto, gerando e organizando a documentação localizada na pasta [conductor](file:///c:/Users/italo/OneDrive/Documentos/1-Progama%C3%A7%C3%A3o/Projeto-VIBRA/Codigos/VIBRA-V1/conductor).

---

## 📂 Estrutura de Pastas Principal

```plaintext
VIBRA-V1/
├── apps/
│   ├── mobile/            # Aplicativo React Native (Expo)
│   └── web-dashboard/     # Dashboard React + Vite para os produtores B2B
├── backend/               # Código-fonte Java 21 / Spring Boot 3.x
├── conductor/             # Trilhas, especificações e logs do Condutor
├── stitch-html/           # Estruturas exportadas do design system Google Stitch
├── docker-compose.yml     # Orquestração do banco PostgreSQL local
└── README.md              # Documentação principal do repositório
```

---

## 🚦 Como Iniciar o Projeto Localmente

### Pré-requisitos
* Node.js (v18+) & npm/yarn.
* Java Development Kit (JDK 21).
* Maven (configurado no caminho local).
* Docker & Docker Compose.

### Passo 1: Inicializar o Banco de Dados
Na raiz do projeto, suba o container PostgreSQL utilizando o arquivo [docker-compose.yml](file:///c:/Users/italo/OneDrive/Documentos/1-Progama%C3%A7%C3%A3o/Projeto-VIBRA/Codigos/VIBRA-V1/docker-compose.yml):
```bash
docker-compose up -d
```

### Passo 2: Executar o Backend (Spring Boot)
1. Acesse o diretório do backend:
   ```bash
   cd backend
   ```
2. Configure as variáveis de ambiente necessárias no arquivo `application.properties` ou em um arquivo `.env` (ex: banco de dados, credenciais do Cloudinary e Mercado Pago).
3. Execute o projeto usando o Maven:
   ```bash
   mvn spring-boot:run
   ```

### Passo 3: Executar o Aplicativo Mobile (Expo)
1. Acesse a pasta do mobile:
   ```bash
   cd apps/mobile
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```

### Passo 4: Executar o Dashboard Web (React + Vite)
1. Acesse a pasta do dashboard:
   ```bash
   cd apps/web-dashboard
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 📝 Licença

Este projeto é desenvolvido para fins de aprendizado, experimentação e demonstração prática de metodologias de engenharia de software modernas.
