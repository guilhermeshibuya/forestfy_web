from typing import List, Tuple
from PIL import Image

import numpy as np
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool

from app.services.ml.model_loader import ModelType, get_model, get_model_path
from app.services.ml.preprocess import preprocess_segmentation_image


class Point(BaseModel):
  x: float
  y: float
  label: int


async def run_encoder(image: np.ndarray) -> np.ndarray:
  model_path = get_model_path(ModelType.SEGMENTATION_ENCODER)
  encoder = get_model(model_path)

  inputs = {
    encoder.get_inputs()[0].name: image
  }
  # outputs =  encoder.run(None, inputs)
  outputs = await run_in_threadpool(encoder.run, None, inputs)

  return outputs[0]



def prepare_points(
  points: List[Point], 
  original_size: Tuple[int, int],
  resize_size: Tuple[int, int]
) -> Tuple[np.ndarray, np.ndarray]:
  orig_h, orig_w = original_size
  resized_h, resized_w = resize_size

  scale_x = resized_w / orig_w
  scale_y = resized_h / orig_h

  coords = []
  labels = []

  for p in points:
    coords.append([p.x * scale_x, p.y * scale_y])
    labels.append(p.label)
  
  coords = np.array(coords, dtype=np.float32)
  labels = np.array(labels, dtype=np.float32)

  padding_coord = np.array([[0.0, 0.0]], dtype=np.float32)
  padding_label = np.array([-1], dtype=np.float32)

  coords = np.concatenate([coords, padding_coord], axis=0)
  labels = np.concatenate([labels, padding_label], axis=0)

  coords = coords[None, :, :]
  labels = labels[None, :]

  return coords, labels


async def run_decoder(
  image_embeddings: np.ndarray,
  point_coords: np.ndarray,
  point_labels: np.ndarray,
  original_size: Tuple[int, int]
) -> Tuple[np.ndarray, np.ndarray]:
  model_path = get_model_path(ModelType.SEGMENTATION_DECODER)
  decoder = get_model(model_path)

  inputs = {
    "image_embeddings": image_embeddings,
    "point_coords": point_coords,
    "point_labels": point_labels,
    "mask_input": np.zeros((1, 1, 256, 256), dtype=np.float32),
    "has_mask_input": np.zeros((1,), dtype=np.float32),
    "orig_im_size": np.array(original_size, dtype=np.float32)
  }

  # outputs = decoder.run(None, inputs)
  outputs = await run_in_threadpool(decoder.run, None, inputs)

  mask_threshold = 0.0

  masks: np.ndarray = outputs[0]
  masks = masks > mask_threshold
  scores: np.ndarray = outputs[1]

  return masks, scores



def resize_mask(
  mask: np.ndarray,
  original_size: Tuple[int, int]
) -> np.ndarray:
  orig_h, orig_w = original_size

  mask_img = Image.fromarray((mask * 255).astype(np.uint8))
  mask_img = mask_img.resize((orig_w, orig_h), Image.Resampling.NEAREST)
  mask_resized = np.array(mask_img)

  return (mask_resized > 0).astype(np.uint8)




def debug_overlay(image: Image.Image, mask: np.ndarray):
  image_np = np.array(image)

  overlay = image_np.copy()

  overlay[mask > 0] = [0, 255, 0]
  blended = (0.5 * image_np + 0.5 * overlay).astype(np.uint8)

  Image.fromarray(blended).save("debug_overlay.png")


async def segment(
  image: Image.Image,
  points: List[Point]
) -> Tuple[np.ndarray, float]:
  data = preprocess_segmentation_image(image)
  
  image_np = data["image"]
  original_size = data["original_size"]
  resized_size = data["resized_size"]

  embeddings = await run_encoder(image_np)

  point_coords, point_labels = prepare_points(points, original_size, resized_size)

  masks, scores = await run_decoder(
    embeddings,
    point_coords,
    point_labels,
    original_size
  )

  best_idx = int(np.argmax(scores))
  best_mask = masks[0][best_idx]
  best_mask = resize_mask(best_mask, original_size)
  best_score = float(scores[0][best_idx])

  return best_mask, best_score
