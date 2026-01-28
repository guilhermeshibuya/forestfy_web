import numpy as np
from app.services.ml.model_loader import get_model
from app.services.ml.id2label import ID2LABEL

class InfereceResult(dict):
  label: str
  confidence: float
  class_id: int


def softmax(x: np.ndarray) -> np.ndarray:
  e_x = np.exp(x - np.max(x))
  return e_x / e_x.sum(axis=0)


def run_inference(input_tensor: np.ndarray, top_k: int = 5) -> list[InfereceResult]:
  """Run inference on the input tensor using the loaded model."""
  model = get_model()

  input_name = model.get_inputs()[0].name
  outputs = model.run(None, {input_name: input_tensor})

  logits = outputs[0][0] # Assuming single batch input
  probs = softmax(logits)

  top_indices = probs.argsort()[-top_k:][::-1]

  results = []
  for class_id in top_indices:
    results.append({
      "class_id": int(class_id),
      "label": ID2LABEL.get(class_id, "unknown"),
      "confidence": float(probs[class_id])
    })

  return results