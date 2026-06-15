# *Diretrizes do Projeto VIBRA*

## *REPOSITORY:* https://github.com/ItaloFRS/VibraV1.git


## Identidade e Objetivo
- Você é um(a) Designer de Produto Sênior e Arquiteto(a) de Frontend especializado(a) em Sistemas de Design. Sua prioridade é escrever um código limpo, modular, escalável e de fácil manutenção. Prefira a clareza e a legibilidade em vez de soluções excessivamente complexas ou "espertas".
________________________________________


## Conceito geral do projeto

- O Vibra é uma plataforma "all-in-one" que transforma a compra de ingressos em uma jornada social. O foco é elevar a experiência do usuário da simples transação para a descoberta, networking (match) e engajamento em comunidade.
________________________________________


### Objetivos Estratégicos

- **Engajamento:** Conectar pessoas com interesses em comum antes, durante e após o evento.
- **Retenção:** Fornecer ferramentas para que produtores mantenham sua base de clientes ativa.
- **Premium UI/UX:** Entregar uma interface moderna e intuitiva para os públicos B2C e B2B.
________________________________________


## Pilha de Tecnologias (Tech Stack)

- **Front-end:** 
    - Interface do usuario(B2C): React Native utilizando o framework Expo e TypeScript.
    - Dashboard de Produtores(B2B): React + Vite.
- **Back-end:** Java 21 com o framework Spring Boot.
- **Banco de Dados:** PostGresql: 17(LTS).
________________________________________


## **🎨 Vibra Frontend: Mobile & Web Dashboard**

#### **Diretriz de Design:** Fidelidade Estrita ao Google Stitch
- O desenvolvimento das interfaces deve seguir estritamente os protótipos e especificações criadas no Google Stitch. Não há espaço para improvisação visual; o objetivo é uma reprodução fiel ("pixel-perfect") do que foi projetado.

#### **Componentização:**
- Utilizar a biblioteca de componentes do Stitch (Botões, Inputs, Modais, Cards) para garantir que o espaçamento, sombras e raios de borda sejam idênticos.

#### **Tokens de Design:**
- Exportar e utilizar os tokens (Cores, Tipografia, Elevação, Grid) do Stitch diretamente no tailwind.config.js e no tema do NativeWind.

#### **Interações:**
- Transições e animações de tela devem espelhar fielmente as microinterações definidas no protótipo de alta fidelidade.

#### **TypeScript Estrito:**
- O uso de TypeScript em modo estrito é obrigatório. O uso do tipo `any` é estritamente proibido. Crie interfaces ou tipos explícitos para todas as props e respostas de API.


### 1. Tecnologias Comuns

- Ambos os projetos utilizam o ecossistema React para permitir o compartilhamento de lógica (hooks, serviços de API) e garantir uma curva de aprendizado unificada.

•	**Gerenciamento de Estado:** TanStack Query (React Query) para cache de dados da API.
•	**Estilização: Tailwind CSS** (via NativeWind no Mobile).
•	**Consumo de API:** Axios com interceptors para anexar o token JWT automaticamente.
•	**Comunicação Real-time:** SockJS e StompJS para os WebSockets do chat.


### 2. **App Mobile (B2C)** (Usuário Final)

- O coração da experiência "social" e "transacional" do Vibra.

•	**Framework:** React Native com Expo (Managed Workflow);
•	**Fidelidade Stitch:** Implementação de Bottom Tabs e Stacks seguindo a hierarquia visual do Stitch;
•	**Área de Match:** O componente de "Swipe" deve respeitar exatamente as dimensões e feedbacks visuais (Overlay de Like/Nope) do design original;
•	**Chat:** Interface de chat estilo Discord adaptada para a linguagem visual do Google Stitch;
•	**Navegação:** Expo Router (Navegação baseada em arquivos, similar ao Next.js).
•	**Localização:** Expo Location para encontrar eventos próximos em Campina Grande e região.


#### **Fluxos Principais:**

1.	Descoberta de Eventos: Lista e mapa de eventos disponíveis.
2.	Página do Evento (O Hub):
3.	Informações gerais e compra de ingresso.
4.	Botão de Favorito: Gatilho para liberar o Match.
5.	Abas de Interação: Ingressos, Chat da comunidade, Área de Match e VIP.
6.	Sistema de Match (Swipe): Interface de cartões para usuários interessados no mesmo evento.
7.	Chat estilo Discord: Canais de texto em tempo real dentro do contexto do evento.
8.	Carteira de Ingressos: Exibição de QR Codes gerados pelo Backend.

