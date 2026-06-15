# Implementation Plan: Reformulação do Fluxo de Ingressos (Venda Externa e Importação)

## Phase 1: Atualização do Dashboard Produtor e DB
- [x] Task: Update Backend entity (`Event.java`) to include `externalTicketLink` (String). Add corresponding Flyway migration script.
- [x] Task: Write unit/integration tests for the updated Event APIs.
- [x] Task: Update Backend DTOs (`EventRequest`, `EventResponse`), `EventService`, and `EventController` to handle the new link.
- [x] Task: Write tests for the Web Dashboard's `CreateEventPage.tsx` changes.
- [x] Task: Update `CreateEventPage.tsx` to include an input for "Link Externo para Venda de Ingressos".
- [x] Task: Add visual blur/overlay and the message "Funcionalidade de vendas de ingressos está prevista para o terceiro trimestre de 2026" to the ticket batches section in `CreateEventPage.tsx`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Atualização do Dashboard Produtor e DB' (Protocol in workflow.md)

## Phase 2: Ajustes no Hub do Evento (App Mobile)
- [x] Task: Write tests for the new `EventHubScreen` Tickets Tab behavior (external link redirect).
- [x] Task: Update the `EventHubScreen` (`index.tsx`) to remove/hide the internal checkout process and selected tickets logic.
- [x] Task: Replace the ticket list in the Tickets Tab with a styled Button/Card that uses `Linking.openURL` to open the event's `externalTicketLink` in the default browser.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Ajustes no Hub do Evento (App Mobile)' (Protocol in workflow.md)

## Phase 3: Extração OCR e QR Code (Backend)
- [x] Task: Add dependencies to the Backend (`pom.xml`) for OCR (Tesseract), PDF processing (PDFBox), and QR Code decoding (ZXing).
- [x] Task: Write unit tests for the ticket extraction service using mock PDF and Image files.
- [x] Task: Create `TicketExtractionService.java` to handle MultipartFile uploads and orchestrate text/QR extraction.
- [x] Task: Implement the `POST /api/v1/tickets/extract` endpoint in a controller, returning a DTO with extracted data (QR String, Name, Date, Location, Type).
- [x] Task: Conductor - User Manual Verification 'Phase 3: Extração OCR e QR Code (Backend)' (Protocol in workflow.md)

## Phase 4: Carteira de Ingressos e Modo Offline (App Mobile)
- [x] Task: Write tests for local storage mechanisms (`AsyncStorage` / SQLite) and file system operations.
- [x] Task: Implement the UI for the "Meus Ingressos" screen allowing users to pick a document (PDF/Image) using `expo-document-picker` or `expo-image-picker`.
- [x] Task: Integrate the file upload to the new `/api/v1/tickets/extract` endpoint, displaying robust loading states.
- [x] Task: Implement local storage logic: save the returned extracted data and copy the selected file to `expo-file-system.documentDirectory`.
- [x] Task: Implement the UI to render the extracted data as a Ticket Card.
- [x] Task: Implement the local editing functionality allowing users to correct extracted data and save it locally.
- [x] Task: Implement the interaction to open the locally stored PDF/Image in full screen when the Ticket Card is pressed.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Carteira de Ingressos e Modo Offline (App Mobile)' (Protocol in workflow.md)