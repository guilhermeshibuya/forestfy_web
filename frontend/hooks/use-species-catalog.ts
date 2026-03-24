import { SpeciesCatalogResponse } from '@/app/(dashboard)/catalog/(types)/catalog-types'
import { api, getCatalogSpeciesEndpoint } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'

export function useSpeciesCatalog(limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: ['speciesCatalog', { limit, offset }],
    queryFn: async () => {
      return await api<SpeciesCatalogResponse>(
        getCatalogSpeciesEndpoint(limit, offset),
      )
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
