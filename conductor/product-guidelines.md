# Product Guidelines

Este documento define os princípios fundamentais de design, experiência do usuário (UX) e linguagem para a plataforma VIBRA, garantindo consistência através do App Mobile e do Dashboard Web.

## 1. Princípios de Experiência do Usuário (UX)
- **Fluidez (The Living Pulse):** A navegação deve ser intuitiva e orgânica, livre da rigidez tradicional. Transições de telas e micro-interações devem espelhar as micro-interações dos protótipos do Stitch.
- **Interação Física Segura:** Ações baseadas em sensores físicos (como o Match por inclinação) devem seguir uma lógica de confirmação em dois estágios (peek + retorno ao centro + confirmação) para evitar disparos acidentais.
- **Transacional com Alma Social:** Todo ponto de contato transacional (ex: carteira de ingressos, compra) deve ser uma ponte natural para o social (chat, match).
- **Acessibilidade:** Elementos visuais não devem depender puramente de cores para comunicar estados. Utilize o contraste elevado fornecido pela tipografia (Display-LG vs Label-MD).

## 2. Diretrizes de Design (UI)
As decisões de interface devem aderir estritamente ao Design System **"Editorial Energy"** documentado no projeto:
- **Ausência de Linhas Rígidas (The "No-Line" Rule):** É estritamente proibido utilizar bordas sólidas de 1px para delimitar seções. A separação deve ocorrer por Tonal Layering (fundos `surface` e `surface-container`) e espaçamento generoso.
- **Tipografia Plus Jakarta Sans:** Uso exclusivo dessa fonte com tracking (letter-spacing) de -2% em Display e Headlines para um visual denso e editorial.
- **Uso de Sombras e Profundidade:** Elementos flutuantes (como modals ou cartões de Match) devem usar *Ambient Shadows* (sombras com muito blur e baixa opacidade) ao invés de sombras negras fortes.
- **Componentes Assinatura:** Botões de CTA principais devem utilizar o Vibra Gradient (`#8B5CF6` a `#D946EF`) com bordas totalmente arredondadas (`Radius-XL`).

### Color Strategy
Our palette is anchored in a warm, cream-based neutrality, allowing the "Vibra Purple" and "Social Orange" to act as energetic light sources within the interface.

#### Tonal Tokens (Material Convention)
*   **Surface (Background):** `#FFF4EF` (A warm, inviting base that feels more premium than pure white).
*   **Primary (Social Orange):** `#C86419`
*   **Secundary (Vibra Purple):** `#6A37D4`
*   **Surface-Container-Low:** `#FBEFE5` (For secondary sections)
*   **Surface-Container-High:** `#EDE0D5` (For elevated content)

## 3. Voz e Tom (Copywriting)
- **Energético e Moderno:** A linguagem deve ser convidativa, jovem e clara, adequada a um público festeiro sem perder o tom profissional para os produtores (B2B).
- **Ação Direta:** Chamadas para ação (CTAs) devem ser verbos fortes e inspiradores (ex: "Desbravar Eventos", "Encontrar Meu Match").
- **Clareza Transacional:** Durante o checkout e pagamento, a linguagem deve se tornar objetiva e transparente, transmitindo máxima segurança.

## 4. Regras de Desenvolvimento (Fidelidade)
- **Pixel-Perfect e Responsividade:** Todo componente desenvolvido deve passar por uma inspeção visual comparativa com o protótipo do Google Stitch.
- **Gestão de Assets:** Imagens e ícones devem ser servidos e otimizados dinamicamente via Cloudinary, nunca adicionados cruamente no repositório.