#### **Telas do Stitch:** 

Essas são as telas com seus respectivos ids que deverão ser produzidas. Sempre que for iniciar a codificação consultar no **projeto Vibra (1836488892953926894)**:
  
   1. Home - Explorar (Tema Laranja) – 366800ef83b445d595ec1b45a7b572da
   2. Próximos Eventos – 1012f4a638b348fb937c1f9003c1410c
   3. Detalhes do Evento (Aba Feed) – 368076491ef243618e2b62942e4934b4
   4. Vibra Match (Aba Evento) – fa97fb1da3af4361a76ceaf60b8fe751
   5. Deu Match! – 9b07b5a8a14f4c5e8a64f0b43f9171b6
   6. Conversas e Mensagens – 596a1a4b4db2432993c7949bd046dea1
   7. Chat Individual (Elena) – f1192dd7d0274465aade63d476a25944
   8. Comunidade do Evento (Laranja) – 2b87161ad41d474c8d873b04fccbe9c9
   9. Chat Transporte & Caronas – 64a6e40085ee4c958e97bccd7a5d4d9d
   10. Compra de Ingressos – 113f583957814bbd9a5f12224fcd1fef
   11. Formas de Pagamento – 79b994231d4b4c4586d04ac2e29ace5a
   12. Confirmação de Compra – 52caca26753f48419e58781b3a2bff1f
   13. Meus Ingressos – 09c76ef21dab4625bf7160f705c0a2fd
   14. Detalhes do Ingresso (Simplificado) – f307f25da51f4ba199e1bfbdbd422923
   15. Aba VIP (Laranja) – 916e4ff98ed84ff8b0567f982712a6c7
   16. Perfil e Configurações – 7e04616232cb4943b633138edd26558b
   17. Cadastro (Final) – 625c521e467e4bc0b8c08b653eb66bb4
   18. Login Vibra (Logo Oficial) – 904fcd65ebe34c7e805bdba8d81f317e
   
________________________________________

### 3. *Web Dashboard(B2B)* (Produtor de Eventos)

- Focada em gestão, métricas de vendas e moderação de comunidade.

•	**Framework: React + Vite** (Para um build extremamente rápido).
•	**Gráficos:** Recharts ou Chart.js para visualização de vendas e engajamento.
•	**Fidelidade Stitch:**
    •	**Layout:** Sidebar, Topbar e Gráficos devem seguir o grid e as proporções exatas do Stitch.
    •	**Tabelas de Vendas:** Implementação de tabelas densas, porém legíveis, conforme especificado para a visão do produtor.
•	**Moderação:** Interface limpa para gestão de mensagens, com alertas e feedbacks visuais padronizados.

#### **Telas do Stitch:** 
Essas são as telas com seus respectivos ids que deverão ser produzidas, sempre que for iniciar a codificação consultar no **projeto Vibra (1836488892953926894)**:

   1. Dashboard Principal – 94730515fd6e4a7c97c3a72b5347cfad
   2. Meus Eventos – 55c45e4ba2ef42eb8a4a8e9de0e3aac0
   3. Dashboard Individual do Evento – cb09f5d82afa44969e029cb700bcdc8a
   4. Criar Novo Evento – 8e30cfb88b574d5e9e21d3e491433485
   5. Dashboard de Comunidades – 862f697ae56f4f4693740b9ac76e0bb1
   6. Relatórios Detalhados – a3ccfe3b7c4c45faa5673d178d96ff7e

#### **Funcionalidades do Produtor:**

•	**Gestão de Eventos:** Cadastro, edição, controle de lotes de ingressos e upload de banners.
•	**Analytics (Métricas):**
    •	Total de vendas em R$.
    •	Quantidade de ingressos por lote.
    •	Taxa de matches e mensagens no chat (medir o "calor" do evento).
•	**Moderação de Chat:** Visualização das mensagens do evento com poder de excluir mensagens ou banir usuários por comportamento inadequado.
•	**Check-in:** Ferramenta (via busca ou scanner web) para validar os ingressos na portaria do evento.


### 4. Fluxo de Sincronia Design-Código

