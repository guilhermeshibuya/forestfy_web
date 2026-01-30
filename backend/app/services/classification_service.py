import numpy as np
from app.services.ml.model_loader import get_model
from app.services.ml.id2label import ID2LABEL
from app.db.models import Classification, SpeciesClassification, User, Species
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID


class ClassificationResult(dict):
  label: str
  confidence: float
  class_id: int


def normalize_confidence(value: float, decimals: int = 4) -> float:
  """Normalize confidence score to a float with specified decimal places."""
  if value < 10 ** (-decimals):
    return 0.0
  return round(value, decimals)


def run_classification(input_tensor: np.ndarray, top_k: int = 5) -> list[ClassificationResult]:
  """Run inference on the input tensor using the loaded model."""
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
  