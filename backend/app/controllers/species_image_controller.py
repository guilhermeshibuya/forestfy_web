from fastapi import APIRouter, Depends, UploadFile, HTTPException, status, File
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.models import User
from app.core.security.dependencies import get_admin_user
from app.db.session import get_async_session
from app.schemas.species_image import SpeciesImageOut
from app.services.species_image_service import upload_species_image, get_species_images, delete_species_image
from app.core.exceptions import NotFoundException


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
  try:
    return await upload_species_image(
      session=session,
      species_id=specieds_id,
      file=file
    )
  except NotFoundException as e:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )


@router.get(
  "/{species_id}/images",
  response_model=list[SpeciesImageOut]
)
async def get_images(
  species_id: UUID,
  session: AsyncSession = Depends(get_async_session)
):
  try:
    return await get_species_images(session=session, species_id=species_id)
  except NotFoundException as e:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )


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
  try:
    await delete_species_image(session=session, species_id=species_id, image_id=image_id)
  except NotFoundException as e:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )