# Specification: Cadastro e Perfil do Usuário (Mobile B2C)

## Overview
Implementação do fluxo completo de entrada de novos usuários e a gestão de suas informações pessoais. O objetivo é permitir que o usuário crie uma conta, defina suas preferências de Match e gerencie seu perfil com fidelidade ao design Stitch.

## Objetivos
1. **Fluxo de Cadastro:** Interface intuitiva para captura de dados (Nome, Email, Senha, Bio).
2. **Atribuição de Role:** Garantir que todo cadastro via mobile defina automaticamente a role `ROLE_USER`.
3. **Upload de Foto:** Integração com Cloudinary via Backend para foto de perfil.
4. **Perfil & Configurações:** Central de controle do usuário, incluindo edição de bio e visualização de tickets ativos.

## Telas do Stitch (Projeto 1836488892953926894)
- **Cadastro (Final)** – `625c521e467e4bc0b8c08b653eb66bb4`
- **Perfil e Configurações** – `7e04616232cb4943b633138edd26558b`

## Regras de Negócio
- O cadastro deve enviar para o backend o campo `role: "USER"`.
- As preferências de Match (JSONB) devem ser inicializadas ou permitidas na edição do perfil.
- Validação estrita de campos obrigatórios e formato de e-mail.

## Tech Stack
- **UI:** React Native (Expo) + NativeWind.
- **Forms:** React Hook Form + Zod para validações.
- **Imagens:** Expo Image Picker + API ImageService (Cloudinary).
