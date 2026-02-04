from pydantic import BaseModel
from uuid import UUID

class SpeciesImageOut(BaseModel):
  id: UUID
  image_url: str
  species_id: UUID

  class Config:
    orm_mode = True