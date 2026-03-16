import numpy as np
from app.services.ml.model_loader import get_model
from app.services.ml.id2label import ID2LABEL
from app.db.models import Classification, SpeciesClassification, Species
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import aliased
from uuid import UUID

from app.core.exceptions import MLProcessingException, NotFoundException
from app.core.error_messages import CLASSIFICATION_NOT_FOUND, RUN_CLASSIFICATION_ERROR
from app.schemas.classification import PredictionResult


def normalize_confidence(value: float, decimals: int = 4) -> float:
  """Normalize confidence score to a float with specified decimal places."""
  if value < 10 ** (-decimals):
    return 0.0
  return round(value, decimals)


def run_classification(input_tensor: np.ndarray, top_k: int = 5) -> list[PredictionResult]:
  """Run inference on the input tensor using the loaded model."""
  try:
    model = get_model()

    input_name = model.get_inputs()[0].name
    outputs = model.run(None, {input_name: input_tensor})

    probs = outputs[0][0] # Assuming single batch input

    top_indices = probs.argsort()[-top_k:][::-1]

    results = []
    for class_id in top_indices:
      results.append({
        "class_id": int(class_id),
        "label": ID2LABEL.get(int(class_id), "unknown"),
        "confidence": normalize_confidence(float(probs[class_id]))
      })

    return results
  except Exception:
    raise MLProcessingException(RUN_CLASSIFICATION_ERROR)


async def save_classification(
  *,
  session: AsyncSession,
  user_id: UUID,
  image_url: str,
  location: str | None,
  predictions: list[dict]
):
  classification = Classification(
    user_id=user_id,
    original_image_url=image_url,
    location=location
  )

  session.add(classification)
  await session.flush()  # To get classification.id

  for pred in predictions:
    result = await session.execute(
      select(Species).where(
        Species.model_class_id == pred["class_id"]
      )
    )
    species = result.scalars().first()

    if not species:
      continue
    
    session.add(
      SpeciesClassification(
        species_id=species.id,
        classification_id=classification.id,
        score=pred["confidence"]
      )
    )

  await session.commit()
  await session.refresh(classification)

  return classification


async def get_user_classifications(
  session: AsyncSession,
  user_id: UUID
):
  result = await session.execute(
    select(Classification)
    .where(Classification.user_id == user_id)
    .order_by(Classification.classification_date.desc())
  )
  classifications = result.scalars().unique().all()

  if not classifications:
    return []

  response = []

  for classification in classifications:
    result = await session.execute(
      select(
        SpeciesClassification.score,
        Species.id,
        Species.scientific_name,
      )
      .join(
        Species, Species.id == SpeciesClassification.species_id
      )
      .where(
        SpeciesClassification.classification_id == classification.id
      )
      .order_by(SpeciesClassification.score.desc())
    )
    species_results = [
      {
        "species_id": row.id,
        "scientific_name": row.scientific_name,
        "score": row.score
      }
      for row in result.all()
    ]

    response.append({
      "classification_id": classification.id,
      "classification_date": classification.classification_date,
      "original_image_url": classification.original_image_url,
      "location": classification.location,
      "predictions": species_results
    })
  return response


async def get_classification_by_id(
  session: AsyncSession,
  classification_id: UUID,
  user_id: UUID
):
  result = await session.execute(
    select(Classification)
    .where(
      Classification.id == classification_id,
      Classification.user_id == user_id  
    )
  )
  classification = result.scalars().first()
  
  if not classification:
    return NotFoundException(CLASSIFICATION_NOT_FOUND)

  result = await session.execute(
    select(
      SpeciesClassification.score,
      Species.id,
      Species.scientific_name,
    )
    .join(
      Species, Species.id == SpeciesClassification.species_id
    )
    .where(
      SpeciesClassification.classification_id == classification.id
    )
    .order_by(SpeciesClassification.score.desc())
  )
  species_results = [
    {
      "species_id": row.id,
      "scientific_name": row.scientific_name,
      "score": row.score
    }
    for row in result.all()
  ]

  return {
    "classification_id": classification.id,
    "classification_date": classification.classification_date,
    "original_image_url": classification.original_image_url,
    "location": classification.location,
    "predictions": species_results
  }


async def get_recent_by_user(
  session: AsyncSession,
  user_id: UUID,
  limit: int = 5
):
  top_score_subq = (
    select(
      SpeciesClassification.classification_id,
      func.max(SpeciesClassification.score).label("top_score")
    )
    .group_by(SpeciesClassification.classification_id)
    .subquery()
  )

  result = await session.execute(
    select(
      Classification,
      Species.id,
      Species.scientific_name,
      SpeciesClassification.score
    )
    .join(
      top_score_subq,
      top_score_subq.c.classification_id == Classification.id
    )
    .join(
      SpeciesClassification,
      (SpeciesClassification.classification_id == Classification.id) &
      (SpeciesClassification.score == top_score_subq.c.top_score)
    )
    .join(
      Species,
      Species.id == SpeciesClassification.species_id
    )
    .where(Classification.user_id == user_id)
    .order_by(Classification.classification_date.desc())
    .limit(limit)
  )

  rows = result.all()

  return [
    {
      "classification_id": classification.id,
      "classification_date": classification.classification_date,
      "original_image_url": classification.original_image_url,
      "location": classification.location,
      "top_prediction": {
        "species_id": species_id,
        "scientific_name": scientific_name,
        "score": score
      }
    }
    for classification, species_id, scientific_name, score in rows
  ]
   