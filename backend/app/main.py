from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.session import engine
from app.db.models import Base
from app.controllers import auth_controller
from app.controllers import classification_controller

@asynccontextmanager
async def lifespan(app: FastAPI):
  async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)
  yield

app = FastAPI(
  title='Forestfy API',
  version='1.0.0',
  lifespan=lifespan
)

origins = [
  "http://localhost:3000",
  "https://localhost:3000"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.get("/health")
def health():
  return {"status": "ok"}

PREFIX = "/api/v1"

app.include_router(
  auth_controller.router,
  prefix=PREFIX,
  tags=["auth"]
)

app.include_router(
  classification_controller.router,
  prefix=PREFIX,
  tags=["classification"]
)
