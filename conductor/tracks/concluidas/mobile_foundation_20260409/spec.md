# Specification: Fundação do App Mobile (B2C)

## Overview
Inicialização do ecossistema mobile do Vibra. O foco é estabelecer uma base sólida, performática e fiel ao design do Google Stitch, permitindo que as próximas tracks foquem em funcionalidades específicas (Match, Checkout).

## Tech Stack
- **Framework:** React Native + Expo (Managed Workflow).
- **Navegação:** Expo Router (File-based navigation).
- **Estilização:** NativeWind (Tailwind CSS v3/v4) + Design Tokens do Stitch.
- **Estado/Cache:** TanStack Query.
- **Storage:** Expo SecureStore para tokens JWT.
- **Icons:** Lucide React Native.

## Requirements

### 1. Design System (Stitch)
- Configuração de cores: Background (`#FFF4EF`), Orange (`#C86419`), Purple (`#6A37D4`).
- Tipografia: Plus Jakarta Sans (Google Fonts).
- Raio de borda e espaçamentos seguindo a regra "Editorial Energy".

### 2. Arquitetura de Navegação
- **Main Stack:** Grupos de rotas (auth) e (tabs).
- **Tabs Layout:** Home (Explorar), Match, Tickets (Wallet), Profile.
- **Auth Guard:** Redirecionamento automático para /login se não houver token.

### 3. Autenticação Mobile
- Integração com `POST /api/v1/auth/login`.
- Armazenamento seguro do token.
- Logout funcional limpando o SecureStore.

## Screens do Stitch (IDs)
- **Login Vibra:** 904fcd65ebe34c7e805bdba8d81f317e
- **Home - Explorar (Tema Laranja):** 366800ef83b445d595ec1b45a7b572da
