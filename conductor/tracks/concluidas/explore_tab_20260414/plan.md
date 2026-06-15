# Implementation Plan: Aba Explorar e Refatoração da Home

## Phase 1: Ajuste de Navegação e Home
- [x] Task: Create Unit Tests for the new Tab structure and Home screen changes (TDD).
- [x] Task: Create the new empty screen `explore.tsx` inside `apps/mobile/src/app/(tabs)`.
- [x] Task: Update the bottom tab navigator (`_layout.tsx` inside `(tabs)`) to include the "Explorar" tab right after "Home".
- [x] Task: Refactor the Home screen (`index.tsx` ou similar) to remove the "Próximos Eventos" list, leaving only the featured/sponsored events carousel.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Ajuste de Navegação e Home' (Protocol in workflow.md)

## Phase 2: Implementação da Busca (Explorar)
- [x] Task: Create Unit Tests for the search input component and debouncing logic.
- [x] Task: Create the Search Bar component in `apps/mobile/src/components/`.
- [x] Task: Implement the filter UI (Category, Date, Location) based on Stitch design.
- [x] Task: Integrate the UI with a custom React Hook (e.g., `useEventSearch`) that utilizes TanStack Query with debounce for API calls.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Implementação da Busca (Explorar)' (Protocol in workflow.md)

## Phase 3: Listagem de Resultados
- [x] Task: Create Unit Tests for the Event List rendering based on search results.
- [x] Task: Implement the Event Card component according to Stitch "Próximos Eventos" fidelity.
- [x] Task: Render the list of events in the "Explorar" tab based on the API response, handling empty states and loading states.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Listagem de Resultados' (Protocol in workflow.md)