# Design System: Editorial Energy

## 1. Creative North Star: "The Living Pulse"
This design system moves away from the rigid, boxy constraints of traditional utility apps. Our Creative North Star is **"The Living Pulse"**—an aesthetic that mirrors the fluidity of music and the warmth of social connection. 

We achieve this through **Organic Editorialism**: 
- **Intentional Asymmetry:** Breaking the 12-column grid with overlapping elements and offset typography to create a sense of movement.
- **Layered Depth:** Replacing harsh lines with tonal shifts, creating a UI that feels like physical sheets of fine paper and frosted glass floating in a warm, ambient space.
- **High-Contrast Scale:** Using dramatic shifts between massive "Display" typography and tight, functional labels to guide the eye with authority.

---

## 2. Color Strategy
Our palette is anchored in a warm, cream-based neutrality, allowing the "Vibra Purple" and "Social Orange" to act as energetic light sources within the interface.

### Tonal Tokens (Material Convention)
*   **Surface (Background):** `#FFF4EF` (A warm, inviting base that feels more premium than pure white).
*   **Primary (Social Orange):** `#C86419`
*   **Secundary (Vibra Purple):** `#6A37D4`
*   **Surface-Container-Low:** `#FBEFE5` (For secondary sections)
*   **Surface-Container-High:** `#EDE0D5` (For elevated content)

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be established solely through:
1.  **Background Shifts:** Placing a `surface-container-low` card on a `surface` background.
2.  **Tonal Transitions:** Using the Spacing Scale to create "breathing room" that implies separation.

### Signature Textures & Glass
To inject "soul" into the UI, use the **Vibra Gradient** (`#8B5CF6` → `#D946EF`) for primary CTAs. For floating headers or navigation bars, apply **Glassmorphism**:
*   **Color:** `surface` at 70% opacity.
*   **Effect:** Backdrop-blur (20px).
*   **Border:** A "Ghost Border" (outline-variant at 15% opacity) to catch the light.

---

## 3. Typography: Plus Jakarta Sans
We utilize **Plus Jakarta Sans** for its geometric clarity and modern "tech-meets-lifestyle" feel.

| Role | Weight | Size | Usage |
| :--- | :--- | :--- | :--- |
| **Display-LG** | Bold | 3.5rem | Hero moments, high-impact event titles. |
| **Headline-MD** | SemiBold | 1.75rem | Section headers and card titles. |
| **Title-SM** | Medium | 1.0rem | Actionable labels and sub-headings. |
| **Body-LG** | Regular | 1.0rem | Standard reading text (1.6 line height). |
| **Label-MD** | Bold | 0.75rem | Metadata, tags, and micro-copy. |

*Note: Always use -2% letter spacing on Display and Headline styles to create a tighter, editorial "lockup."*

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often a crutch for poor layout. In this system, we use **Tonal Layering** first.

*   **The Layering Principle:** Stack `surface-container-lowest` cards on top of a `surface-container-low` background to create a "soft lift."
*   **Ambient Shadows:** When a true float is required (e.g., a "Match" modal), use the following:
    *   **Blur:** 40px to 60px.
    *   **Opacity:** 4%-6%.
    *   **Tint:** Use a dark version of the surface color (`#342E28`) instead of pure black to keep the shadow feeling "atmospheric."
*   **Ghost Borders:** For accessibility on white backgrounds, use `outline-variant` at 20% opacity. Never use 100% opaque borders.

---

## 5. Components

### Primary Buttons (The Action Pulse)
*   **Style:** Vibra Gradient background with `Radius-XL` (3rem).
*   **Interaction:** On hover, a subtle scale increase (1.02x) and an increase in shadow spread. 
*   **Typography:** Title-SM, white (`on-primary`).

### Event Cards (The Social Feed)
*   **Structure:** No borders. Use `surface-container-lowest` as the card base. 
*   **Radius:** `Radius-XL` (3rem) for the outer container; `Radius-MD` for internal images.
*   **Spacing:** Use `Spacing-5` (1.25rem) for internal padding to maintain a "high-end" airy feel.

### Match Chips
*   **Visuals:** Semi-transparent `secondary-container` backgrounds.
*   **Purpose:** Interest tags (e.g., "Techno," "Networking").
*   **Rule:** Forbid the use of dividers between chips. Use `Spacing-2` (0.5rem) horizontal gaps.

### The "Match" Input Field
*   **Style:** Minimalist. No bottom line or box. 
*   **Focus State:** The background shifts from `surface-container-low` to `surface-container-high` with a subtle glow in `primary-dim`.

---

## 6. Do’s and Don’ts

### ✅ Do
*   **Do** use asymmetrical margins (e.g., 24px left, 32px right) to create a rhythmic, editorial flow.
*   **Do** overlap elements (e.g., an event tag overlapping an image corner) to create depth.
*   **Do** prioritize white space over content density. If a screen feels "full," it’s wrong.
*   **Do** use the Spacing Scale religiously to ensure mathematical harmony.

### ❌ Don’t
*   **Don't** use 1px solid dividers or lines to separate content.
*   **Don't** use harsh, dark shadows or high-contrast borders.
*   **Don't** use standard "Material" or "Bootstrap" rounded corners. Only use `Radius-XL` for major containers.
*   **Don't** crowd typography. Plus Jakarta Sans needs "air" to look premium.
