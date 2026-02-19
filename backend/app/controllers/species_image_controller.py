from fastapi import APIRouter, Depends, UploadFile, HTTPException, status, File
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.models import User
from app.core.security import get_admin_user
from app.db.session import get_async_session
from app.schemas.species_image import SpeciesImageOut
from app.services.species_image_service import upload_species_image, get_species_images, delete_species_image

router = APIRouter(
  prefix="/species",
  tags=["species_images"]
)

@router.post(
  "/{species_id}/images",
  response_model=SpeciesImageOut,
  status_code=status.HTTP_201_CREATED
)
async def upload_image(
  specieds_id: UUID,
  file: UploadFile = File(...),
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_admin_user)
):
  return await upload_species_image(
    session=session,
    species_id=specieds_id,
    file=file
  )


@router.get(
  "/{species_id}/images",
  response_model=list[SpeciesImageOut]
)
async def get_images(
  species_id: UUID,
  session: AsyncSession = Depends(get_async_session)
):
  return await get_species_images(session=session, species_id=species_id)


@router.delete(
  "/{species_id}/images/{image_id}",
  status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_image(
  species_id: UUID,
  image_id: UUID,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_admin_user)
):
  await delete_species_image(session=session, species_id=species_id, image_id=image_id)