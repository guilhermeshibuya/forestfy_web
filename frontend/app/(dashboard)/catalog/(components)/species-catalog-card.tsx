import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CATALOG_MESSAGES } from '@/constants/catalog-mesages'
import Image from 'next/image'
import Link from 'next/link'

type SpeciesCatalogCardProps = {
  species_id: string
  scientificName: string
  popularName: string
  biomes: string[]
  description: string
  imageUrl: string
}

export function SpeciesCatalogCard({
  species_id,
  scientificName,
  popularName,
  biomes,
  description,
  imageUrl,
}: SpeciesCatalogCardProps) {
  return (
    <section className="max-w-md rounded-lg overflow-hidden bg-zinc-50 border border-zinc-900/10">
      <div className="grid">
        <Image
          src={imageUrl}
          width={800}
          height={450}
          alt=""
          className="w-full aspect-video object-cover col-start-1 row-start-1"
          unoptimized
        />
        {/* <Badge
          variant="destructive"
          className="col-start-1 row-start-1 justify-self-end self-start m-4"
        >
          CITES II
        </Badge> */}
      </div>
      <div className="p-4">
        <h5 className="font-semibold font-title-display text-green-900 text-xl">
          {popularName}
        </h5>
        <p className="text-zinc-700 italic mt-1">{scientificName}</p>
        <div className="flex items-center flex-wrap gap-2 mt-4">
          <Badge className="bg-green-100 text-green-900">Bioma 1</Badge>
          <Badge className="bg-green-100 text-green-900">Bioma 2</Badge>
        </div>
        <p className="text-zinc-700 text-sm mt-4">
          Descricao legal Lorem ipsum dolor, sit amet consectetur adipisicing
          elit. Sapiente quia aut libero eius, cupiditate veniam pariatur eos
          dicta. Odit rerum laudantium soluta cumque fugit quos repellat
          nesciunt ipsam alias at.
        </p>
      </div>
      <div className="border-t border-zinc-900/10 p-4">
        <Link href={`/catalog/${species_id}`}>
          <Button className="w-full">
            {CATALOG_MESSAGES.VIEW_DETAILS}
          </Button>{' '}
        </Link>
      </div>
    </section>
  )
}
