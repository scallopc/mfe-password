# 📚 Documentação - MFE Password

## 🏗️ **Arquitetura Micro Frontend**

### **Visão Geral**

Este projeto implementa uma arquitetura de Micro Frontends usando Angular e Module Federation, consistindo em três aplicações independentes que se comunicam através de uma biblioteca de serviços compartilhada.

### **Componentes da Arquitetura**

```
┌─────────────────────────────────────────────────────────────┐
│                    SHELL (Porta 4200)                       │
│                 Orquestrador Principal                      │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   Auth MFE      │    │      Password MFE               │ │
│  │   (Porta 4202)  │    │      (Porta 4201)               │ │
│  │                 │    │                                 │ │
│  │  - Login        │    │  - Validação de Senha           │ │
│  │  - Token Mgmt   │    │  - Regras Complexas              │ │
│  │  - localStorage │    │  - HTTP Interceptor              │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                           │                                 │
│                    ┌─────────────────────────────────┐    │
│                    │     Shared Library             │    │
│                    │   (Compartilhada entre MFEs)      │    │
│                    │                                 │    │
│                    │  - AuthService                   │    │
│                    │  - PasswordService               │    │
│                    │  - AuthInterceptor               │    │
│                    └─────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
    ┌─────────┐         ┌─────────────┐      ┌─────────────┐
    │ Auth    │         │ Password    │      │ Frontend    │
    │ Service │         │ Service     │      │ Applications│
    │(3000)   │         │(3002)       │      │             │
    └─────────┘         └─────────────┘      └─────────────┘
```

---

## 📁 **Estrutura de Arquivos**

```
mfe-password/
├── 📦 package.json
├── 📄 tsconfig.json
├── 📄 angular.json
├── 📁 dist/
│   └── 📁 services/ (build da library)
├── 📁 node_modules/
├── 📁 projects/
│   ├── 🏠 shell/ (Micro frontend principal)
│   │   ├── 📁 src/
│   │   │   ├── 📄 app.config.ts
│   │   │   └── 📄 app.routes.ts
│   │   └── 📄 webpack.config.js
│   ├── 🔐 auth/ (Micro frontend de autenticação)
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/
│   │   │   │   ├── 📄 app.config.ts
│   │   │   │   ├── 📄 app.routes.ts
│   │   │   │   └── 📁 auth-page/
│   │   │   │       ├── 📄 auth-page.component.ts
│   │   │   │       └── 📄 auth-page.component.html
│   │   │   └── 📄 main.ts
│   │   └── 📄 webpack.config.js
│   ├── 🔑 password-validator/ (Micro frontend de validação)
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/
│   │   │   │   ├── 📄 app.config.ts
│   │   │   │   ├── 📄 app.routes.ts
│   │   │   │   └── 📁 pages/
│   │   │   │       └── 📁 password/
│   │   │   │           ├── 📄 password-page.component.ts
│   │   │   │           └── 📄 password-page.component.html
│   │   │   └── 📄 main.ts
│   │   └── 📄 webpack.config.js
│   └── 📚 shared/ (Library compartilhada)
│       ├── 📁 src/
│       │   └── 📁 lib/
│       │       └── 📁 services/
│       │           ├── 📁 core/
│       │           └── 📁 interceptors/
│       │           │    └── 📄 auth.interceptor.ts
│       │           ├── 📁 auth/
│       │                ├── 📄 auth.service.ts
│       │           │    └── 📄 services.service.ts
│       │           └── 📁 password/
│       │                └── 📄 password.service.ts
│       └── 📄 public-api.ts
└── 📁 backend/
    ├── 📁 auth-service/
    │   └── 📄 server.js (Porta 3000)
    └── 📁 password-service/
        └── 📄 server.js (Porta 3002)
```

## 🔧 **Tecnologias e Frameworks**

### **Frontend Stack**

- **Angular 19+** com Standalone Components
- **Module Federation** para Micro Frontends
- **Tailwind CSS** para estilização

### **Backend Stack**

- **Node.js** com Express.js
- **CORS** configurado para cross-origin
- **OAuth 2.0** Client Credentials Flow

### **Testing Stack**

- **Jasmine** para testes unitários
- **Karma** como test runner
- **Angular Testing Utilities** para component testing

---

## 📦 **Estrutura de Projetos**

### **Shell Application** (`projects/shell/`)

