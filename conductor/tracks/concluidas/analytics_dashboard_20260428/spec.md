# Especificação: Analytics Avançado no Dashboard do Produtor

## Visão Geral
Esta track tem como foco o refinamento do Dashboard do Produtor (App Web B2B), introduzindo visualizações detalhadas de dados do usuário. O objetivo é empoderar os produtores de eventos com insights estratégicos sobre demografia, engajamento na plataforma e conversões, utilizando bibliotecas gráficas modernas.

## Requisitos Funcionais
### 1. Frontend (Web Dashboard - React/Vite)
- **Visualização:** Integrar a biblioteca **Recharts** para renderizar gráficos responsivos e acessíveis no painel do evento.
- **Métricas Exibidas:**
  - **Demográficas:** Média de idade e distribuição por gênero (ex: Gráfico de Pizza/Donut).
  - **Comportamentais:** Mapa/volume de interações de chat e horários de pico (quando os usuários estão mais ativos no hub do evento).
  - **Conversão:** Volume de usuários atingidos e cliques no link de compra.
- **Carregamento Progressivo:** Os componentes de gráficos devem carregar seus dados de forma independente, utilizando *loaders* ou *skeletons* individuais, garantindo que o dashboard não fique travado esperando cálculos complexos.

### 2. Backend (Java 21/Spring Boot)
- **Arquitetura de API:** Desenvolver múltiplos endpoints assíncronos no módulo administrativo (ex: `com.vibra.admin`), segmentados por categoria de dados:
  - `GET /api/v1/admin/events/{eventId}/analytics/demographics` (Idade, Gênero)
  - `GET /api/v1/admin/events/{eventId}/analytics/interactions` (Picos, Volume de Mensagens)
  - `GET /api/v1/admin/events/{eventId}/analytics/conversions` (Cliques, Visualizações de Perfil)
- **Desempenho:** Utilizar agregações otimizadas (queries nativas ou JPQL eficientes) no PostgreSQL para calcular médias e volumes em tempo real ou através de tabelas pré-agregadas/materializadas, caso o volume exija.

## Critérios de Aceite
- [ ] O produtor pode acessar a aba de "Analytics/Relatórios" no painel de gestão do evento e visualizar dados concretos (mockados apenas se os dados reais forem insuficientes no ambiente de dev).
- [ ] Os gráficos (Recharts) renderizam corretamente as métricas de idade, gênero e horários de pico de interações.
- [ ] O carregamento da página do dashboard é fluído, com múltiplos endpoints servindo dados de forma granular e independente.
- [ ] O backend fornece dados agregados com segurança (acesso restrito apenas ao dono/PRODUCER do evento).