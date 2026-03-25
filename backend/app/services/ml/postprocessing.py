from PIL import Image
from typing import List
import io
import numpy as np


def mask_to_png(mask: np.ndarray) -> io.BytesIO:
  h, w = mask.shape

  rgba = np.zeros((h, w, 4), dtype=np.uint8)

  rgba[..., 0] = 0
  rgba[..., 1] = 255
  rgba[..., 2] = 0

  rgba[..., 3] = (mask > 0).astype(np.uint8) * 60

  img = Image.fromarray(rgba, mode="RGBA")

  buf = io.BytesIO()
  img.save(buf, format="PNG")
  buf.seek(0)

  return buf