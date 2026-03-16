from typing import List

from pydantic import BaseModel
from uuid import UUID

class SpeciesImageResponse(BaseModel):
  id: UUID
  image_url: str
  species_id: UUID

  class Config:
    orm_mode = True


class SpeciesPrimaryImagesRequest(BaseModel):
  species_id: List[UUID]
