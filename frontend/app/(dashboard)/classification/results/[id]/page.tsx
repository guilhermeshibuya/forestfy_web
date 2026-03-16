'use client'

import { CLASSIFICATION_MESSAGES } from '@/constants/classification_messages'
import { useClassificationResults } from '@/hooks/use-classification-results'
import { useParams } from 'next/navigation'
import { ConfidenceBadge } from '../../(components)/confidence-badge'
import { Separator } from '@/components/ui/separator'
import { getConfidenceLevel } from '../../(utils)/get-confidence-level'
import Image from 'next/image'

const borderColors = {
  high: 'border-green-500',
  medium: 'border-yellow-500',
  low: 'border-red-500',
}

export default function ClassificationDetailsPage() {
  const params = useParams()
  const id = params.id as string

  const { data } = useClassificationResults(id)
  const topPrediction = data?.predictions[0]
  const otherPredictions = data?.predictions.slice(1)
  const confidenceLevel = topPrediction
    ? getConfidenceLevel(topPrediction.score)
    : null
  const borderColorClass = borderColors[confidenceLevel || 'low']

  if (!data) {
    return <div></div>
  }

  return (
    <main className="grid grid-cols-[2fr_1fr] gap-8">
      <section className="bg-zinc-50 p-4 rounded-lg shadow space-y-8">
        <div className="grid grid-cols-2">
          <h2 className="text-xl font-semibold text-zinc-800">
            {CLASSIFICATION_MESSAGES.RESULTS_TITLE}
          </h2>

          <Image
            src={data.original_image_url}
            alt="Original image used for classification"
            width={192}
            height={192}
            className="justify-self-end row-span-2 size-48 rounded-lg max-w-full h-auto aspect-square"
            unoptimized
          />

          {topPrediction && (
            <div
              className={`self-end flex flex-col border-l-4 pl-4 ${borderColorClass}`}
            >
              <div className="flex items-center gap-4">
                <h3 className="text-5xl font-semibold">
                  {(topPrediction.score * 100).toFixed(2)}%
                </h3>
                <ConfidenceBadge score={topPrediction.score} />
              </div>
              <span className="text-4xl font-semibold text-zinc-700">
                {topPrediction.scientific_name}
              </span>
              <span className="text-zinc-600 mt-2">
                Principal correspondência encontrada
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="text-zinc-700">
          <h3 className="font-semibold">
            {CLASSIFICATION_MESSAGES.OTHER_PREDICTIONS_TITLE}
          </h3>

          <ol className="mt-4 max-w-96 space-y-2">
            {otherPredictions?.map((prediction, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{prediction.scientific_name}</span>
                <span className="font-semibold">
                  {(prediction.score * 100).toFixed(2)}%
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-zinc-50 p-4 rounded-lg shadow"></section>

      <section className="col-span-2 bg-zinc-50 p-4 rounded-lg shadow"></section>
    </main>
  )
}