**Responsabilidade:** Orquestrar os micro frontends e gerenciar rotas

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      loadRemoteModule({
        type: "module",
        remoteEntry: "http://localhost:4202/remoteEntry.js",
        exposedModule: "./Routes",
      }).then((m) => m.routes),
  },
  {
    path: "password",
    loadChildren: () =>
      loadRemoteModule({
        type: "module",
        remoteEntry: "http://localhost:4201/remoteEntry.js",
        exposedModule: "./Routes",
      }).then((m) => m.routes),
  },
];
```

**Configuração Module Federation:**

```typescript
// webpack.config.js
module.exports = {
  ...share({
    "@angular/core": { singleton: true, strictVersion: true },
    "@angular/common": { singleton: true, strictVersion: true },
    "@angular/router": { singleton: true, strictVersion: true },
    services: { singleton: true },
  }),
};
```

### **Auth Micro Frontend** (`projects/auth/`)

**Responsabilidade:** Gerenciar autenticação e login

**AuthPageComponent:**

```typescript
export class AuthPageComponent {
  email = "exemplo@email.com";
  password = "123456";
  loginSuccess = false;
  token = "";

  login() {
    this.simulateAuthCall().subscribe({
      next: (res: TokenResponse) => {
        localStorage.setItem("access_token", res.access_token);
        this.token = res.access_token;
        this.loginSuccess = true;
      },
      error: (err: any) => {
        console.error("Erro na autenticação:", err);
        this.loginSuccess = false;
      },
    });
  }
}
```

### **Password Validator Micro Frontend** (`projects/password-validator/`)

**Responsabilidade:** Validar senhas

**PasswordPageComponent:**

```typescript
export class PasswordPageComponent {
  password = "";
  result: string | null = null;
  loading = false;
  showPassword = false;

  validatePassword() {
    this.loading = true;
    this.passwordService.validatePassword(this.password).subscribe({
      next: (response: PasswordValidationResponse) => {
        this.result = response.valid ? "Senha válida ✅" : "Senha inválida ❌";
        this.loading = false;
      },
      error: (err) => {
        this.result = "Erro na validação";
        this.loading = false;
      },
    });
  }
}
```

---

## 📚 **Services Library**

### **AuthService**

```typescript
@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  getToken(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>("http://localhost:3000/oauth/token", {
      client_id: "frontend",
      client_secret: "123",
      grant_type: "client_credentials",
    });
  }
}
```

### **PasswordService**

```typescript
@Injectable({ providedIn: "root" })
export class PasswordService {
  constructor(private http: HttpClient) {}

  validatePassword(password: string): Observable<PasswordValidationResponse> {
    return this.http.post<PasswordValidationResponse>("http://localhost:3002/validate-password", { password });
  }
}
```

### **AuthInterceptor**

```typescript
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes("/oauth/token")) {
    return next(req);
  }

  const token = localStorage.getItem("access_token");

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    return next(authReq);
  }

  return next(req);
};
```

---

## 🖥️ **Backend Services**

### **Auth Service** (Porta 3000)

```javascript
// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:4201", "http://localhost:4202"],
  }),
);

app.post("/oauth/token", (req, res) => {
  const { client_id, client_secret, grant_type } = req.body;

  if (client_id === "frontend" && client_secret === "123") {
    res.json({
      access_token: "mocked-token-123",
      token_type: "Bearer",
      expires_in: 3600,
    });
  } else {
    res.status(401).json({ error: "invalid_client" });
  }
});

app.listen(3000, () => {
  console.log("Auth Service running on port 3000");
});
```

### **Password Service** (Porta 3002)

```javascript
// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:4201", "http://localhost:4202"],
  }),
);

