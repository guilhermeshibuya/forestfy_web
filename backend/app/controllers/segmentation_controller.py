import json
from typing import List
from app.services.ml.postprocessing import mask_to_png
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from app.core.security.dependencies import get_current_user
from app.services.segmentation_service import Point, segment
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from fastapi.responses import StreamingResponse
from app.db.models import User
from PIL import Image, ImageOps
import io


router = APIRouter(
  prefix="/segment",
  tags=["segment"]
)

@router.post("")
async def segment_image(
  # async_session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_current_user),
  file: UploadFile = File(...),
  points: str = Form(...)
):
  try:
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    image = ImageOps.exif_transpose(image)

    points: List[Point] = [Point(**p) for p in json.loads(points)]

    mask, score = await segment(image, points)

    mask_png = mask_to_png(mask)

    return StreamingResponse(
      mask_png,
      media_type="image/png",
      headers={
        "X-Score": str(score),
        "X-Width": str(image.width),
        "X-Height": str(image.height)
      }
    )
  except Exception as e:
    raise HTTPException(status_code=400, detail=str(e))
