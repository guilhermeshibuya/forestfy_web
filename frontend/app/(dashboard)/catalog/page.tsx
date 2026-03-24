'use client'

import { Logo } from '@/components/logo'
import { SpeciesCatalogCard } from './(components)/species-catalog-card'
import { useSpeciesCatalog } from '@/hooks/use-species-catalog'
import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const PAGE_SIZE = 15

function generatePages(current: number, total: number) {
  const pages: (number | '...')[] = []

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)

  return pages
}

export default function CatalogPage() {
  const [page, setPage] = useState(1)
  const offset = (page - 1) * PAGE_SIZE

  const { data, isLoading } = useSpeciesCatalog(PAGE_SIZE, offset)
  const species = data?.data
  const total = data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Logo
          width={260}
          height={91}
          textColor="#4ADE80"
          className="animate-pulse"
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center flex-wrap gap-8">
        {species?.map((item) => (
          <SpeciesCatalogCard
            key={item.id}
            species_id={item.id}
            scientificName={item.scientific_name}
            popularName={item.popular_names[0]}
            biomes={[]}
            description={''}
            imageUrl={item.image_url || '/avatar.jpg'}
          />
        ))}
      </div>
      <Pagination className="my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            />
          </PaginationItem>
          {generatePages(page, totalPages).map((p, i) => (
            <PaginationItem key={i}>
              {p === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
