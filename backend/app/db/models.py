import sqlalchemy as sa
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Float, Integer
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from uuid import uuid4

class Base(DeclarativeBase):
  pass


class User(Base):
  __tablename__ = 'users'

  id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), default=uuid4, unique=True, nullable=False, primary_key=True)
  full_name: Mapped[str] = mapped_column(String(255), nullable=False)
  email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
  password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
  is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
  profile_picture_url: Mapped[str | None] = mapped_column(String, nullable=True)
  created_ad: Mapped[DateTime] = mapped_column(DateTime, server_default=sa.func.now())
  updated_ad: Mapped[DateTime] = mapped_column(DateTime, server_default=sa.func.now(), onupdate=sa.func.now())

  classifications: Mapped[list["Classification"]] = relationship(
    'Classification', 
    back_populates='user'
  )


class Classification(Base):
  __tablename__ = 'classifications'

  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
  user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)

  classification_date: Mapped[DateTime] = mapped_column(DateTime, server_default=sa.func.now())
  original_image_url: Mapped[str] = mapped_column(String, nullable=False)
  location: Mapped[str] = mapped_column(String, nullable=True)

  user: Mapped["User"] = relationship(
    'User', 
    back_populates='classifications'
  )

  species_classifications: Mapped[list['SpeciesClassification']] = relationship(
    'SpeciesClassification', 
    back_populates='classification'
  )


class Species(Base):
  __tablename__ = 'species'

  id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
  model_class_id: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
  scientific_name: Mapped[str] = mapped_column(String(255), nullable=False)
  description: Mapped[str | None] = mapped_column(String, nullable=True)

  popular_names: Mapped[list['SpeciesPopularName']] = relationship(
    'SpeciesPopularName', 
    back_populates='species',
    cascade='all, delete-orphan'
  )

  species_classifications: Mapped[list['SpeciesClassification']] = relationship(
    'SpeciesClassification', 
    back_populates='species'
  )

  species_images: Mapped[list['SpeciesImage']] = relationship(
    'SpeciesImage', 
    back_populates='species'
  )


class SpeciesClassification(Base):
  __tablename__ = 'species_classifications'

  id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
  species_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('species.id'), nullable=False)
  classification_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('classifications.id'), nullable=False)
  score: Mapped[float] = mapped_column(Float, nullable=False)

  species: Mapped["Species"] = relationship(
    'Species', 
    back_populates='species_classifications'
  )

  classification: Mapped["Classification"] = relationship(
    'Classification', 
    back_populates='species_classifications'
  )


class SpeciesImage(Base):
  __tablename__ = 'species_images'

  id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
  species_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('species.id'), nullable=False)
  image_url: Mapped[str] = mapped_column(String, nullable=False)

  species: Mapped["Species"] = relationship(
    'Species', 
    back_populates='species_images'
  )


class SpeciesPopularName(Base):
  __tablename__ = 'species_popular_names'

  id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
  species_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('species.id'), nullable=False)
  name: Mapped[str] = mapped_column(String(255), nullable=False)

  species: Mapped["Species"] = relationship(
    'Species', 
    back_populates='popular_names'
  )
  