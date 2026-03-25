from typing import Dict

import numpy as np
from PIL import Image, ImageOps
from app.services.ml.model_loader import ModelType, get_input_shape, get_model_path
from app.core.error_messages import IMAGE_PROCESSING_ERROR
from app.core.exceptions import MLProcessingException

def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess the input image for model inference.

    Args:
        image (PIL.Image.Image): The input image to preprocess.

    Returns:
        np.ndarray: The preprocessed image as a numpy array.
    """
    try:
        model_path = get_model_path(ModelType.CLASSIFICATION)
        height, width = get_input_shape(model_path)

        # Resize the image to the target size
        image = image.resize((width, height))

        image = image.convert("RGB")  # Ensure image is in RGB format

        # Convert the image to a numpy array
        image_array = np.array(image)

        # Normalize pixel values to the range [0, 1]
        image_array = image_array.astype('float32') / 255.0
        image_array = np.transpose(image_array, (2, 0, 1)) # Change data layout to NCHW
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)

        return image_array
    except Exception:
        raise MLProcessingException(IMAGE_PROCESSING_ERROR)
    

def preprocess_segmentation_image(image: Image.Image) -> Dict:
    TARGET_SIZE = 1024
    try:
        image = image.convert("RGB")
        orig_width, orig_height = image.size

        resized_width, resized_height = image.size

        if orig_width > orig_height:
            resized_width = TARGET_SIZE
            resized_height = int(TARGET_SIZE / orig_width * orig_height)
        else:
            resized_height = TARGET_SIZE
            resized_width = int(TARGET_SIZE / orig_height * orig_width)

        image = image.resize((resized_width, resized_height), Image.Resampling.BILINEAR)

        mean = np.array([123.675, 116.28, 103.53], dtype=np.float32)
        std = np.array([58.395, 57.12, 57.375], dtype=np.float32)

        input_tensor = np.array(image).astype(np.float32)
        input_tensor = (input_tensor - mean) / std
        input_tensor = input_tensor.transpose(2, 0, 1)[None, :, :, :].astype(np.float32)

        if resized_height < resized_width:
          input_tensor = np.pad(
            input_tensor, 
            ((0, 0), (0, 0), (0, TARGET_SIZE - resized_height), (0, 0))
          )
        else:
          input_tensor = np.pad(
            input_tensor, 
            ((0, 0), (0, 0), (0, 0), (0, TARGET_SIZE - resized_width))
          )
        
        return {
          "image": input_tensor,
          "original_size": (orig_height, orig_width),
          "resized_size": (resized_height, resized_width)
        }
    except Exception:
        raise MLProcessingException(IMAGE_PROCESSING_ERROR)