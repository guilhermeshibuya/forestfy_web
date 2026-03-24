import os
from uuid import UUID, uuid4
from app.core.storage import upload_file_to_s3
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import SpeciesImage, Species
from sqlalchemy import select
from app.core.error_messages import SPECIES_IMAGE_NOT_FOUND, SPECIES_NOT_FOUND
from app.core.exceptions import NotFoundException
from slugify import slugify


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
    raise NotFoundException(SPECIES_NOT_FOUND)
  
  safe_name = slugify(species.scientific_name)
  image_url = await upload_file_to_s3(file, prefix=f"catalog/{safe_name}")
  
  image = SpeciesImage(
    species_id=species_id,
    image_url=image_url,
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
  images = result.scalars().all()

  if not images:
    raise NotFoundException(SPECIES_IMAGE_NOT_FOUND)
  
  return images


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
    raise NotFoundException(SPECIES_IMAGE_NOT_FOUND)

  if os.path.exists(image.image_url):
    os.remove(image.image_url)

  await session.delete(image)
  await session.commit()


async def get_primary_images(
  session: AsyncSession,
  species_ids: list[UUID]
):
  stmt = (
    select(SpeciesImage)
    .where(
      SpeciesImage.species_id.in_(species_ids),
      SpeciesImage.is_primary.is_(True)
    )
  )
  result = await session.execute(stmt)

  return result.scalars().all()