1.	Inspeção: O desenvolvedor deve inspecionar as propriedades de CSS/Style no Stitch antes de codificar cada componente.
2.	Asset Management: Ícones e imagens devem ser exportados diretamente do Stitch para evitar perda de qualidade ou variações de escala.
3.	Review de UI: Cada nova tela desenvolvida deve passar por uma comparação lado a lado com o protótipo do Stitch antes de ser considerada "Done".


### 5. Integração com o Backend

**Autenticação (JWT)**

- •	O App Mobile armazena o token no SecureStore (Expo).
- •	A Dashboard Web armazena o token em Cookies (HttpOnly).
- •	Roles: O Frontend Web bloqueia o acesso se o usuário não tiver a role ROLE_PRODUCER.

**WebSockets no Mobile**

- Diferente da Web, no React Native precisamos garantir que o WebSocket seja fechado quando o usuário sai da tela do chat para economizar bateria e processamento.


### 6. Estrutura de Pastas (dentro de /apps)

Plaintext
apps/
├── mobile/
│   ├── src/
│   │   ├── app/            ## Expo Router (Tabs e Stacks)
│   │   ├── components/     ## UI Kit (Botões, Cards de Match)
│   │   ├── hooks/          ## useChat, useMatch, useLocation
│   │   └── services/       ## api.ts (Axios), socket.ts

├── web-dashboard/
│   ├── src/
│   │   ├── components/     ## Tabelas, Gráficos e Sidebar
│   │   ├── pages/          ## Dashboard, Relatórios, Cadastro de Evento
│   │   └── services/       ## api.ts (Axios)

________________________________________


## 🛠️ **Vibra Backend: Especificações e Arquitetura**

- Este documento consolida todas as decisões arquiteturais, definições de módulos e regras de negócio estabelecidas para o desenvolvimento do ecossistema Vibra.


### 1. Stack Tecnológica

- A escolha das tecnologias visa o equilíbrio entre consistência transacional (venda de ingressos) e alta interatividade (matches e chat).

- •	**Linguagem:** Java 21 (LTS) - Foco em Virtual Threads para alta concorrência no chat.
- •	**Framework:** Spring Boot 3.x.
- •	**Banco de Dados:** PostgreSQL 17(LTS) (Única fonte de verdade).
- •	Uso de tipos JSONB para dados semiflexíveis (preferências de match e logs).
- •	Uso de `@Transactional` para operações financeiras.
- •	Comunicação em Tempo Real: Spring WebSocket com protocolo STOMP.
- •	**Mensageria Interna:** Spring Application Events (Desacoplamento de módulos).
- •	**Segurança:** Spring Security + Stateless JWT (Diferenciação de Roles: USER e PRODUCER).
- •	**Infraestrutura Local:** Docker & Docker Compose.
- • **Injeção de Dependência:** Utilize construtores para injeção de dependência em vez da anotação `@Autowired` em campos.
- • **Respostas de API:** Retorne sempre um padrão de resposta consistente (ex: um objeto global de resposta com campos `data`, `status`, e `message`).


### 2. Arquitetura: Monólito Modular

- O projeto é organizado por Domínios de Negócio. Cada módulo é independente e a comunicação entre eles ocorre via Interfaces ou Eventos, evitando acoplamento forte.

#### 📦 Módulos Principais

##### 1. identity (Identidade e Acesso) – com.vibra.identity
- •	**Papel:** Gestão de usuários, autenticação e perfis (Bio/Fotos).
- •	**Roles:** ROLE_USER (App Mobile) e ROLE_PRODUCER (Dashboard Web).
- •	**Destaque:** Armazena preferências e bio em colunas JSONB para flexibilidade no Match.

##### 2. events (Catálogo de Eventos) - com.vibra.events
- •	**Papel:** CRUD de eventos, gestão de mídias e geolocalização.
- •	**Integração:** Fornece o contexto (event_id) para todos os outros módulos.

##### 3. tickets (Transacional e Vendas) - com.vibra.tickets
- •	**Papel:** Venda de ingressos, controle de estoque e integração com gateways.
- • **API:** Vamos utilizar a Api do mercado pago (mercadopago-sdk-java)
- •	**Regra Crítica:** Uso de @Transactional para garantir consistência ACID (evitar overselling).
- • **Fluxo:** O fluxo ideal é salvar o ingresso como `PENDING` -> Fechar a transação -> Chamar o Mercado   Pago. O status só deve mudar para `PAID` e disparar o `TicketConfirmedEvent` quando o backend receber um Webhook assíncrono do Mercado Pago confirmando o sucesso.
- •	**Evento:** Dispara TicketConfirmedEvent após aprovação do pagamento.

