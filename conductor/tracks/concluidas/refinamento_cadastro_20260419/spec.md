# Especificação: Refinamento de Cadastro e Perfil

## Visão Geral
Esta track visa o aprimoramento do fluxo de onboarding de novos usuários no App Mobile (B2C) do Vibra. O objetivo é aumentar a segurança e a veracidade das informações com validações avançadas (CPF via API e E-mail com código numérico), fornecer uma alternativa de login via Google usando Firebase Authentication, e enriquecer o perfil do usuário para otimizar a experiência do "Match Contextual". O cadastro incluirá um formulário extra para coletar data de nascimento, gênero e "vibes", além das preferências de match.

## Requisitos Funcionais
1. **Validação de CPF:** Validar o CPF do usuário matematicamente e através de uma consulta a uma API externa para atestar a veracidade do documento no ato do cadastro.
2. **Senha Forte:** Implementar regras de validação para garantir senhas seguras (ex: mínimo 8 caracteres, contendo maiúsculas, minúsculas, números e caracteres especiais).
3. **Verificação de E-mail:** Implementar um fluxo de verificação onde o usuário recebe um código numérico de 6 dígitos no e-mail cadastrado e deve inseri-lo no app para ativar a conta.
4. **Autenticação com Google:** Integrar o Login com Google utilizando o Firebase Authentication como provedor de identidade. O backend do Vibra deverá validar o token do Firebase e emitir o JWT interno.
5. **Formulário de Perfil Extra:**
   - **Idade:** Seleção via DatePicker de Nascimento (backend calcula a idade).
   - **Identidade:** Seleção de gênero do usuário.
   - **Vibes:** Seleção através de tags pré-definidas (ex: Eletrônica, Sertanejo, etc).
   - **Preferências de Match:** Seleção de gênero desejado e configuração de uma faixa etária (Mínimo/Máximo).
6. **Edição de Perfil:** Permitir que as informações de preferências de Match (Faixa Etária, Gênero) e "Vibes" sejam editáveis a qualquer momento através da tela de Perfil e Configurações (Stitch id: 7e04616232cb4943b633138edd26558b).

## Requisitos Não-Funcionais
1. O fluxo de verificação de e-mail deve ter um tempo limite (ex: o código expira em 10 minutos).
2. As credenciais do Firebase e chaves de API externa não devem ser expostas no código cliente.
3. Fidelidade visual estrita às telas do protótipo no Stitch (Cadastro Final e Perfil).

## Critérios de Aceite
- [ ] O usuário não consegue finalizar o cadastro com um CPF inválido na API externa ou com uma senha que não atenda aos critérios mínimos.
- [ ] O usuário recebe o e-mail de verificação e consegue ativar sua conta inserindo o código correto.
- [ ] O login com o Google funciona corretamente, criando um novo perfil ou autenticando um já existente.
- [ ] O novo usuário preenche todos os campos extras (Nascimento, Gênero, Vibes, Match) e os dados são salvos com sucesso no backend (JSONB preferences).
- [ ] O usuário consegue acessar a tela de Perfil, alterar suas preferências de Match/Vibes, e as alterações são refletidas após o salvamento.