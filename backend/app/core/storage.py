import boto3
from app.core.config import Settings
from fastapi import UploadFile
import uuid

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

    print("SIZE OF FILE CONTENTS:", len(contents))

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