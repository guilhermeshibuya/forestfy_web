from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class SpeciesResultOut(BaseModel):
  species_id: UUID
  scientific_name: str
  popular_name: str 
  score: float


class ClassificationOut(BaseModel):
  id: UUID
  classification_date: datetime
  original_image_url: str
  location: str | None
  predictions: list[SpeciesResultOut]

  class Config:
    orm_mode = True