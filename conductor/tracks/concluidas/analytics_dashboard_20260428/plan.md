# Plano de Implementação: Analytics Avançado no Dashboard do Produtor

## Phase 1: Backend - Repositórios e Consultas SQL
- [x] Task: Escrever testes de integração (TDD) no `UserRepository` ou criar um repositório focado em Analytics para validação demográfica (`getAverageAge`, `getGenderDistribution`).
- [x] Task: Escrever testes de integração para análise temporal de mensagens (`getPeakInteractionHours`) no `MessageRepository`.
- [x] Task: Implementar as consultas otimizadas utilizando agregação SQL (ex: `GROUP BY gender`, `EXTRACT(HOUR FROM created_at)`) para calcular métricas cruzando dados de acessos e perfis.
- [x] Task: Conductor - User Manual Verification 'Backend - Repositórios e Consultas SQL' (Protocol in workflow.md)

## Phase 2: Backend - Serviços e Controladores (API REST)
- [x] Task: Criar um `AnalyticsService` para processar e empacotar os resultados brutos do banco de dados em DTOs estruturados.
- [x] Task: Desenvolver e testar o `AdminAnalyticsController` expondo endpoints segmentados (`/demographics`, `/interactions`, `/conversions`) garantindo acesso exclusivo ao dono do evento (Role PRODUCER).
- [x] Task: Conductor - User Manual Verification 'Backend - Serviços e Controladores (API REST)' (Protocol in workflow.md)

## Phase 3: Frontend B2B - Componentização e Integração Recharts
- [x] Task: Instalar a biblioteca `recharts` no diretório `web-dashboard` e criar wrappers reutilizáveis (DonutChart para gênero, LineChart/BarChart para horários de pico e funis).
- [x] Task: Integrar serviços de API (`api.ts`) e hooks do React Query para disparar requisições assíncronas aos novos endpoints, implementando os devidos *Skeletons/Loaders* individuais.
- [x] Task: Incorporar os componentes finalizados na tela de detalhes/gestão do evento (`EventDashboardPage.tsx` ou equivalente), garantindo fidelidade aos tokens do Stitch.
- [x] Task: Conductor - User Manual Verification 'Frontend B2B - Componentização e Integração Recharts' (Protocol in workflow.md)