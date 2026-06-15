# Implementation Plan: Explore Filters, User Location, and Event Feed Refinements

## Phase 1: Real-Time User Location
- [x] Task: Create Unit Tests for the location fetching logic (e.g., mocking `expo-location` and reverse geocoding API).
- [x] Task: Implement a custom hook `useUserLocation` that requests permission, gets coords, and calls a reverse geocoding service to return City/State.
- [x] Task: Integrate `useUserLocation` into the `HomeScreen` (`index.tsx`) TopBar to replace the hardcoded "Campina Grande, PB".
- [x] Task: Conductor - User Manual Verification 'Phase 1: Real-Time User Location' (Protocol in workflow.md)

## Phase 2: Explore Categories Refinement
- [x] Task: Create Unit Tests for fetching and rendering categories in the Explore screen.
- [x] Task: Update the `ExploreScreen` to fetch categories from the backend (e.g., `/events/categories` or similar endpoint).
- [x] Task: Render the category chips dynamically based on the fetched data.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Explore Categories Refinement' (Protocol in workflow.md)

## Phase 3: Event Feed Tab Refinement
- [x] Task: Create Unit Tests for the new text truncation and 'Ver mais' logic in the Feed Tab.
- [x] Task: Refactor the Feed Tab layout (`apps/mobile/src/app/events/[id]/index.tsx` or its specific component) to match Stitch ID: `368076491ef243618e2b62942e4934b4`.
- [x] Task: Implement the "Sobre o evento" text truncation (max 4 lines) with the interactive 'Ver mais' button.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Event Feed Tab Refinement' (Protocol in workflow.md)
