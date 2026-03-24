import { SpeciesResult } from './classification'

export type UserRecentActivity = {
  classification_id: string
  classification_date: Date
  original_image_url: string
  location: string | null
  top_prediction: SpeciesResult
}

export type UserRecentActivitiesResponse = {
  data: UserRecentActivity[]
  total: number
  limit: number
  offset: number
}
