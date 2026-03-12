# Aplicação na AWS

> Apesar de o deploy não ter sido realizado durante o teste, foi desenhada uma arquitetura serverless na AWS baseada em S3 e CloudFront, permitindo deploy independente dos microfrontends e otimização de custos seguindo princípios de FinOps.

Isso mostra **visão de arquitetura**, que normalmente é exatamente o que os avaliadores querem ver. 🚀

## 📌 Visão Geral

A aplicação foi desenvolvida utilizando arquitetura de **Micro Frontends** baseada em **Webpack Module Federation**, permitindo que diferentes partes da aplicação sejam desenvolvidas e implantadas de forma independente.

O sistema é composto por três aplicações principais:

- **Shell** – aplicação principal responsável pelo roteamento e carregamento dos micro frontends
- **Auth MFE** – micro frontend responsável pela autenticação
- **Password Validator MFE** – micro frontend responsável pela validação de senha

Cada aplicação é compilada separadamente e distribuída como **arquivos estáticos**, o que permite hospedagem em infraestrutura serverless com baixo custo operacional.

---

# 🏗 Arquitetura na AWS

A arquitetura proposta utiliza serviços serverless da **Amazon Web Services (AWS)** para garantir escalabilidade, alta disponibilidade e otimização de custos.

Serviços utilizados:

- **Amazon S3** – hospedagem dos arquivos estáticos da aplicação
- **Amazon CloudFront** – CDN para distribuição global
- **AWS IAM** – controle de acesso
- **AWS CodePipeline (opcional)** – pipeline de deploy automatizado

---

# 🧭 Arquitetura de Alto Nível

            Internet
                │
                ▼
         CloudFront CDN
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼

S3 Shell S3 Auth S3 Password
(host) (remote) (remote)

### Fluxo de execução

1. O usuário acessa a aplicação.
2. O **CloudFront** entrega o conteúdo do **Shell**.
3. O Shell carrega dinamicamente os microfrontends.
4. Os microfrontends são carregados através do arquivo **remoteEntry.js**.

---

# 📦 Processo de Build

Cada aplicação Angular gera arquivos estáticos utilizando os comandos abaixo:

```bash
ng build shell
ng build auth
ng build password-validator
```
