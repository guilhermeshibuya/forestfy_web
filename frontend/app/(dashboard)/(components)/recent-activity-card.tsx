import Image from 'next/image'
import dayjs from 'dayjs'
import { getConfidenceLevel } from '../classification/(utils)/get-confidence-level'

type RecentActivityCardProps = {
  classification_date: Date
  scientific_name: string
  score: number
  original_image_url: string
}

export function RecentActivityCard({
  classification_date,
  scientific_name,
  score,
  original_image_url,
}: RecentActivityCardProps) {
  const confidenceLevel = getConfidenceLevel(score)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {original_image_url && original_image_url !== '' ? (
          <Image
            src={original_image_url}
            alt="Original image used for classification"
            className="object-cover object-center rounded-md w-21.25 h-16.25"
            width={85}
            height={65}
            unoptimized
          />
        ) : (
          <div className="bg-zinc-400 size-20 rounded-md" />
        )}

        <div className="flex flex-col">
          <p className="text-zinc-800 font-semibold">{scientific_name}</p>
          <p className="text-zinc-600 text-sm">
            Classificado em:{' '}
            {dayjs(classification_date).format('DD/MM/YYYY HH:mm')}
          </p>
        </div>
      </div>
      <p
        className={`font-semibold ${confidenceLevel === 'high' ? 'text-green-600' : confidenceLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}
      >
        {(score * 100)?.toFixed(2)}%
      </p>
    </div>
  )
}
