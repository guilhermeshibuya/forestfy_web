from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from uuid import UUID

from app.db.models import Species, SpeciesPopularName
from app.core.error_messages import SPECIES_NOT_FOUND, SPECIES_ALREADY_EXISTS, POPULAR_NAME_NOT_FOUND
from app.core.exceptions import NotFoundException, ConflictException
from app.schemas.species import SpeciesCreate

async def get_all_species(
  session: AsyncSession
):
  result = await session.execute(
    select(Species)
    .options(selectinload(Species.popular_names))
  )
  return result.scalars().all()


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
    raise NotFoundException(SPECIES_NOT_FOUND)
  
  return species


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
    raise ConflictException(
      message=SPECIES_ALREADY_EXISTS
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

  return species


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
    raise NotFoundException(SPECIES_NOT_FOUND)
  
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
    raise ConflictException(SPECIES_ALREADY_EXISTS)

  species.model_class_id = species_data.model_class_id
  species.scientific_name = species_data.scientific_name
  species.description = species_data.description

  species.popular_names.clear()

  for name in species_data.popular_names:
    species.popular_names.append(SpeciesPopularName(name=name))

  await session.commit()
  await session.refresh(species)

  return species


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
    raise NotFoundException(SPECIES_NOT_FOUND)
  
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
    raise NotFoundException(SPECIES_NOT_FOUND)

  popular_name = SpeciesPopularName(
    species_id=species_id,
    name=name
  )
  session.add(popular_name)
  await session.commit()

  return popular_name


async def update_popular_name(
  popular_name_id: UUID,
  new_name: str,
  session: AsyncSession
):
  result = await session.execute(
    select(SpeciesPopularName)
    .where(SpeciesPopularName.id == popular_name_id)
  )

  popular_name = result.scalars().first()

  if not popular_name:
    raise NotFoundException(POPULAR_NAME_NOT_FOUND)
  
  popular_name.name = new_name
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
    raise NotFoundException(POPULAR_NAME_NOT_FOUND)
  
  await session.delete(name)
  await session.commit()

  
