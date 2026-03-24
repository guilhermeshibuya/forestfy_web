export type SpeciesCatalogItem = {
  id: string
  scientific_name: string
  description: string | null
  popular_names: string[]
  image_url: string | null
}

export type SpeciesCatalogResponse = {
  data: SpeciesCatalogItem[]
  total: number
  limit: number
  offset: number
}
