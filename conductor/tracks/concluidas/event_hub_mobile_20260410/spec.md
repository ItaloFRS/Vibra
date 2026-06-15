# Specification: Hub do Evento (B2C)

## Overview
Implementação da experiência central do usuário no App Mobile. Ao clicar em um evento na Home, o usuário entra no "Hub do Evento", uma interface composta por 4 abas principais que gerenciam desde a compra até o networking e chat.

## Screens do Stitch (IDs de Referência)
1. **Detalhes do Evento (Aba Feed):** 368076491ef243618e2b62942e4934b4
2. **Compra de Ingressos (Aba Ingressos):** 113f583957814bbd9a5f12224fcd1fef
3. **Vibra Match (Aba Evento):** fa97fb1da3af4361a76ceaf60b8fe751
4. **Comunidade do Evento (Chat):** 2b87161ad41d474c8d873b04fccbe9c9
5. **Confirmação de Compra:** 52caca26753f48419e58781b3a2bff1f

## Functional Requirements

### 1. Aba Feed (Detalhes)
- Exibição de Banner, Descrição e Lineup dinâmico.
- Botão flutuante de favoritar sincronizado com a Home.

### 2. Aba Ingressos & Checkout
- Listagem de tipos de ingresso e lotes ativos.
- Integração com o fluxo de compra do backend.
- Exibição de modal/tela de sucesso com QR Code.

### 3. Aba Match (Contextual)
- Interface de Swipe (Like/Nope) entre usuários interessados no evento.
- Gatekeeper: Acesso liberado apenas se o usuário favoritou ou comprou o ingresso.

### 4. Aba Comunidade (Discord Style)
- Canais de chat (Geral, Transporte, VIP).
- Integração com WebSockets para mensagens em tempo real.

## Tech Stack
- **UI:** React Native (Expo) + NativeWind.
- **Real-time:** SockJS + StompJS.
- **Payments:** Integração com Mercado Pago SDK (via Backend).