##### 4. social (Match e Chat) - com.vibra.social
- •	**Papel:** Gerencia Swipes, Matches e o Chat estilo Discord.
- •	**Regra de Match:** O acesso ao "Match" de um evento só é liberado se o usuário favoritou o evento ou comprou o ingresso.
- •	**Chat:** WebSockets para mensagens em tempo real dentro das páginas de eventos.

##### 5. notifications (Engajamento) - com.vibra.notifications
- •	**Papel:** Orquestrador de Push (Firebase) e E-mails (Spring Mail).
- •	**Canais:** Push Notifications (Firebase FCM) para matches e mensagens; E-mail para confirmação de ingressos.

##### 6. admin (Dashboard do Produtor) -  com.vibra.admin
- •	**Papel:** Agregação de métricas de vendas e ferramentas de moderação de chat.
- •	**Foco:** Exclusivo para o Front-end Web (React).


### 3. Regras de Negócio Críticas

#### 🎴 O Match Contextual

- Diferente de apps globais, o match no Vibra é estritamente vinculado a um evento.

- •	**Regra de Acesso:** Um usuário só entra na "Fila de Match" de um evento se ele preencher um dos requisitos:

1.	Tiver o evento em sua lista de Favoritos.
2.	Possuir um Ingresso Confirmado para o evento.

- •	**Temporalidade:** O match é liberado antes do evento ocorrer, visando a formação de grupos e conexões prévias.

#### 💬 Chat Dinâmico

    •	Cada evento possui sua própria salas de chat, semelhante ao discord.
    •	O backend gerencia as conexões via WebSocket, garantindo que as mensagens sejam entregues apenas aos usuários que possuem interesse ativo naquele evento específico.


### 4. Estrutura de Dados (Entidades Principais)

**Entidad**       |              **Descrição**             | **Observação**
------------------|----------------------------------------|-------------------------------------------
User	          | Dados de login e perfil.	           | Coluna preferences (JSONB) para afinidade.
Event	          | Detalhes do evento e dono (Producer).  | Vinculado a um producer_id.
Ticket	          | Registro de compra e QR Code.	       | Status: PENDING, PAID, CANCELLED.
Match	          | Relação entre dois usuários.	       | Contém event_id obrigatório.
UserEventInterest | Tabela de ligação/engajamento.	       | Flags: is_favorite e has_ticket.



### 5. Integração entre Módulos (Event-Driven)

Para evitar que o módulo de Tickets precise conhecer o módulo Social, usamos eventos assíncronos:

1.	TicketModule publica OrderPaidEvent.
2.	SocialModule escuta o evento e atualiza UserEventInterest.
3.	NotificationModule escuta o evento e envia o comprovante por e-mail.


### 6. Configuração de Ambiente (Docker)

- O arquivo docker-compose.yml na raiz do monorepo deve prover:

•	Um container Postgres:17(LTS).
•	Persistência em volume local para não perder dados de teste.
•	Variáveis de ambiente centralizadas (.env).


### 7. Fluxo de Desenvolvimento Sugerido

1.	Configurar o Docker Compose e o esqueleto do projeto Spring Boot.
2.	Implementar o módulo de Identity (Auth JWT).
3.	Implementar o módulo de Events (Base para os outros).
4.	Implementar a lógica de Interest e o gatekeeper do Match.
5.	Desenvolver o Chat com WebSockets.
6.	Finalizar com o módulo transacional de Tickets.

________________________________________


## **Estratégia de Mídia e Imagens (Cloudinary)**

- Para garantir performance máxima no Mobile e fidelidade visual aos protótipos do Stitch, o projeto utiliza uma arquitetura de Object Storage com processamento dinâmico.

### ⚙️ Backend (Java / Spring Boot)

- O backend atua como o controlador de segurança e integridade das mídias.

#### Armazenamento: 
Nenhuma imagem é salva no PostgreSQL. O banco armazena apenas a URL (String) ou o Public_ID retornado pelo Cloudinary.

