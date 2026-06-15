# Track: Implementação do Motor de Match Contextual e Chat Real-time

## Objetivo
Criar a experiência de rede social do VIBRA, permitindo que usuários façam networking (swipe/match) vinculado a eventos e conversem em tempo real em canais de chat específicos para cada evento.

## Escopo e Requisitos
- **Match Contextual (com.vibra.social):** 
    - Implementar a tabela de Swipes (Likes/Nopes).
    - Lógica de Match (Intersecção de likes entre usuários no mesmo evento).
    - **Gatekeeper:** Regra que bloqueia o acesso à fila de Match para quem não favoritou ou comprou o ingresso do evento.
- **Chat Real-time (com.vibra.social):**
    - Configurar Servidor WebSocket com protocolo STOMP (SockJS).
    - Implementar canais de chat por `event_id`.
    - Persistência de mensagens no PostgreSQL.
- **Integração de Módulos:**
    - O módulo `social` deve consumir dados dos módulos `identity` e `events`.
- **Performance:** 
    - Uso de Virtual Threads do Java 21 para escalabilidade do chat.
