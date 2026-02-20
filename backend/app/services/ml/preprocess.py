import numpy as np
from PIL import Image
from app.services.ml.model_loader import get_input_shape
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
        height, width = get_input_shape()

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