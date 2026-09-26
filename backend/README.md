# @remora/backend

Backend NestJS do app-forms (Remora Pages). Recebe o briefing coletado pelo frontend, valida via `@remora/core` e persiste no PostgreSQL com Prisma.

## Setup rápido

```bash
# 1. Buildar o core (uma vez, para o backend consumir o dist)
cd ../core
npm install
npm run build

# 2. Instalar dependências do backend
cd ../backend
npm install

# 3. Configurar .env
cp .env.example .env
# ajustar DATABASE_URL

# 4. Gerar Prisma Client e rodar migração
npm run prisma:generate
npm run prisma:migrate -- --name init

# 5. Subir em dev
npm run start:dev
```

API sobe em `http://localhost:3333` por padrão.

## Endpoints

| Método | Rota                    | Descrição                          |
| ------ | ----------------------- | ---------------------------------- |
| POST   | `/briefing`             | Cria briefing (valida BriefingSchema) |
| GET    | `/briefing`             | Lista todos                        |
| GET    | `/briefing/:id`         | Recupera por id                    |
| PATCH  | `/briefing/:id/status`  | Atualiza status                    |

### Erros

- `400 BadRequest` (ValidationError) — corpo inválido, contém `issues[]` do Zod.
- `409 Conflict` — `meta.slugSubdominio` já cadastrado.
- `404 NotFound` — briefing inexistente.
- `500 InternalServerError` — falha inesperada.

## Contrato

Todo tipo e schema é importado de `@remora/core`. Nunca duplicar.
