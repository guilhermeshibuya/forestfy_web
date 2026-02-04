from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
  DATABASE_URL: str = os.environ.get('DATABASE_URL')
  JWT_SECRET_KEY: str = os.environ.get("SECRET_KEY")
  JWT_ALGORITHM: str = "HS256"
  ACCES_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
  MODEL_PATH: str = "/app/app/services/ml/weights/d15-sp.onnx"
