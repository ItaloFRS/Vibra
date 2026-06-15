# Specification: Implementar Dark Mode no App Mobile

## Overview
Esta trilha visa implementar o suporte a Dark Mode (Tema Escuro) no App Mobile (B2C) do projeto Vibra. A paleta de cores seguirá o mesmo padrão adotado no Dashboard do Produtor (família `stone` do Tailwind CSS). O usuário poderá alternar entre os temas Claro, Escuro e "Padrão do Sistema" através de um botão/seletor na aba de Perfil, e sua preferência será salva localmente no dispositivo.

## Functional Requirements
### 1. Seleção de Tema (Aba Perfil)
- Adicionar uma seção de configurações no Perfil do usuário.
- Incluir um botão ou seletor (segmented control) para definir o tema com três opções: "Claro", "Escuro" e "Sistema" (padrão).
- A mudança de tema deve refletir imediatamente em todo o aplicativo.

### 2. Persistência de Preferência
- Salvar a preferência escolhida pelo usuário utilizando o armazenamento seguro (`expo-secure-store`).
- Ao abrir o app, carregar a preferência e aplicar o tema correspondente (Claro, Escuro ou o do sistema se for a primeira vez).

### 3. Adaptação Visual
- Configurar o NativeWind/Tailwind do App Mobile para suportar variações "dark:".
- Aplicar a paleta `stone` do Tailwind para o modo escuro (ex: `dark:bg-stone-950` para fundos, `dark:text-stone-300` para textos), mantendo os contrastes e hierarquia visual consistentes com o Dashboard B2B.
- Atualizar os componentes e telas principais para garantir a renderização correta das cores no modo escuro e claro.

## Non-Functional Requirements
- **Performance:** A alternância de tema deve ser suave e aplicada globalmente através de um contexto (`ThemeContext`).
- **Acessibilidade:** Assegurar que as cores da paleta `stone` no modo escuro possuam contraste adequado para leitura.

## Out of Scope
- Sincronização do tema escolhido no App Mobile com o Backend (persistência apenas no dispositivo).
- Alterações estruturais ou de layout nas telas existentes.