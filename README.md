# Finance App

Projeto monorepo para controle financeiro com duas aplicações principais:

- `api/` — Backend em Node.js + TypeScript (Fastify, Drizzle ORM, Postgres).
- `web/` — Frontend em React + Vite + TypeScript.

## Funcionalidades (resumido)

- Autenticação e gerenciamento de usuários
- Gestão de contas e saldos
- Criação/edição de categorias
- Registro e listagem de transações
- Relatórios e métricas por período

## Requisitos

- Node.js 22+
- npm ou outro gerenciador (pnpm/yarn)
- Docker & Docker Compose (recomendado para Postgres)

## Tecnologias

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [Fastify](https://www.fastify.io/)
- [Drizzle ORM](https://orm.drizzle.team)
- [Vitest](https://vitest.dev/)
- [Docker](https://www.docker.com/)

## Estrutura do repositório

```
financial-control/
├── api/      # Backend (Fastify, Drizzle, migrations, seed, testes)
├── web/      # Frontend (React, Vite)
```

## Configuração rápida (desenvolvimento)

### Backend (API)

1. Instale as dependências:

```sh
cd api 
npm install
```

2. Configure as variáveis ambiente:

```sh
DATABASE_URL=
NODE_ENV=
JWT_SECRET=
COOKIE_NAME=
```

3. Rode o banco de dados com Docker:

```sh
docker-compose up -d
```

4. Execute as migrações do Drizzle:

```sh
npm run db:migrate
```

5. Popule o banco com exemplos (opcional):

```sh
npm run db:seed
```

### Frontend (web)

1. Instale as dependências:

```sh
cd web
npm install
```

2. Configure as variáveis ambiente:

```sh
VITE_API_URL=
```

## Executando o projeto

```sh
cd api
npm run dev
```

```sh
cd web
npm run dev
```

## Contribuição
Pull requests são bem-vindas! Siga as boas práticas de commit e mantenha o padrão de código.

## Licença
Está sob a licença MIT.
