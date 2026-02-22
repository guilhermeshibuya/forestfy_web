from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.models import User
from app.schemas.species import Species, SpeciesCreate, SpeciesPopularName
from app.core.exceptions import NotFoundException, ConflictException
from app.db.session import get_async_session
from app.services import species_service

from app.core.security.dependencies import get_admin_user, get_current_user


router = APIRouter(
  prefix="/species",
  tags=["species"]
)

@router.get(
  "",
  response_model=list[Species]
)
async def get_all_species(
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_current_user)
):
  species_list = await species_service.get_all_species(session)
  
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


@router.get(
  "/{species_id}",
  response_model=Species
)
async def get_species_by_id(
  species_id: UUID,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_current_user)
):
  try:
    species = await species_service.get_species_by_id(species_id, session)

    return {
      "id": species.id,
      "model_class_id": species.model_class_id,
      "scientific_name": species.scientific_name,
      "description": species.description,
      "popular_names": [pn.name for pn in species.popular_names],
    }
  except NotFoundException as e:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )


@router.post(
  "",
  response_model=Species
)
async def create_species(
  species_data: SpeciesCreate,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_admin_user)
):
  try:
    species = await species_service.create_species(species_data, session)

    return {
      "id": species.id,
      "model_class_id": species.model_class_id,
      "scientific_name": species.scientific_name,
      "popular_names": [pn.name for pn in species.popular_names],
      "description": species.description
    }
  except ConflictException as e:
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail=str(e)
    )


@router.put(
  "/{species_id}",
  response_model=Species
)
async def update_species(
  species_id: UUID,
  species_data: SpeciesCreate,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_admin_user)
):
  try:
    species = await species_service.update_species(species_id, species_data, session)
  
    return {
      "id": species.id,
      "model_class_id": species.model_class_id,
      "scientific_name": species.scientific_name,
      "description": species.description,
      "popular_names": [pn.name for pn in species.popular_names],
    }
  except NotFoundException as e:
        raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )
  except ConflictException as e:
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail=str(e)
    )


@router.delete(
  "/{species_id}",
  status_code=status.HTTP_204_NO_CONTENT
)
async def delete_species(
  species_id: UUID,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_admin_user)
):
  try:
    await species_service.delete_species(species_id, session)
  except NotFoundException as e:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )
  

@router.post(
  "/{species_id}/popular-names"
)
async def add_popular_name(
  species_id: UUID,
  name: str,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_admin_user)
):
  try:
    return await species_service.create_popular_name(species_id, name, session)
  except NotFoundException as e:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )
  

@router.put(
  "/{species_id}/popular-names/{popular_name_id}",
  response_model=SpeciesPopularName
)
async def update_popular_name(
  popular_name_id: UUID,
  new_name: str,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_admin_user)
):
  try:
    return await species_service.update_popular_name(popular_name_id, new_name, session)
  except NotFoundException as e:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )


@router.delete(
  "/{species_id}/popular-names/{popular_name_id}",
  status_code=status.HTTP_204_NO_CONTENT
)
async def delete_popular_name(
  popular_name_id: UUID,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_admin_user)
):
  try:
    return await species_service.remove_popular_name(popular_name_id, session)
  except NotFoundException as e:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=str(e)
    )