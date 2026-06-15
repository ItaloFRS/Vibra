# Implementation Plan: Social Motor & Chat

## Phase 1: Banco de Dados e Módulo Social (com.vibra.social)
- [x] Task: Write Flyway migration for `swipes`, `matches` and `messages` tables.
- [x] Task: Implement `Swipe` and `Match` entities with relationship to `User` and `Event`.
- [x] Task: Implement `Message` entity for chat persistence.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Social Schema' (Protocol in workflow.md)

## Phase 2: Motor de Match e Gatekeeper
- [x] Task: Write Unit Tests for Swipe and Match logic (TDD).
- [x] Task: Implement `SwipeService` for recording likes/nopes.
- [x] Task: Implement `MatchService` for identifying mutual likes in the same event.
- [x] Task: Implement the **Gatekeeper Logic** (Verify Interest/Ticket before Swipe).
- [x] Task: Implement REST Endpoints for Swiping and Listing Matches.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Match Engine' (Protocol in workflow.md)

## Phase 3: Chat Real-time (WebSockets)
- [x] Task: Write Unit Tests for WebSocket Message Broadcasting.
- [x] Task: Configure Spring WebSocket with STOMP and SockJS.
- [x] Task: Implement `ChatController` for handling message mapping.
- [x] Task: Implement `MessageService` for persisting and retrieving chat history.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Real-time Chat' (Protocol in workflow.md)
