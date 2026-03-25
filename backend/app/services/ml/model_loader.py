from enum import Enum

import onnxruntime as ort
from pathlib import Path
from typing import Tuple
from app.core.config import Settings


settings = Settings()


class ModelType(str, Enum):
  CLASSIFICATION = "classification"
  SEGMENTATION_ENCODER = "segmentation_encoder"
  SEGMENTATION_DECODER = "segmentation_decoder"


def get_model_path(type: ModelType):
  if type == ModelType.CLASSIFICATION:
    return settings.CLASSIFICATION_MODEL_PATH
  elif type == ModelType.SEGMENTATION_ENCODER:
    return settings.SEGMENTATION_ENCODER_PATH
  elif type == ModelType.SEGMENTATION_DECODER:
    return settings.SEGMENTATION_DECODER_PATH
  else:
    raise ValueError(f"Invalid model type: {type}")
  

_sessions = {}

def get_model(path: str) -> ort.InferenceSession:
  if path not in _sessions:
    _sessions[path] = ort.InferenceSession(path)
  return _sessions[path]


def get_input_shape(path: str) -> Tuple[int, int]:
  model = get_model(path)
  input_shape = model.get_inputs()[0].shape
  _, _, height, width = input_shape
  
  return int(height), int(width)