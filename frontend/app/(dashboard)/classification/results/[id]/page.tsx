'use client'

import { CLASSIFICATION_MESSAGES } from '@/constants/classification-messages'
import { useClassificationResults } from '@/hooks/use-classification-results'
import { useParams } from 'next/navigation'
import { ConfidenceBadge } from '../../(components)/confidence-badge'
import { Separator } from '@/components/ui/separator'
import { getConfidenceLevel } from '../../(utils)/get-confidence-level'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { CircleQuestionMark, FileText, RotateCcw } from 'lucide-react'
import { TOOLTIP_CONFIDENCE_MESSAGES } from '../../(constants)/tooltip-confidence'
import Link from 'next/link'
import { APP_ROUTES } from '@/constants/app-routes'
import { SpeciesCard } from '../../(components)/specieds-card'
import { useSpeciesImageByIdList } from '@/hooks/use-species-image'
import { useMemo } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ClassificationReport } from '@/components/pdf/classification-report'

const borderColors = {
  high: 'border-green-500',
  medium: 'border-yellow-500',
  low: 'border-red-500',
}

export default function ClassificationDetailsPage() {
  const params = useParams()
  const id = params.id as string

  const { data: classificationResults } = useClassificationResults(id)
  const topPrediction = classificationResults?.predictions[0]
  const otherPredictions = classificationResults?.predictions.slice(1)

  const confidenceLevel = topPrediction
    ? getConfidenceLevel(topPrediction.score)
    : null
  const borderColorClass = borderColors[confidenceLevel || 'low']
  const tooltipContent = TOOLTIP_CONFIDENCE_MESSAGES[confidenceLevel || 'low']

  const speciesIds = useMemo(() => {
    return (
      classificationResults?.predictions.map(
        (prediction) => prediction.species_id,
      ) || []
    )
  }, [classificationResults])

  const { data: speciesImages } = useSpeciesImageByIdList(speciesIds)
  const speciesImagesMap = new Map(
    speciesImages?.map((img) => [img.species_id, img.image_url]) || [],
  )

  if (!classificationResults) {
    return <div></div>
  }

  return (
    <main className="grid grid-cols-[2fr_1fr] gap-8">
      <section className="bg-zinc-50 p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-2">
          <h2 className="text-xl font-semibold text-zinc-700">
            {CLASSIFICATION_MESSAGES.RESULTS_TITLE}
          </h2>

          <Image
            src={classificationResults.original_image_url}
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <CircleQuestionMark className="text-zinc-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[60ch] text-balance">
                      {tooltipContent}
                    </p>
                  </TooltipContent>
                </Tooltip>
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

        <Separator />

        <div className="flex items-center gap-4">
          <Link href={APP_ROUTES.CLASSIFICATION}>
            <Button>
              <RotateCcw /> {CLASSIFICATION_MESSAGES.ANALYZE_AGAIN_BUTTON_LABEL}
            </Button>
          </Link>
          <PDFDownloadLink
            document={<ClassificationReport data={classificationResults} />}
            fileName={`classification_report_${classificationResults.classification_id}.pdf`}
          >
            {({ loading }) => (
              <Button variant="secondary">
                <FileText />
                {loading
                  ? CLASSIFICATION_MESSAGES.GENERATE_REPORT_LOADING_LABEL
                  : CLASSIFICATION_MESSAGES.GENERATE_REPORT_BUTTON_LABEL}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </section>

      <section className="bg-zinc-50 p-4 rounded-lg shadow"></section>

      <section className="col-span-2 bg-zinc-50 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold text-zinc-700 mb-6">
          {CLASSIFICATION_MESSAGES.EXAMPLES_TITLE}
        </h2>
        <Carousel className="w-full">
          <CarouselContent>
            {speciesImages?.length
              ? classificationResults.predictions.map((prediction) => {
                  const imageUrl =
                    speciesImagesMap.get(prediction.species_id) || '/avatar.jpg'

                  return (
                    <CarouselItem
                      key={prediction.species_id}
                      className="basis-[28%] pl-8"
                    >
                      <SpeciesCard
                        imageUrl={imageUrl}
                        speciesName={prediction.scientific_name}
                      />
                    </CarouselItem>
                  )
                })
              : null}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  )
}
