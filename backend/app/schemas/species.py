from pydantic import BaseModel
from uuid import UUID

class Species(BaseModel):
  id: UUID
  model_class_id: int
  scientific_name: str
  popular_names: list[str]
  description: str | None
  
  class Config:
    orm_mode = True


class SpeciesCreate(BaseModel):
  model_class_id: int
  scientific_name: str
  popular_names: list[str]
  description: str | None


class SpeciesPopularName(BaseModel):
  id: UUID
  species_id: UUID
  name: str
  
  class Config:
    orm_mode = True


class SpeciesCatalogItem(BaseModel):
  id: UUID
  scientific_name: str
  description: str | None
  popular_names: list[str]
  image_url: str | None


class SpeciesCatalogResponse(BaseModel):
  data: list[SpeciesCatalogItem]
  total: int
  limit: int
  offset: int
