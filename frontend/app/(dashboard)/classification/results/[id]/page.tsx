'use client'

import { useClassificationResults } from '@/hooks/use-classification-results'
import { useParams } from 'next/navigation'

export default function ClassificationDetailsPage() {
  const params = useParams()
  const id = params.id as string

  const { data } = useClassificationResults(id)

  return (
    <div>
      <ol className="text-zinc-700">
        {data?.predictions.map((prediction, index) => (
          <li key={index}>
            {prediction.scientific_name}: {prediction.score}
          </li>
        ))}
      </ol>
    </div>
  )
}
