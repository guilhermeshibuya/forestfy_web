from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class SpeciesResultOut(BaseModel):
  species_id: UUID
  scientific_name: str
  score: float


class ClassificationOut(BaseModel):
  classification_id: UUID
  classification_date: datetime
  original_image_url: str
  location: str | None
  predictions: list[SpeciesResultOut]

  class Config:
    orm_mode = True


class PredictionResult(BaseModel):
  class_id: int
  label: str
  confidence: float


class ClassificationResultOut(BaseModel):
  classification_id: UUID
  top_k: int
  predictions: list[PredictionResult]


class RecentClassificationOut(BaseModel):
  classification_id: UUID
  classification_date: datetime
  original_image_url: str
  location: str | None
  top_prediction: SpeciesResultOut