# � MFE Password - Sistema de Validação de Senhas

Uma aplicação de **Micro Frontends** para demonstrar autenticação e validação de senhas com arquitetura moderna e escalável.

## 🎯 **O que esta aplicação faz?**

Esta aplicação implementa um fluxo completo de autenticação e validação de senhas usando uma arquitetura de Micro Frontends:

### **1. Autenticação (Login)**

- **Acessa:** `http://localhost:4200/auth`
- **Funcionalidade:** Formulário de login com email e senha
- **Processo:** Gera token OAuth e armazena no localStorage

### **2. Validação de Senhas**

- **Acessa:** `http://localhost:4200/password`
- **Funcionalidade:** Valida senhas com regras complexas
- **Regras Validadas:**
  - ✅ Mínimo 9 caracteres
  - ✅ Pelo menos 1 dígito
  - ✅ Pelo menos 1 letra minúscula
  - ✅ Pelo menos 1 letra maiúscula
  - ✅ Pelo menos 1 caractere especial (`!@#$%^&*()-+`)
  - ✅ Sem caracteres repetidos

### **3. Arquitetura Micro Frontend**

A aplicação é dividida em três partes independentes que funcionam juntas:

```
┌─────────────────────────────────────────┐
│           SHELL (Porta 4200)            │
│        Aplicação Principal              │
│                                         │
│  ┌─────────────┐    ┌──────────────┐   │
│  │    AUTH     │    │   PASSWORD   │   │
│  │  (4202)     │    │   (4201)     │   │
│  │             │    │              │   │
│  │ • Login     │    │ • Validação  │   │
│  │ • Token     │    │ • Regras     │   │
│  │ • Storage   │    │ • Resultado  │   │
│  └─────────────┘    └──────────────┘   │
└─────────────────────────────────────────┘
```

## 🚀 **Como funciona na prática?**

### **Passo 1: Login**

1. Acesse `http://localhost:4200/auth`
2. Preencha o formulário (email: `exemplo@email.com`, senha: `123456`)
3. Clique em "Entrar"
4. Sistema gera token e salva no localStorage

### **Passo 2: Validação de Senha**

1. Na página `http://localhost:4200/password`
2. Digite uma senha no campo de texto
3. Clique em "Validar Senha"
4. Sistema envia para backend com token de autenticação
5. Retorna resultado: "Senha válida ✅" ou "Senha inválida ❌"

### **Passo 3: Funcionalidades Extras**

- **Mostrar/Ocultar senha:** Clique no ícone do olho
- **Exemplos rápidos:** Use os botões de exemplo para testar
- **Logout:** Remova o token e volte para o login

## 🔧 **Tecnologias Utilizadas**

- **Angular 19+** com Standalone Components
- **Module Federation** para Micro Frontends
- **Node.js** para backend services
- **OAuth 2.0** para autenticação
- **Tailwind CSS** para estilização

## 🏃‍♂️ **Como executar a aplicação**

### **Pré-requisitos**

- Node.js instalado
- Angular CLI instalado

### **Passo 1: Instalar dependências**

```bash
npm install
```

### **Passo 2: Build da library compartilhada**

```bash
ng build shared
```

### **Passo 3: Iniciar backend services**

```bash
# Terminal 1
cd backend/auth-service && node server.js

# Terminal 2
cd backend/password-service && node server.js
```

### **Passo 4: Iniciar frontend applications**

```bash
# Terminal 3
ng serve shell          # Porta 4200 (Aplicação principal)

# Terminal 4 (desenvolvimento isolado)
ng serve auth           # Porta 4202
ng serve password-validator  # Porta 4201
```

### **Passo 5: Acessar aplicação**

Abra seu navegador e acesse:

- **Aplicação completa:** `http://localhost:4200`
- **Login:** `http://localhost:4200/auth`
- **Validação:** `http://localhost:4200/password`

## 🧪 **Testes**

A aplicação possui 100% dos testes unitários funcionando:

```bash
# Testes do Auth Micro Frontend
ng test auth --watch=false        # 17/17 testes passando ✅

# Testes do Password Micro Frontend
ng test password-validator --watch=false  # 24/24 testes passando ✅

# Code coverage
ng test auth --code-coverage
```

## 📚 **Documentação Completa**

Para documentação técnica detalhada, incluindo arquitetura, configuração de Module Federation, guias de desenvolvimento e troubleshooting, consulte:

👉 **[DOCUMENTATION.md](./DOCUMENTATION.md)**

---

**Desenvolvido com Angular 19+ | Micro Frontends | Module Federation**
