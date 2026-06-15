# Plano de Implementação: Onboarding B2C (Value Proposition)

## Phase 1: Setup de Assets e Controle de Exibição
- [x] Task: Criar diretório `assets/Onboarding` e adicionar mídias placeholder (ou reais, se disponíveis) para os 3 slides.
- [x] Task: Escrever testes unitários (TDD) para o hook/serviço que gerenciará o estado `has_seen_onboarding` utilizando o Expo SecureStore.
- [x] Task: Implementar a lógica de leitura/gravação do estado `has_seen_onboarding` (ex: `useOnboarding.ts`).
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup de Assets e Controle de Exibição' (Protocol in workflow.md)

## Phase 2: Componentes Visuais (Reanimated)
- [x] Task: Escrever testes unitários (TDD) estruturais para os componentes visuais do Onboarding.
- [x] Task: Criar o componente `OnboardingSlide` utilizando `react-native-reanimated` para gerenciar interpolação de opacidade e scale baseados no offset do ScrollView.
- [x] Task: Criar o componente `PaginationDot` animado, refletindo a posição atual ativa na tela.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Componentes Visuais (Reanimated)' (Protocol in workflow.md)

## Phase 3: Integração e Roteamento
- [ ] Task: Atualizar os testes de integração do Expo Router para contemplar a injeção inicial da rota do Onboarding antes das abas e autenticação.
- [ ] Task: Construir a tela principal `OnboardingScreen` (`apps/mobile/src/app/onboarding.tsx` ou similar), importando os slides e orquestrando o `Animated.ScrollView`.
- [ ] Task: Implementar a funcionalidade do botão "Pular" e dos CTAs finais ("Criar Conta", "Entrar"), garantindo o roteamento correto para `(auth)/register` e `(auth)/login`, além da marcação de "visto" no Storage.
- [ ] Task: Alterar a lógica do layout raiz (`_layout.tsx`) para verificar a flag `has_seen_onboarding` e direcionar o usuário adequadamente na inicialização.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integração e Roteamento' (Protocol in workflow.md)