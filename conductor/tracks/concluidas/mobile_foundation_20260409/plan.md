# Implementation Plan: Fundação do App Mobile

## Phase 1: Expo Setup & Configuration
- [x] **Task 1: Inicializar Projeto Expo**
  - Executar template básico com TypeScript.
  - Configurar estrutura de pastas em `apps/mobile`.
- [x] **Task 2: Configurar NativeWind & Tailwind**
  - Instalar dependências e configurar `tailwind.config.js` com Design Tokens.
- [x] **Task 3: Configurar Fontes (Plus Jakarta Sans)**
  - Instalar via Expo Google Fonts e garantir carregamento no `_layout.tsx`.

## Phase 2: Navegação & Estrutura
- [x] **Task 4: Implementar Main Stack & Tabs**
  - Criar grupos `(auth)` e `(tabs)`.
  - Configurar Bottom Tab Bar customizada seguindo o design do Stitch.
- [x] **Task 5: Auth Provider & Secure Storage**
  - Criar context de autenticação para gerenciar token JWT.
  - Implementar lógica de persistência.

## Phase 3: Telas Iniciais (UI)
- [x] **Task 6: Tela de Login (Stitch)**
  - Implementar interface visual e integração com API.
- [x] **Task 7: Skeleton da Home**
  - Estrutura base da Home para validação de navegação.

## Phase 4: Validação & Polish
- [x] **Task 8: Configuração de API (Axios)**
  - Interceptores para JWT.
- [x] **Task 9: Testes de Navegação**
  - Garantir que usuários não autenticados não acessam as tabs.
