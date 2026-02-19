from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.services import species_service
from app.schemas.species import Species, SpeciesCreate
from app.db.session import get_async_session

router = APIRouter(
  prefix="/species",
  tags=["species"]
)

@router.get(
  "",
  response_model=list[Species]
)
async def get_all_species(
  session: AsyncSession = Depends(get_async_session)
):
  return await species_service.get_species(session)


@router.get(
  "/{species_id}",
  response_model=Species
)
async def get_species_by_id(
  species_id: UUID,
  session: AsyncSession = Depends(get_async_session)
):
  return await species_service.get_species_by_id(species_id, session)


@router.post(
  "",
  response_model=Species
)
async def create_species(
  species_data: SpeciesCreate,
  session: AsyncSession = Depends(get_async_session)
):
  return await species_service.create_species(species_data, session)


@router.put(
  "/{species_id}",
  response_model=Species
)
async def update_species(
  species_id: UUID,
  species_data: SpeciesCreate,
  session: AsyncSession = Depends(get_async_session)
):
  return await species_service.update_species(species_id, species_data, session)


@router.delete(
  "/{species_id}",
  response_model=Species
)
async def delete_species(
  species_id: UUID,
  session: AsyncSession = Depends(get_async_session)
):
  return await species_service.delete_species(species_id, session)


@router.post(
  "/{species_id}/popular-names"
)
async def add_popular_name(
  species_id: UUID,
  name: str,
  session: AsyncSession = Depends(get_async_session)
):
  return await species_service.create_popular_name(species_id, name, session)


@router.delete(
  "/{species_id}/popular-names/{popular_name_id}"
)
async def delete_popular_name(
  popular_name_id: UUID,
  session: AsyncSession = Depends(get_async_session)
):
  return await species_service.remove_popular_name(popular_name_id, session)