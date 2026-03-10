from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc
from uuid import UUID

from app.db.models import Classification, SpeciesClassification

async def get_total_classifications(
  session: AsyncSession,
  user_id: UUID
):
  result = await session.execute(
    select(Classification)
    .where(Classification.user_id == user_id)
  )

  classifications = result.scalars().all()

  return len(classifications)


async def get_total_species_identified(
  session: AsyncSession,
  user_id: UUID
):
  rank_query = (
    select(
      SpeciesClassification.species_id,
      func.row_number().over(
        partition_by=SpeciesClassification.classification_id,
        order_by=desc(SpeciesClassification.score)
      ).label("rank")
    )
    .join(Classification)
    .where(Classification.user_id == user_id)
  ).subquery()

  stmt = (
    select(func.count(func.distinct(rank_query.c.species_id)))
    .where(rank_query.c.rank == 1)
  )
  result = await session.execute(stmt)
  total_species = result.scalar()
  return total_species or 0


async def get_avg_accuracy(
  session: AsyncSession,
  user_id: UUID
):
  subq = (
    select(
      func.max(SpeciesClassification.score).label("max_score")
    )
    .join(Classification, SpeciesClassification.classification_id == Classification.id)
    .where(Classification.user_id == user_id)
    .group_by(Classification.id)
  ).subquery()

  stmt = select(func.avg(subq.c.max_score))

  result = await session.execute(stmt)
  avg_score = result.scalar()

  return float(avg_score) if avg_score is not None else 0.0