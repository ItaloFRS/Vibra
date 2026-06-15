# Implementation Plan: Home Page (Landing Page) Vibra

## Phase 1: Setup and Infrastructure
- [x] Task: Create Next.js app
    - [x] Initialize Next.js project in `apps/web-home`.
    - [x] Configure Tailwind CSS.
    - [x] Install dependencies (Framer Motion, Remotion, Lucide React).
- [x] Task: Configure Design Tokens
    - [x] Extract and configure colors, typography, and spacing from Stitch into `tailwind.config.js`.
- [x] Task: Setup Layout Shell
    - [x] Create `RootLayout` with fonts and global styles.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup and Infrastructure' (Protocol in workflow.md)

## Phase 2: Core UI Components & Navbar
- [x] Task: Develop Navbar Component
    - [x] Implement responsive structure.
    - [x] Add transparent-to-solid scroll animation using Framer Motion.
    - [x] Write unit tests for Navbar rendering and state changes.
- [x] Task: Develop Global UI Elements
    - [x] Create standardized Buttons (Primary, Secondary, Outline).
    - [x] Create common Typography components.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core UI Components & Navbar' (Protocol in workflow.md)

## Phase 3: Section 1 - Hero & Entry Animation
- [x] Task: Entry Reveal Animation
    - [x] Implement initial white screen state.
    - [x] Build the logo expansion/reveal transition using Framer Motion.
- [x] Task: Hero Section Structure
    - [x] Set up 100vh layout with overlay.
    - [x] Add headline and CTA.
- [x] Task: Hero Video Background
    - [x] Integrate placeholder video.
    - [x] Set up Remotion/Framer Motion for slight parallax effect on scroll.
- [x] Task: Write tests for Hero section components.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Section 1 - Hero & Entry Animation' (Protocol in workflow.md)

## Phase 4: Section 2 - App CTA
- [x] Task: App CTA Section Layout
    - [x] Create structure for texts and dual device mockups.
- [x] Task: App CTA Animations
    - [x] Implement continuous floating animation for mockups.
    - [x] Add scroll reveal (fade + translateY) for section entry.
    - [x] Add hover micro-interactions to app store buttons.
- [x] Task: Write tests for App CTA section.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Section 2 - App CTA' (Protocol in workflow.md)

## Phase 5: Section 3 - Event Wallet (Remotion Intensive)
- [x] Task: Wallet Section Layout
    - [x] Implement title, description, and container for tickets.
- [x] Task: 3D Ticket Stacking Animation
    - [x] Create the ticket SVG/UI component.
    - [x] Implement scroll-driven logic using Framer Motion (Optimized for Web).
    - [x] Create the stack/unstack depth effect based on scroll position.
- [x] Task: Write tests for Wallet Section components.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Section 3 - Event Wallet (Remotion Intensive)' (Protocol in workflow.md)

## Phase 6: Section 4 - Event Carousel
- [x] Task: Carousel Structure
    - [x] Build Event Card component.
    - [x] Set up horizontal container for cards.
- [x] Task: Carousel Animation
    - [x] Implement smooth infinite horizontal loop (CSS/Framer Motion).
    - [x] Add hover state for cards (scale + depth/shadow).
- [x] Task: Write tests for Carousel components.
- [x] Task: Conductor - User Manual Verification 'Phase 6: Section 4 - Event Carousel' (Protocol in workflow.md)

## Phase 7: Final Review & Optimization
- [x] Task: Performance Optimization
    - [x] Ensure lazy loading for the Hero video.
    - [x] Optimize image assets (mockups, cards).
- [x] Task: Cross-browser & Responsiveness Check
    - [x] Verify layout on mobile, tablet, and desktop viewports.
- [x] Task: SEO setup
    - [x] Add basic meta tags and title.
- [x] Task: Conductor - User Manual Verification 'Phase 7: Final Review & Optimization' (Protocol in workflow.md)