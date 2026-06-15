# Implementation Plan: Implementar Dark Mode no App Mobile

## Phase 1: Contexto e Persistência do Tema
- [ ] Task: Create `ThemeContext.tsx` to manage 'light', 'dark', and 'system' states, including saving and loading preferences using `expo-secure-store`. Write tests for the context provider.
- [ ] Task: Update the Root Layout (`_layout.tsx`) to wrap the app in the `ThemeProvider` and handle system theme changes via `Appearance`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Contexto e Persistência do Tema' (Protocol in workflow.md)

## Phase 2: Interface de Configuração (Perfil)
- [ ] Task: Update `profile.tsx` to include a UI control (e.g., segmented control or buttons) to select the theme (System, Light, Dark). Write UI tests for the new control.
- [ ] Task: Connect the new UI control in `profile.tsx` to the `ThemeContext` to trigger theme changes and verify persistence.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Interface de Configuração (Perfil)' (Protocol in workflow.md)

## Phase 3: Adaptação Visual e Paleta 'Stone'
- [ ] Task: Configure `tailwind.config.js` in the mobile app to support `darkMode: 'class'` or equivalent NativeWind configuration for toggleable themes.
- [ ] Task: Update global styles and primary layouts (`_layout.tsx`, navigation containers) to support dark mode classes (`dark:bg-stone-950`, `dark:text-stone-300`).
- [ ] Task: Systematically review and update core screens (Home/Explore, Tickets, Profile, Chat, Match) applying dark mode classes to texts, backgrounds, borders, and cards, mirroring the Dashboard B2B colors.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Adaptação Visual e Paleta 'Stone'' (Protocol in workflow.md)