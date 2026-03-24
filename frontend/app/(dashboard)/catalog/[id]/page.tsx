'use client'

import { useParams } from 'next/navigation'

export default function CatalogDetailsPage() {
  const params = useParams()
  const id = params.id as string

  return <div>{id}</div>
}
