from app.db.models import Base
from app.db.session import engine
from app.core.storage import clear_bucket
import asyncio

async def reset_db():
  async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.drop_all)
    await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
  clear_bucket()
  asyncio.run(reset_db())