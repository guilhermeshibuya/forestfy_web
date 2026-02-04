import os
from uuid import UUID, uuid4
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import SpeciesImage, Species
from sqlalchemy import select
from app.core.constants import UPLOAD_DIR


async def upload_species_image(
  session: AsyncSession,
  species_id: UUID,
  file: UploadFile
):
  result = await session.execute(
    select(Species).where(Species.id == species_id)
  )
  species = result.scalars().first()

  if not species:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Species not found"
    )
  
  file_ext = file.filename.split(".")[-1]
  file_name = f"{uuid4()}.{file_ext}"
  file_path = f"{UPLOAD_DIR}/{file_name}"

  os.makedirs(UPLOAD_DIR, exist_ok=True)

  with open(file_path, "wb") as buffer:
    buffer.write(await file.read())
  
  image = SpeciesImage(
    species_id=species_id,
    image_url=file_path
  )

  session.add(image)
  await session.commit()
  await session.refresh(image)

  return image


async def get_species_images(
  session: AsyncSession,
  species_id: UUID
):
  result = await session.execute(
    select(SpeciesImage).where(SpeciesImage.species_id == species_id)
  )

  if not result:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="No images found for this species"
    )
  
  return result.scalars().all()


async def delete_species_image(
  session: AsyncSession,
  species_id: UUID,
  image_id: UUID
):
  result = await session.execute(
    select(SpeciesImage)
    .where(
      SpeciesImage.id == image_id,
      SpeciesImage.species_id == species_id
    )
  )
  image = result.scalars().first()

  if not image:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Image not found"
    )

  if os.path.exists(image.image_url):
    os.remove(image.image_url)

  await session.delete(image)
  await session.commit()

