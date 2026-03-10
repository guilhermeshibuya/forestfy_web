export type Prediction = {
  class_id: number
  label: string
  confidence: number
}

export type ClassificationResultResponse = {
  classification_id: string
  top_k: number
  predictions: Prediction[]
}

export type SpeciesResult = {
  species_id: string
  scientific_name: string
  score: number
}

export type ClassificationResponse = {
  classification_id: string
  classification_date: string
  original_image_url: string
  location: string | null
  predictions: SpeciesResult[]
}
