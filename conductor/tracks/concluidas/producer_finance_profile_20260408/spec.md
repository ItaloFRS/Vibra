# Specification: Hub Financeiro & Gestão de Perfil

## Overview
Implementação das camadas de gestão de negócio para o produtor. O foco é transparência financeira (lucro líquido e taxas) e gestão de identidade (perfil da produtora).

## Tech Stack
- **Frontend:** React + Vite (Tailwind v4), TanStack Query.
- **Backend:** Spring Boot (Módulo `admin` e `identity`).
- **Financeiro:** Integração lógica com o módulo de `tickets`.

## Requirements

### 1. Hub Financeiro
- **Dashboard de Saldo:** Saldo total, saldo disponível para saque e saldo a receber.
- **Extrato de Transações:** Lista detalhada de vendas, estornos e saques.
- **Cálculo de Taxas:** Visualização clara da taxa da plataforma (Ex: 10%) aplicada sobre cada venda.
- **Gráfico de Receita Líquida:** Comparativo entre receita bruta e líquida.

### 2. Perfil do Produtor
- **Dados Cadastrais:** Edição de Nome da Produtora, CPF/CNPJ, Email de contato.
- **Branding:** Upload de foto de perfil (Logo) e Banner da produtora.
- **Conta Bancária:** Configuração de chave PIX ou conta para recebimento de payouts.

### 3. Segurança do Painel
- Opção de alteração de senha.
- Logs de acesso do produtor.

## API Endpoints (Novos)
- `GET /api/v1/admin/finances/summary`: Saldo e métricas financeiras.
- `GET /api/v1/admin/finances/transactions`: Extrato paginado.
- `GET /api/v1/admin/profile`: Dados do perfil atual.
- `PATCH /api/v1/admin/profile`: Atualização de dados e imagens.

## Validation & Security
- Somente `ROLE_PRODUCER` pode acessar.
- Cálculos financeiros devem ser validados no backend via `@Transactional`.
