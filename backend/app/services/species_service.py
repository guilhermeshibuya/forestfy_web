from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from uuid import UUID

from app.db.models import Species, SpeciesPopularName
from app.schemas.species import SpeciesCreate

async def get_species(
  session: AsyncSession
):
  result = await session.execute(
    select(Species)
    .options(selectinload(Species.popular_names))
  )
  species_list = result.scalars().all()
  
  return [
    {
      "id": species.id,
      "model_class_id": species.model_class_id,
      "scientific_name": species.scientific_name,
      "description": species.description,
      "popular_names": [pn.name for pn in species.popular_names],
    }
    for species in species_list
  ]


async def get_species_by_id(
  species_id: UUID,
  session: AsyncSession
):
  result = await session.execute(
    select(Species).where(Species.id == species_id)
    .options(selectinload(Species.popular_names))
  )
  species = result.scalar_one_or_none()

  if not species:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Species not found"
    )
  
  return {
    "id": species.id,
    "model_class_id": species.model_class_id,
    "scientific_name": species.scientific_name,
    "description": species.description,
    "popular_names": [pn.name for pn in species.popular_names],
  }


async def create_species(
  species_data: SpeciesCreate,
  session: AsyncSession
):
  result = await session.execute(
    select(Species)
      .where(
        or_(
          Species.scientific_name == species_data.scientific_name,
          Species.model_class_id == species_data.model_class_id
        )
      )
      .options(selectinload(Species.popular_names))
  )
  existing_species = result.scalar_one_or_none()

  if existing_species:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Species with the same scientific name or model class ID already exists"
    )
  
  new_species = Species(
    model_class_id=species_data.model_class_id,
    scientific_name=species_data.scientific_name,
    description=species_data.description
  )

  session.add(new_species)
  await session.flush()

  popular_names = [
    SpeciesPopularName(
      species_id=new_species.id,
      name=name
    )
    for name in species_data.popular_names
  ]

  session.add_all(popular_names)

  await session.commit()
  
  result = await session.execute(
    select(Species).where(Species.id == new_species.id)
    .options(selectinload(Species.popular_names))
  )
  species = result.scalar_one_or_none()

  return {
    "id": species.id,
    "model_class_id": species.model_class_id,
    "scientific_name": species.scientific_name,
    "popular_names": [pn.name for pn in species.popular_names],
    "description": species.description
  }


async def update_species(
  species_id: UUID,
  species_data: SpeciesCreate,
  session: AsyncSession
):
  # Check if species exists
  result = await session.execute(
    select(Species).where(Species.id == species_id)
    .options(selectinload(Species.popular_names))
  )
  species = result.scalar_one_or_none()

  if not species:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Species not found"
    )
  
  # Check for conflicts with other species (scientific name or model class ID)
  result = await session.execute(
    select(Species)
    .where(
      Species.id != species_id,
      or_(
        Species.scientific_name == species_data.scientific_name,
        Species.model_class_id == species_data.model_class_id
      )
    )
  )
  conflicting_species = result.scalar_one_or_none()

  if conflicting_species:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Species with the same scientific name or model class ID already exists"
    )

  species.model_class_id = species_data.model_class_id
  species.scientific_name = species_data.scientific_name
  species.description = species_data.description

  species.popular_names.clear()

  for name in species_data.popular_names:
    species.popular_names.append(SpeciesPopularName(name=name))

  await session.commit()
  await session.refresh(species)

  return {
    "id": species.id,
    "model_class_id": species.model_class_id,
    "scientific_name": species.scientific_name,
    "description": species.description,
    "popular_names": [pn.name for pn in species.popular_names],
  }


async def delete_species(
  species_id: UUID,
  session: AsyncSession
):
  result = await session.execute(
    select(Species).where(Species.id == species_id)
    .options(selectinload(Species.popular_names))
  )
  species = result.scalar_one_or_none()

  if not species:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Species not found"
    )
  
  await session.delete(species)
  await session.commit()


async def create_popular_name(
  species_id: UUID,
  name: str,
  session: AsyncSession
):
  result = await session.execute(
    select(Species).where(Species.id == species_id)
  )

  species = result.scalar_one_or_none()

  if not species:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Species not found"
    )

  popular_name = SpeciesPopularName(
    species_id=species_id,
    name=name
  )
  session.add(popular_name)
  await session.commit()

  return popular_name


async def remove_popular_name(
  popular_name_id: UUID,
  session: AsyncSession
):
  result = await session.execute(
    select(SpeciesPopularName)
    .where(SpeciesPopularName.id == popular_name_id)
  )

  name = result.scalars().first()

  if not name:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Popular name not found"
    )
  
  await session.delete(name)
  await session.commit()

  
