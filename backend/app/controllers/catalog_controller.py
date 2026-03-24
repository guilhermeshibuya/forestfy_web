from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import User
from app.schemas.species import SpeciesCatalogResponse

from app.db.session import get_async_session
from app.services import species_service

from app.core.security.dependencies import get_current_user


router = APIRouter(
  prefix="/catalog",
  tags=["catalog"]
)


@router.get(
  "/species",
  response_model=SpeciesCatalogResponse
)
async def get_species_catalog(
  limit: int = 20,
  offset: int = 0,
  session: AsyncSession = Depends(get_async_session),
  _: User = Depends(get_current_user)
):
  try:
    result = await species_service.get_species_catalog(session, limit, offset)
    data = result["data"]
    total = result["total"]

    return {
      "data": data,
      "total": total,
      "limit": limit,
      "offset": offset
    }
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail=str(e)
  )