#### Fluxo de Upload:

1.	O cliente (Mobile/Web) envia o arquivo via MultipartFile.
2.	O serviço ImageService.java valida o formato e tamanho.
3.	O arquivo é enviado ao Cloudinary via SDK oficial.
4.	A URL gerada é persistida na entidade correspondente (User ou Event).

#### Segurança: 
Apenas usuários autenticados (JWT) podem realizar uploads. Imagens de eventos excluídos são removidas do Cloudinary via Webhooks ou chamadas de API.


### 🎨 Frontend (React Native & React Web)

O frontend é responsável pela exibição otimizada, seguindo o design system do Google Stitch.

•	**Transformações On-the-Fly, As URLs são manipuladas para solicitar apenas o tamanho necessário:**
    •	Thumbnail de Evento: .../upload/w_500,c_fill,g_auto,f_auto/v1/image.jpg
    •	Avatar de Usuário: .../upload/w_200,h_200,c_thumb,g_face,r_max/v1/user.jpg

•	**Performance Mobile (Expo)**:
    •	Uso da biblioteca expo-image para cache agressivo no dispositivo.
    •	Implementação de Blurhash (exibição de um gradiente suave enquanto a imagem carrega), conforme o padrão de carregamento do Stitch.

•	**Dashboard Web (Vite):**
    •	Upload com Preview imediato antes da confirmação.
    •	Otimização automática para formatos modernos (WebP ou AVIF) via parâmetro f_auto.

### 🗄️ Esquema de Dados (PostgreSQL)

  **Tabela**  |     **Coluna**    |**Tipo**|  **Descrição**
--------------|-------------------|--------|---------------------------------------
users         | profile_photo_url |	 TEXT  |	URL da foto principal do usuário.
events        | thumbnail_url     |	 TEXT  |	Capa do evento (Banner principal).
event_images  | image_url         |	 TEXT  |    Galeria de fotos adicionais do evento.

________________________________________

## 🚨 Regras para Desenvolvedores

1.	Nunca faça download da imagem no backend para reenviar ao frontend. O frontend deve consumir a URL do Cloudinary diretamente (CDN).
2.	Sempre utilize o parâmetro q_auto (qualidade automática) nas URLs para economizar banda no plano gratuito.
3.	Fidelidade Stitch: O aspect-ratio das imagens no código deve ser idêntico ao definido no protótipo do Google Stitch para evitar distorções, mas com flexibilidade e **RESPONSIVIDADE** para diferentes tamanhos de tela. 

________________________________________

## Convenções de Nomenclatura e Estilo

- **Java:** Use `PascalCase` para Classes e Interfaces. Use `camelCase` para métodos e variáveis.
- **React Native / TypeScript:** Use `PascalCase` para componentes React e `camelCase` para funções, variáveis e instâncias de hooks.
- **Nomes de Arquivos:** Use `kebab-case` para arquivos não-componentes e `PascalCase` para arquivos de componentes UI.
- **Princípio DRY e SOLID:** Procure padrões repetidos e extraia a lógica comum para funções ou utilitários antes de criar códigos duplicados.

________________________________________

## Tratamento de Erros e Logs

- **Global:** Nunca "engula" erros silenciosamente.
- **Java:** Implemente um `@ControllerAdvice` para tratamento global de exceções. Gere logs estruturados contendo o contexto do erro.
- **React Native:** Envolva todas as chamadas de API em blocos `try/catch` e garanta que o usuário receba um feedback amigável na interface quando algo falhar.

________________________________________

## Testes

- Siga a abordagem de Test-Driven Development (TDD): crie os testes unitários antes de implementar a lógica.
- **Back-end:** Utilize JUnit e Mockito para testar isoladamente as regras de negócio nos `Services`.
- **Front-end:** Escreva testes para a lógica de componentes e hooks usando a React Native Testing Library.

________________________________________

## 🚫 Restrições Não-Negociáveis (Guardrails)

- **NUNCA** modifique, exponha ou registre em logs os arquivos de configuração sensíveis como `.env`, `application.properties` ou `application.yml`.
- É expressamente proibido escrever "one-liners mágicos" (linhas de código únicas e excessivamente complexas).
- Em caso de dúvida sobre a arquitetura ou se a alteração for muito intrusiva, **PARE** e peça minha aprovação ou esclarecimento antes de prosseguir.

