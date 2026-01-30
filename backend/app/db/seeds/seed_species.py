import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_async_session
from app.db.models import Species
from app.services.ml.id2label import ID2LABEL

async def seed_species():
  async for session in get_async_session():

    for class_id, scientific_name in ID2LABEL.items():
      result = await session.execute(
        select(Species).where(Species.scientific_name == scientific_name)
      )
      exists = result.scalars().first()
      if exists:
        continue

      species = Species(
        scientific_name=scientific_name,
        popular_name="",  
        model_class_id=class_id,
        description=None
      )

      session.add(species) 
    await session.commit()
  print(f"🌱 Seed concluído: {len(ID2LABEL)} espécies processadas")

if __name__ == "__main__":
  asyncio.run(seed_species())