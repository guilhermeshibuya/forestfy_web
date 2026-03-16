import Image from 'next/image'

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
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {original_image_url && original_image_url !== '' ? (
          <Image
            src={original_image_url}
            alt="Original image used for classification"
            width={85}
            height={65}
            className="rounded-md object-cover"
            unoptimized
          />
        ) : (
          <div className="bg-zinc-400 size-20 rounded-md" />
        )}

        <div className="flex flex-col">
          <p className="text-zinc-800 font-semibold">{scientific_name}</p>
          <p className="text-zinc-600 text-sm">
            Classificado em: {classification_date.toString()}
          </p>
        </div>
      </div>
      <p className="text-green-600 font-semibold">
        {(score * 100)?.toFixed(2)}%
      </p>
    </div>
  )
}
