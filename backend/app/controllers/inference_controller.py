from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.inference_service import run_inference
from PIL import Image
from app.services.ml.preprocess import preprocess_image

router = APIRouter(prefix="/inference", tags=["inference"])

@router.post("/")
async def inference(file: UploadFile = File(...)):
  TOP_K = 5

  try:
    image = Image.open(file.file)
  except Exception as e:
    raise HTTPException(status_code=400, detail="Invalid image")
  
  tensor = preprocess_image(image)
  results = run_inference(tensor, top_k=TOP_K)

  return {
    "top_k": TOP_K,
    "predictions": results
  }