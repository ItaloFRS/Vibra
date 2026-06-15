# Specification: Dashboard Admin (Web B2B)

## Overview
Implementação do painel administrativo para produtores de eventos, focado em gestão de eventos, análise de vendas (BI) e moderação de comunidade. O objetivo é fornecer uma interface "pixel-perfect" baseada no Google Stitch e integrada ao backend Spring Boot.

## Tech Stack
- **Frontend:** React + Vite, TypeScript (Strict Mode), Tailwind CSS, TanStack Query, Axios.
- **Backend:** Spring Boot (Módulo `admin`), Java 21.
- **Gráficos:** Recharts ou Chart.js.
- **Mídia:** Integração com Cloudinary para upload de banners.

## Requirements

### 1. Dashboard Principal (ID Stitch: 94730515fd6e4a7c97c3a72b5347cfad)
- Visão geral de métricas (Total de Vendas, Ingressos Vendidos, Taxa de Conversão).
- Gráfico de vendas ao longo do tempo.
- Atalhos para criação de novos eventos.

### 2. Meus Eventos (ID Stitch: 55c45e4ba2ef42eb8a4a8e9de0e3aac0)
- Listagem de eventos criados pelo produtor.
- Filtros por status (Ativo, Finalizado, Rascunho).
- Ações: Editar, Ver Dashboard Individual, Excluir.

### 3. Dashboard Individual do Evento (ID Stitch: cb09f5d82afa44969e029cb700bcdc8a)
- Métricas específicas do evento: Ingressos vendidos por lote, "Calor" do evento (Taxa de matches e mensagens).
- Controle de estoque de lotes.

### 4. Criar Novo Evento (ID Stitch: 8e30cfb88b574d5e9e21d3e491433485)
- Formulário multi-step ou integrado:
  - Informações Básicas (Título, Data, Local, Descrição).
  - Upload de Banner (Integração Cloudinary com preview).
  - Configuração de Lotes iniciais.
- Validação estrita de campos obrigatórios.

### 5. Gestão de Ingressos/Lotes
- CRUD de lotes (nome, preço, capacidade, datas).
- Visualização de progresso de cada lote.

## API Endpoints (Módulo Admin)
- `GET /api/v1/admin/dashboard/summary`: Métricas agregadas do produtor.
- `GET /api/v1/admin/events`: Lista eventos do produtor logado.
- `GET /api/v1/admin/events/{id}/stats`: Métricas detalhadas de um evento específico.
- `POST /api/v1/events`: (Reutilizar ou estender endpoint de criação de eventos).

## Validation & Security
- Acesso exclusivo para usuários com role `ROLE_PRODUCER`.
- Todos os endpoints devem ser protegidos por JWT.
- Fidelidade visual estrita ao protótipo do Stitch.
