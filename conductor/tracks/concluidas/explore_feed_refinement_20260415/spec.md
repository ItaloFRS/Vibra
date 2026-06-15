# Specification: Explore Filters, User Location, and Event Feed Refinements

## Overview
This track focuses on refining three key areas of the mobile application:
1.  **Explore Page Filters:** Enabling real category filtering by fetching available event creation categories from the backend API.
2.  **Home TopBar Location:** Displaying the user's real-time location (City and State, e.g., "Campina Grande - PB") using GPS coordinates and a reverse geocoding service.
3.  **Event Page Feed Tab:** Refining the layout to match the Google Stitch design (ID: `368076491ef243618e2b62942e4934b4`), specifically implementing a text truncation feature (max 4 lines) with a "Ver mais" (See more) button for the "Sobre o evento" (About the event) section.

## Functional Requirements
### 1. Explore Categories
*   The application must fetch the list of available categories from a backend API endpoint (e.g., `/events/categories`).
*   The category chips on the Explore screen must dynamically render based on this API response.
*   Selecting a category must filter the event search results accordingly.

### 2. User Location (Home TopBar)
*   The app must request location permissions from the user.
*   Upon permission grant, the app must obtain the user's current GPS coordinates using `expo-location`.
*   The app must use a reverse geocoding service to convert the coordinates into a localized City and State format (e.g., "City - ST").
*   The resolved location must be displayed in the TopBar of the Home screen.

### 3. Event Feed Tab Refinement
*   The layout of the Feed Tab within the Event Details page must strictly follow the specified Google Stitch design (`368076491ef243618e2b62942e4934b4`).
*   The "Sobre o evento" text description must be visually truncated to a maximum of 4 lines.
*   If the text exceeds 4 lines, a "Ver mais" button must be rendered below the text.
*   Clicking the "Ver mais" button must expand the text to its full height and change the button to "Ver menos" (or hide it).

## Non-Functional Requirements
*   **Performance:** Reverse geocoding calls should be cached or debounced to avoid excessive API usage.
*   **Fidelity:** The Feed Tab layout must be pixel-perfect relative to the Stitch design.
*   **Error Handling:** If location services fail or permission is denied, a fallback location or placeholder (e.g., "Localização não disponível") should be displayed.

## Out of Scope
*   Adding interactive features like comments, likes, or posts within the Feed Tab itself (only layout and basic info are in scope).
*   Creating the backend endpoint for categories (assuming it exists or will be provided).