function validatePasswordRules(password) {
  const rules = [
    { test: (pwd) => pwd.length >= 9, message: "Mínimo 9 caracteres" },
    { test: (pwd) => /\d/.test(pwd), message: "Pelo menos 1 dígito" },
    { test: (pwd) => /[a-z]/.test(pwd), message: "Pelo menos 1 letra minúscula" },
    { test: (pwd) => /[A-Z]/.test(pwd), message: "Pelo menos 1 letra maiúscula" },
    { test: (pwd) => /[!@#$%^&*()-+]/.test(pwd), message: "Pelo menos 1 caractere especial" },
    { test: (pwd) => !/(.)\1{2,}/.test(pwd), message: "Sem caracteres repetidos" },
  ];

  for (const rule of rules) {
    if (!rule.test(password)) {
      return { valid: false, message: rule.message };
    }
  }

  return { valid: true };
}

app.post("/validate-password", (req, res) => {
  const { password } = req.body;
  const result = validatePasswordRules(password);
  res.json(result);
});

app.listen(3002, () => {
  console.log("Password Service running on port 3002");
});
```

---

## 🔄 **Fluxo de Comunicação**

### **1. Fluxo de Autenticação**

```
1. User acessa http://localhost:4200/auth
2. Shell carrega Auth MFE (porta 4202)
3. User preenche formulário de login
4. AuthPageComponent chama AuthService.getToken()
5. AuthService faz POST para http://localhost:3000/oauth/token
6. Backend retorna token "mocked-token-123"
7. Token armazenado no localStorage
```

### **2. Fluxo de Validação de Senha**

```
1. User acessa http://localhost:4200/password
2. Shell carrega Password MFE (porta 4201)
3. User digita senha e clica em validar
4. PasswordPageComponent chama PasswordService.validatePassword()
5. Request enviada para http://localhost:3002/validate-password
6. Backend valida token e aplica regras de senha
7. Resultado exibido para o usuário
```

---

## 🧪 **Estratégia de Testes**

### **Testes Unitários - Auth MFE**

```typescript
describe("AuthPageComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AuthPageComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    });
  });

  it("should save token to localStorage on successful login", () => {
    spyOn(component, "simulateAuthCall").and.returnValue(of(mockTokenResponse));

    component.login();
    fixture.detectChanges();

    expect(localStorageSpy.setItem).toHaveBeenCalledWith("access_token", mockTokenResponse.access_token);
  });
});
```

### **Testes Unitários - Password MFE**

```typescript
describe("PasswordPageComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, PasswordPageComponent],
      providers: [provideHttpClient(withInterceptors([AuthInterceptor])), PasswordService],
    });
  });

  it("should validate password successfully", () => {
    spyOn(passwordService, "validatePassword").and.returnValue(of({ valid: true }));

    component.validatePassword();
    fixture.detectChanges();

    expect(component.result).toBe("Senha válida ✅");
  });
});
```

---

## 🚀 **Guia de Desenvolvimento**

### **Setup do Ambiente**

```bash
# Clonar projeto
git clone <repository-url>
cd mfe-password

# Instalar dependências
npm install

# Build da library shared
ng build shared

# Iniciar backend services
cd backend/auth-service && node server.js &
cd backend/password-service && node server.js &

# Iniciar frontend applications
ng serve shell &          # Porta 4200
ng serve auth &           # Porta 4202
ng serve password-validator &  # Porta 4201
```

### **Comandos Úteis**

```bash
# Executar testes
ng test auth --watch=false        # 17/17 testes
ng test password-validator --watch=false  # 24/24 testes

# Build para produção
ng build shell --prod
ng build auth --prod
ng build password-validator --prod

# Code coverage
ng test auth --code-coverage
ng test password-validator --code-coverage

# Watch mode para desenvolvimento
ng build shared --watch
```

---

## 🔧 **Configuração de Module Federation**

### **webpack.config.js - Shell**

```typescript
const ModuleFederationPlugin = require("@angular-architects/module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        auth: "auth@http://localhost:4202/remoteEntry.js",
        password: "password@http://localhost:4201/remoteEntry.js",
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        services: { singleton: true },
      },
    }),
  ],
};
```

### **webpack.config.js - Auth MFE**

```typescript
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        "./Routes": "./src/app/routes.ts",
        "./AuthPageComponent": "./src/app/auth-page/auth-page.component.ts",
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        services: { singleton: true },
      },
    }),
  ],
};
```

---

## 📊 **Métricas e Performance**

### **Test Coverage**

- **Auth MFE:** 17/17 testes passando (100%)
- **Password MFE:** 24/24 testes passando (100%)
- **Services Library:** Cobertura total de serviços

### **Performance**

- **Lazy Loading:** Micro frontends carregados sob demanda
- **Shared Dependencies:** Redução de bundle size através de shared modules
- **HTTP Interceptors:** Cache e otimização de requests

---

## 🐛 **Troubleshooting Comum**

### **Problemas de Module Federation**

```bash
# Limpar cache
npm run clean
rm -rf dist node_modules/.cache

# Rebuild shared
ng build shared

# Verificar portas
netstat -ano | findstr :420
```

### **Problemas de CORS**

```javascript
// Verificar configuração CORS no backend
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:4201", "http://localhost:4202"],
    credentials: true,
  }),
);
```

### **Problemas de Injeção de Dependência**

```typescript
// Garantir providedIn: 'root' nos serviços
@Injectable({ providedIn: "root" })
export class AuthService {
  // ...
}
```

---

## 🔄 **Ciclo de Vida do Desenvolvimento**

### **1. Development**

- Micro frontends desenvolvidos independentemente
- Services library versionada e compartilhada
- Testes executados localmente

### **2. Integration**

- Shell orquestra a integração dos MFEs
- Module Federation gerencia dependências compartilhadas
- Testes E2E validam fluxos completos

### **3. Deployment**

- Cada MFE deployado independentemente
- Shell atualizado para apontar para novas versões
- Rollback possível por MFE individual

---

_Documentação atualizada: 12/03/2026_
