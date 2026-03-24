import Image from 'next/image'

type SpeciesCardProps = {
  imageUrl: string
  speciesName: string
}

export function SpeciesCard({ imageUrl, speciesName }: SpeciesCardProps) {
  return (
    <div className="space-y-3">
      <Image
        src={imageUrl}
        alt={speciesName}
        width={400}
        height={300}
        unoptimized
        className="w-full h-75 object-cover rounded-lg mb-2"
      />
      <p className="text-zinc-800 font-semibold text-lg">{speciesName}</p>
    </div>
  )
}
