from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
  DATABASE_URL: str = os.environ.get('DATABASE_URL')
  JWT_SECRET_KEY: str = os.environ.get("SECRET_KEY")
  JWT_ALGORITHM: str = "HS256"
  ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
  MODEL_PATH: str = "/app/app/services/ml/weights/d15-sp.onnx"
  API_PREFIX: str = "/api/v1"
  AWS_ACCESS_KEY_ID: str = os.environ.get("AWS_ACCESS_KEY_ID")
  AWS_SECRET_ACCESS_KEY: str = os.environ.get("AWS_SECRET_ACCESS_KEY")
  AWS_S3_BUCKET_NAME: str = os.environ.get("AWS_S3_BUCKET_NAME")
  AWS_S3_ENDPOINT_URL: str = os.environ.get("AWS_S3_ENDPOINT_URL")
