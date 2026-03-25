'use client'

import { Logo } from '@/components/logo'
import { SpeciesCatalogCard } from './(components)/species-catalog-card'
import { useSpeciesCatalog } from '@/hooks/use-species-catalog'
import { useEffect, useRef, useState } from 'react'
import { GeneratePagination } from '../(components)/generate-pagination'

const PAGE_SIZE = 15

export default function CatalogPage() {
  const [page, setPage] = useState(1)
  const offset = (page - 1) * PAGE_SIZE

  const { data, isLoading } = useSpeciesCatalog(PAGE_SIZE, offset)
  const species = data?.data
  const total = data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
        } else {
          entry.target.classList.remove('show')
        }
      })
    }, {})
    return () => observerRef.current?.disconnect()
  }, [])

  const setRef = (element: HTMLDivElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element)
    }
  }

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
            refCallback={setRef}
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
      <GeneratePagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  )
}
