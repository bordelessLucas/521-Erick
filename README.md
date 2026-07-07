# 521 Erick — Monorepo

Projeto full-stack com app mobile (React Native) e sistema web (Next.js), partilhando **Firebase Auth** e **Firestore** (`erick-c7214`).

## Estrutura

```
521-Erick/
├── mobile/          # App React Native (Expo)
├── web/             # Sistema web (Next.js App Router)
├── shared/          # Tipos, config Firebase e mapeadores Firestore
└── firebase/        # Regras e índices do Firestore
```

### Camadas (ambos os projetos)

| Camada | Responsabilidade |
|--------|------------------|
| `domain/` | Entidades, interfaces de repositório, use cases, schemas Zod |
| `infrastructure/` | Implementações Firebase, injeção de dependências |
| `presentation/` | Componentes UI, telas/páginas |
| `core/` | Configurações, tema, utilitários |

## Firebase (`erick-c7214`)

Web e mobile ligam-se ao **mesmo projeto Firebase**:

- **Auth** — login por e-mail/palavra-passe
- **Firestore** — coleção `orders` com pedidos B2B partilhados

### 1. Consola Firebase

1. Abra [Firebase Console](https://console.firebase.google.com) → projeto **erick-c7214**
2. Active **Authentication** → método **E-mail/Palavra-passe**
3. Active **Firestore Database** (modo produção)
4. Crie um utilizador de teste (ex.: `cliente@empresa.com`)

### 2. Variáveis de ambiente

```bash
cp web/.env.example web/.env.local
cp mobile/.env.example mobile/.env
```

As credenciais do projeto já estão pré-preenchidas nos ficheiros `.example`.

### 3. Regras e índices Firestore

Com [Firebase CLI](https://firebase.google.com/docs/cli) instalado na raiz do monorepo:

```bash
firebase login
firebase deploy --only firestore
```

### 4. Popular pedidos de demonstração

Em `web/.env.local`, defina:

```
SEED_USER_EMAIL=cliente@empresa.com
SEED_USER_PASSWORD=sua-palavra-passe
```

Depois execute:

```bash
cd web
npm run seed:orders
```

Isto insere 8 pedidos na coleção `orders` (CNPJ demo: `12.345.678/0001-90`).

## Pré-requisitos

- Node.js 20+
- npm
- [Expo Go](https://expo.dev/go) (para testar o mobile)

## Executar

### Mobile

```bash
cd mobile
npm install
npm start
```

### Web

```bash
cd web
npm install
npm run dev
```

Aceda a [http://localhost:3000](http://localhost:3000).

Fluxo: **Login** → `/dashboard` (pedidos do Firestore) | Mobile: **Login** → **Ver pedidos**

## Scripts

| Projeto | Comando | Descrição |
|---------|---------|-----------|
| mobile | `npm start` | Inicia o Expo Dev Server |
| mobile | `npm run android` | Abre no emulador Android |
| web | `npm run dev` | Servidor de desenvolvimento |
| web | `npm run build` | Build de produção |
| web | `npm run seed:orders` | Insere pedidos demo no Firestore |
