# Especificação: Telas de Onboarding (Value Proposition Slides)

## Visão Geral
Esta track abrange o desenvolvimento do fluxo de Onboarding inicial do aplicativo móvel (B2C). O objetivo é apresentar as principais vantagens (propostas de valor) do Vibra de forma imersiva antes do cadastro, reduzindo a fricção e engajando o usuário. A implementação será customizada utilizando `react-native-reanimated` para garantir alta fidelidade ao protótipo do Google Stitch.

## Requisitos Funcionais
1. **Carrossel de Slides Customizado:** Criar um componente de paginação horizontal (estilo pager) com controle fino de transições.
2. **Propostas de Valor (Slides):**
   - **Slide 1 - Descoberta de Eventos:** Destacar a facilidade de encontrar as melhores festas e eventos na região.
   - **Slide 2 - Networking & Match:** Apresentar a inteligência do Vibra Match e as conexões antes do evento.
   - **Slide 3 - Carteira Digital (Tickets):** Focar na praticidade e segurança da gestão unificada de ingressos.
3. **Navegação Rápida (Skip):** Incluir um botão "Pular" visível nos primeiros slides, permitindo que o usuário avance diretamente para as opções de autenticação.
4. **Call to Action (CTA):** Na última tela, substituir o botão "Próximo" por dois CTAs proeminentes: "Criar Conta" e "Entrar", que redirecionarão para os fluxos de `(auth)/register` e `(auth)/login` correspondentes.
5. **Integração de Mídia:** Utilizar vídeos curtos (looping) e/ou imagens estáticas localizadas no diretório `assets/Onboarding` como background ou elemento de destaque de cada slide, visando carregamento instantâneo.

## Requisitos Não Funcionais
- **Animações (UX):** Uso obrigatório da biblioteca `react-native-reanimated` para transições suaves, efeitos parallax e interpolação de cores, aderindo ao princípio "The Living Pulse" das diretrizes do produto.
- **Fidelidade Visual:** Respeitar tipografia (Plus Jakarta Sans), paleta de cores (Gradient Vibra) e ausência de linhas rígidas conforme o Design System "Editorial Energy".
- **Performance:** Otimizar o tamanho e a resolução dos assets locais em `assets/Onboarding` para não inflar excessivamente o bundle final do aplicativo.
- **Armazenamento:** O Onboarding só deve ser exibido na primeira vez que o usuário abre o aplicativo após a instalação (gerenciamento via `SecureStore` ou `AsyncStorage` simplificado).

## Critérios de Aceite
- [ ] O componente de Onboarding renderiza os 3 slides corretamente com suas respectivas mídias locais.
- [ ] A transição entre os slides é fluida (sem engasgos de renderização).
- [ ] O botão "Pular" e os CTAs finais direcionam com sucesso para as telas de autenticação do Expo Router.
- [ ] Se o usuário já visualizou o onboarding anteriormente (flag no storage local), o aplicativo pula esta etapa e vai direto para a home ou tela de login (dependendo do estado de autenticação).
- [ ] A cobertura de testes unitários para a lógica de paginação e persistência do estado "já visto" atinge >80%.