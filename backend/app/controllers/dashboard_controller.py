from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from app.services.dashboard_service import get_total_classifications, get_total_species_identified, get_avg_accuracy
from app.db.session import get_async_session
from app.core.security.dependencies import get_current_user
from app.db.models import User


router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/metrics")
async def get_dashboard_metrics(
  session: AsyncSession = Depends(get_async_session),
  user: User = Depends(get_current_user)
):
  total_classifications = await get_total_classifications(session=session, user_id=user.id)
  total_species_identified = await get_total_species_identified(session=session, user_id=user.id)
  avg_accuracy = await get_avg_accuracy(session=session, user_id=user.id)

  return {
    "total_classifications": total_classifications,
    "total_species_identified": total_species_identified,
    "avg_accuracy": avg_accuracy
  }