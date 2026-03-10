# Forestfy API - Backend

> Documentação do backend da aplicação Forestfy (FastAPI)

## Visão geral

Backend desenvolvido com FastAPI, SQLAlchemy (async) e Pydantic. Fornece autenticação por JWT (cookie), endpoints para gerenciamento de espécies, imagens e execução de classificações de imagens usando um modelo ONNX.

## Executando localmente

- Crie e ative o ambiente virtual

```bash
python -m venv .venv
source .venv/Scripts/activate
```

- Instale dependências

```bash
pip install -r requirements.txt
```

- Variáveis de ambiente importantes

- `DATABASE_URL` - URL do banco de dados (ex: `postgresql+asyncpg://user:pass@localhost/db`)
- `SECRET_KEY` - chave secreta para geração de JWT

- Inicie o servidor

```bash
uvicorn app.core.config:app --reload --port 8000
```

O aplicativo cria as tabelas automaticamente ao iniciar (veja `app/core/config.py`).

## Arquitetura e arquivos principais

- Entrypoint: `app/core/config.py` (instancia `app: FastAPI`)
- Rotas: organizadas em `app/controllers/*`
- Models (ORM): `app/db/models.py`
- Schemas (Pydantic): `app/schemas/*`
- Serviços: `app/services/*` (lógica de negócio)
- Sessão DB: `app/db/session.py`

## Autenticação

- Fluxo: `POST /api/v1/auth/register` registra usuário; `POST /api/v1/auth/login` usa form-data (`username` e `password`) e grava cookie `access_token` com JWT.
- Endpoints usam dependências: `get_current_user` e `get_admin_user` (veja `app/core/security/dependencies.py`).

## Models (resumo)

Base extraída de `app/db/models.py`:

- `User`:
  - `id: UUID`, `full_name`, `email`, `password_hash`, `is_admin: bool`, `profile_picture_url`
  - relacionamento: `classifications`

- `Classification`:
  - `id: UUID`, `user_id`, `classification_date`, `original_image_url`, `location`
  - relacionamento: `species_classifications`

- `Species`:
  - `id: UUID`, `model_class_id: int`, `scientific_name`, `description`
  - relacionamento: `popular_names`, `species_images`, `species_classifications`

- `SpeciesClassification`:
  - `id: UUID`, `species_id`, `classification_id`, `score: float`

- `SpeciesImage`:
  - `id: UUID`, `species_id`, `image_url`

- `SpeciesPopularName`:
  - `id: UUID`, `species_id`, `name`

## Schemas (resumo)

- `app/schemas/user.py`:
  - `UserCreate` (full_name, email, password)
  - `UserOut` (id, full_name, email, profile_image_url, is_admin)

- `app/schemas/species.py`:
  - `Species`, `SpeciesCreate`, `SpeciesPopularName`

- `app/schemas/species_image.py`:
  - `SpeciesImageOut` (id, image_url, species_id)

- `app/schemas/classification.py`:
  - `SpeciesResultOut` (species_id, scientific_name, popular_name, score)
  - `ClassificationOut` (id, classification_date, original_image_url, location, predictions)

## Endpoints (API)

Prefix global: `/api/v1` (definido em `app/core/config.py`).

- Auth (`/api/v1/auth`):
  - `POST /register` -> `UserCreate` retorna `UserOut`
  - `POST /login` -> espera `application/x-www-form-urlencoded` (OAuth2PasswordRequestForm) e seta cookie `access_token`
  - `POST /logout` -> remove cookie
  - `GET /me` -> retorna `UserOut` (usuário atual)

- Species (`/api/v1/species`):
  - `GET /species` -> lista `Species` (autenticado)
  - `GET /species/{species_id}` -> `Species` (autenticado)
  - `POST /species` -> cria `Species` (admin)
  - `PUT /species/{species_id}` -> atualiza (admin)
  - `DELETE /species/{species_id}` -> exclui (admin)
  - `POST /species/{species_id}/popular-names` -> adiciona nome popular (admin)
  - `PUT /species/{species_id}/popular-names/{popular_name_id}` -> atualiza nome popular (admin)
  - `DELETE /species/{species_id}/popular-names/{popular_name_id}` -> remove nome popular (admin)

- Species images (`/api/v1/species/{species_id}/images`):
  - `POST /species/{species_id}/images` -> upload `multipart/form-data` (admin)
  - `GET /species/{species_id}/images` -> lista imagens
  - `DELETE /species/{species_id}/images/{image_id}` -> remove imagem (admin)

- Classifications (`/api/v1/classifications`):
  - `GET /classifications` -> lista classificações do usuário atual
  - `GET /classifications/{classification_id}` -> obtém uma classificação por id (usuário dono)
  - `POST /classifications` -> realiza a classificação: recebe `multipart/form-data` com arquivo `file` e retorna `classification_id`, `top_k` e `predictions`

Notas:
- `POST /classifications` usa o pipeline: abre imagem com Pillow, aplica `preprocess_image`, chama `run_classification` em `app/services`, salva resultado com `save_classification`.
- Os endpoints que alteram dados normalmente exigem `get_admin_user`.

## Exemplos rápidos

- Registrar usuário

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"João", "email":"joao@example.com", "password":"senha"}'
```

- Login (form)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -F 'username=joao@example.com' \
  -F 'password=senha' \
  -c cookies.txt
```

- Classificar imagem (usuário autenticado via cookie)

```bash
curl -X POST http://localhost:8000/api/v1/classifications \
  -b cookies.txt \
  -F "file=@/path/to/photo.jpg"
```

Resposta esperada (exemplo):

```json
{
  "classification_id": "<uuid>",
  "top_k": 5,
  "predictions": [
    {"species_id":"<uuid>", "scientific_name":"Species A", "popular_name":"Nome A", "score":0.9},
    ...
  ]
}
```

## Modelo ML

- O caminho do modelo é lido em `app/core/config.py` / `Settings.MODEL_PATH` (default aponta para `app/services/ml/weights/d15-sp.onnx`).
- Pré-processamento em `app/services/ml/preprocess.py` e inferência em `app/services/ml/model_loader.py`.


