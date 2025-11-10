# Finance App API

Backend em Node.js + TypeScript usando Fastify, Drizzle ORM e Postgres. Responsável pelos endpoints de contas, categorias, transações, autenticação e métricas.

## Funcionalidades

- Autenticação (JWT + cookies)
- CRUD de contas, categorias e transações
- Endpoints de métricas/relatórios
- Migrations e seed com Drizzle

## Requisitos

- Node.js 22+
- npm ou outro gerenciador (pnpm/yarn)
- Docker & Docker Compose (recomendado para Postgres em dev)

## Tecnologias

- [Fastify](https://www.fastify.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team)
- [Vitest](https://vitest.dev/)
- [Docker](https://www.docker.com/)

## Estrutura do Projeto

```
api/
├── src/
│   ├── database/       # Configurações de conexão, schemas e seed de dados
│   ├── middlewares/    # Middlewares customizados
│   ├── routes/         # Rotas da API
│   ├── utils/          # Utilitários
│   ├── error-handler.ts
│   ├── env.ts
│   └── server.ts       # Inicialização do servidor Fastify
├── docker-compose.yml  # Ambiente Docker
├── package.json        # Dependências e scripts
└── tsconfig.json       # Configuração TypeScript
```

## Configuração

1. Clone o repositório:

```sh
git clone https://github.com/carlos-hfc/financial-control.git
```

2. Instale as dependências:

```sh
cd api 
npm install
```

3. Configure as variáveis ambiente:

```sh
DATABASE_URL=
NODE_ENV=
JWT_SECRET=
COOKIE_NAME=
```

4. Rode o banco de dados com Docker:

```sh
docker-compose up -d
```

5. Execute as migrações do Drizzle:

```sh
npm run db:migrate
```

6. Popule o banco com exemplos (opcional):

```sh
npm run db:seed
```

## Executando o projeto

1. Inicie o servidor de desenvolvimento:

```sh
npm run dev
```

2. Acesse [http://localhost:3333](http://localhost:3333) no navegador

## Endpoints Principais

- `/categories` — Gerenciamento de categorias
- `/accounts` — Gerenciamento de contas
- `/transactions` — Gerenciamento de transações
- `/metrics` — Métricas e relatórios

## Scripts

- `npm run dev` — servidor em modo desenvolvimento (watch)
- `npm run db:generate` — `drizzle-kit generate` (gera artefatos)
- `npm run db:migrate` — `drizzle-kit migrate` (executa migrations)
- `npm run db:studio` — `drizzle-kit studio`
- `npm run db:seed` — executa seed: `node --env-file .env src/database/seed.ts`
- `npm run lint` — roda ESLint
- `npm run test` — executa testes com Vitest (`.env.test`)

## Contribuição
Pull requests são bem-vindas! Siga as boas práticas de commit e mantenha o padrão de código.

## Licença
Está sob a licença MIT.
