# Track: Construir fluxo de criação e autenticação de usuarios e eventos.

## Objetivo
Implementar os módulos fundamentais do ecossistema: `identity` (para gestão e autenticação com JWT) e `events` (para criação do catálogo e CRUD básico de eventos).

## Escopo e Requisitos
- **Identity Module:** Gerenciamento de Usuários (User, Producer) e Autenticação (Stateless JWT).
- **Events Module:** Relacionamento entre Produtor e Evento. Cadastro e listagem simples de eventos.
- **Banco de Dados (PostgreSQL 17):** Estruturação das tabelas base (`users` e `events`).
- **Segurança:** Apenas usuários com `ROLE_PRODUCER` devem conseguir criar eventos.