# Implementation Plan

## Phase 1: Setup do Ambiente e Estrutura de Banco de Dados
- [x] Task: Set up Spring Boot 3.x project with PostgreSQL drivers.
- [x] Task: Configure Docker Compose for local PostgreSQL 17 database.
- [x] Task: Write Flyway/Liquibase migration for `users` and `events` schemas.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup do Ambiente e Estrutura de Banco de Dados' (Protocol in workflow.md)

## Phase 2: Módulo Identity (com.vibra.identity)
- [x] Task: Write Unit Tests for User registration and Authentication flow (TDD).
- [x] Task: Implement `User` entity, repository, and custom JSONB logic.
- [x] Task: Configure Spring Security with Stateless JWT.
- [x] Task: Implement Auth REST Endpoints (Register/Login).
- [x] Task: Conductor - User Manual Verification 'Phase 2: Módulo Identity (com.vibra.identity)' (Protocol in workflow.md)

## Phase 3: Módulo Events (com.vibra.events)
- [x] Task: Write Unit Tests for Event creation (TDD).
- [x] Task: Implement `Event` entity with relationship to `User` (Producer).
- [x] Task: Implement REST Endpoints for creating and listing Events.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Módulo Events (com.vibra.events)' (Protocol in workflow.md)