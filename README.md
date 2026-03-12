# 🔐 MFE Password - Sistema de Validação de Senhas

Uma aplicação de **Micro Frontends** que demonstra autenticação OAuth e validação de senhas com arquitetura moderna e escalável.

## 🎯 **Resumo da Aplicação**

Este projeto implementa um sistema completo de autenticação e validação de senhas dividido em micro frontends independentes:

- **🔐 Autenticação:** Login com OAuth 2.0 e geração de tokens
- **🔑 Validação:** Sistema complexo de validação de senhas com múltiplas regras
- **🏗️ Micro Frontends:** Arquitetura escalável com Module Federation
- **🧪 Testes:** 100% de cobertura (41/41 testes passando)

## 📁 **Estrutura de Pastas**

```
├── 📁 backend/                   # Serviços backend (Node.js)
│   ├── 📁 auth-service/          # Serviço OAuth (porta 3000)
│   └── 📁 password-service/      # Serviço validação (porta 3002)
│
├── 📁 mfe-password/                 # Aplicações frontend (Angular)
     └── 📁 projects/
        ├── 📁 shell/                # Aplicação principal (porta 4200)
        ├── 📁 auth/                 # Micro frontend login (porta 4202)
        ├── 📁 password-validator/   # Micro frontend validação (porta 4201)
        └── 📁 shared/               # Biblioteca compartilhada


```

## 🚀 **Como Acessar Cada Pasta**

### **Backend Services** (Node.js + Express)

```bash
# Acessar pasta do backend
cd backend

# Iniciar serviço de autenticação (porta 3000)
cd auth-service
node server.js

# Iniciar serviço de validação (porta 3002)
cd password-service
node server.js
```

**O que cada serviço faz:**

- **auth-service:** Gera tokens OAuth com client credentials
- **password-service:** Valida senhas com regras complexas (mínimo 9 chars, números, maiúsculas, etc.)

### **Frontend Applications** (Angular + Module Federation)

```bash
# Acessar pasta principal do projeto
cd mfe-password

# Instalar dependências
npm install

# Build da library compartilhada
ng build shared

# Iniciar Shell - Aplicação principal (porta 4200)
ng serve shell

# Iniciar Auth Micro Frontend (porta 4202)
ng serve auth

# Iniciar Password Micro Frontend (porta 4201)
ng serve password-validator
```

**O que cada aplicação faz:**

- **shell:** Orquestrador principal que gerencia os micro frontends
- **auth:** Formulário de login e geração de tokens
- **password-validator:** Interface de validação de senhas
- **shared:** Biblioteca compartilhada com serviços e interceptors

## 🌐 **Como Acessar a Aplicação**

Após iniciar todos os serviços:

1. **Aplicação Principal:** `http://localhost:4200`
2. **Página de Login:** `http://localhost:4200/auth`
3. **Validação de Senha:** `http://localhost:4200/password`

## 🔄 **Fluxo de Uso**

1. **Login:** Acesse `/auth` → Faça login → Token salvo no localStorage
2. **Password:** Digite senha → Validação via backend → Sistema exibe "Senha válida ✅" ou "Senha inválida ❌"

## 🧪 **Executar Testes**

```bash
# Testes do Auth Micro Frontend (17/17 passando ✅)
ng test auth --watch=false

# Testes do Password Micro Frontend (24/24 passando ✅)
ng test password-validator --watch=false

# Code coverage
ng test auth --code-coverage
```

## 📚 **Documentação Completa**

Para documentação técnica detalhada, incluindo:

- 🏗️ Arquitetura completa
- 🔧 Configuração de Module Federation
- 📋 Guia de desenvolvimento

Acesse: **[mfe-password/DOCUMENTATION.md](./mfe-password/DOCUMENTATION.md)**

---

**Desenvolvido com Angular 19+ | Micro Frontends | Module Federation | OAuth 2.0**
