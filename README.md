# Forestfy Web

Plataforma full stack para classificação e segmentação de espécies florestais com apoio de modelos de Machine Learning.

## Visão Geral

O projeto é composto por:

- **Frontend**: aplicação web com Next.js para autenticação, dashboard, classificação, segmentação e catálogo.
- **Backend**: API REST em FastAPI com autenticação JWT, persistência em PostgreSQL e integração com MinIO (S3 compatível).
- **Infra local**: orquestração com Docker Compose (frontend, backend, banco, pgAdmin e MinIO).

## Tecnologias Utilizadas

### Frontend

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- TanStack React Query
- React Hook Form + Zod
- Radix UI + Shadcn UI
- GSAP / Motion
- ESLint

### Backend

- FastAPI
- SQLAlchemy 2 (async)
- PostgreSQL + asyncpg
- Pydantic / pydantic-settings
- OAuth2PasswordRequestForm + JWT (python-jose)
- Passlib/Bcrypt
- ONNX Runtime
- Pillow + OpenCV
- Boto3 (S3/MinIO)
- Uvicorn

### Infraestrutura e serviços

- Docker / Docker Compose
- PostgreSQL 15
- pgAdmin 4
- MinIO

## Principais Funcionalidades

- Cadastro, login, logout e sessão por cookie HTTP-only.
- Dashboard com métricas de uso:
  - total de classificações
  - total de espécies identificadas
  - acurácia média
- Classificação de imagens com top-k predições via modelo ONNX.
- Histórico de classificações por usuário.
- Segmentação interativa de imagem por pontos.
- Catálogo de espécies com paginação.
- CRUD de espécies (fluxos administrativos).
- Gestão de imagens de espécies (upload, listagem, remoção e imagens primárias).
- Upload de imagem de perfil do usuário.

## Estrutura do Projeto

```text
forestfy_web/
├── docker-compose.yaml
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── db/
│   │   └── core/
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/
    ├── app/
    ├── components/
    ├── hooks/
    ├── utils/
    ├── package.json
    └── Dockerfile
```

## Rotas do Frontend

> Rotas protegidas por autenticação via `middleware.ts` (quando não autenticado, redireciona para `/auth/login`).

- `/` (landing/home)
- `/auth/login`
- `/auth/register`
- `/dashboard`
- `/classification`
- `/classification/results/[id]`
- `/segmentation`
- `/catalog`
- `/catalog/[id]`
- `/history`
- `/settings`

## Rotas da API (Backend)

Base URL local: `http://localhost:8000`

Prefixo da API: `/api/v1`

### Saúde

- `GET /health`

### Autenticação (`/api/v1/auth`)

- `POST /register` — criar usuário
- `POST /login` — autenticar usuário
- `POST /logout` — encerrar sessão
- `GET /me` — dados do usuário logado

### Usuários (`/api/v1/users`)

- `GET /{user_id}/activities` — atividades recentes do usuário autenticado
- `POST /profile-image` — atualizar imagem de perfil

### Dashboard (`/api/v1/dashboard`)

- `GET /metrics` — métricas do dashboard

### Classificações (`/api/v1/classifications`)

- `GET /` — listar classificações do usuário
- `GET /{classification_id}` — obter classificação por ID
- `POST /` — classificar imagem

### Segmentação (`/api/v1/segment`)

- `POST /` — segmentar imagem com pontos

### Catálogo (`/api/v1/catalog`)

- `GET /species` — catálogo paginado de espécies

### Espécies (`/api/v1/species`)

- `GET /` — listar espécies
- `GET /{species_id}` — detalhar espécie
- `POST /` — criar espécie (**admin**)
- `PUT /{species_id}` — atualizar espécie (**admin**)
- `DELETE /{species_id}` — remover espécie (**admin**)
- `GET /{species_id}/popular-names` — listar nomes populares
- `POST /{species_id}/popular-names` — criar nome popular (**admin**)
- `PUT /{species_id}/popular-names/{popular_name_id}` — atualizar nome popular (**admin**)
- `DELETE /{species_id}/popular-names/{popular_name_id}` — remover nome popular (**admin**)

### Imagens de espécies (`/api/v1/species`)

- `POST /{species_id}/images` — upload de imagem (**admin**)
- `GET /{species_id}/images` — listar imagens da espécie
- `DELETE /{species_id}/images/{image_id}` — remover imagem (**admin**)
- `POST /images/primary` — retornar imagens primárias por lista de espécies

## Como Executar com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Subir ambiente

```bash
docker compose up --build
```

Serviços disponíveis:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Docs da API (Swagger): `http://localhost:8000/docs`
- pgAdmin: `http://localhost:5050`
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`

## Variáveis e Configuração

O `docker-compose.yaml` já define as variáveis principais do backend, incluindo:

- `DATABASE_URL`
- `SECRET_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`
- `AWS_S3_ENDPOINT_URL`
- `NEXT_PUBLIC_API_URL` (frontend)

## Observações

- O backend usa prefixo padrão `/api/v1` para as rotas versionadas.
- O endpoint `/health` fica fora do prefixo para checagem rápida de disponibilidade.
- A autenticação no frontend depende do cookie `access_token` definido no login.
