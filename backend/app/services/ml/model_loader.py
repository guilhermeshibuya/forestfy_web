import onnxruntime as ort
from pathlib import Path
from typing import Tuple

BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = BASE_DIR / "services" / "ml" / "models" / "d15-sp.onnx"

_session = None

def get_model() -> ort.InferenceSession: 
  global _session
  if _session is None:
    _session = ort.InferenceSession(str(MODEL_PATH))
  return _session


def get_input_shape() -> Tuple[int, int]:
  model = get_model()
  input_shape = model.get_inputs()[0].shape
  _, _, height, width = input_shape
  
  return int(height), int(width)