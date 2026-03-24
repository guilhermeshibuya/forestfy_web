import boto3
from app.core.config import Settings
from fastapi import UploadFile
from pathlib import Path
import uuid
import mimetypes

config = Settings()

s3_client = boto3.client(
  "s3",
  endpoint_url=config.AWS_S3_ENDPOINT_URL,
  aws_access_key_id=config.AWS_ACCESS_KEY_ID,
  aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY
)

BUCKET_NAME = config.AWS_S3_BUCKET_NAME

async def upload_file_to_s3(file: UploadFile, prefix: str):
  try:
    file.file.seek(0)

    contents = await file.read()

    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    object_key = f"{prefix}/{file_name}"

    s3_client.put_object(
      Bucket=BUCKET_NAME,
      Key=object_key,
      Body=contents,
      ContentType=file.content_type
    )
    file_url = f"http://localhost:9000/{BUCKET_NAME}/{object_key}"

    return file_url
  except Exception as e:
    raise Exception(f"Failed to upload file to S3: {str(e)}")
  

async def upload_local_file_to_s3(file_path: Path, prefix: str):
  file_path = Path(file_path)
  
  try:
    with open(file_path, "rb") as f:
      contents = f.read()

    file_ext = file_path.suffix.replace(".", "")
    file_name = f"{uuid.uuid4()}.{file_ext}"
    object_key = f"{prefix}/{file_name}"

    content_type, _ = mimetypes.guess_type(file_path)

    s3_client.put_object(
      Bucket=BUCKET_NAME,
      Key=object_key,
      Body=contents,
      ContentType=content_type or "application/octet-stream"
    )

    file_url = f"http://localhost:9000/{BUCKET_NAME}/{object_key}"
    return file_url
  except Exception as e:
    raise Exception(f"Failed to upload local file to S3: {str(e)}")


def clear_bucket():
  response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)

  if "Contents" not in response:
    return
  
  for obj in response["Contents"]:
    s3_client.delete_object(Bucket=BUCKET_NAME, Key=obj["Key"])