'use client'

import { useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Point } from './(types)/point'
import { useSegmentImage } from '@/hooks/use-segment-image'
import { normalizeImage } from './(utils)/normalize-image'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  CircleQuestionMark,
  Download,
  Paintbrush,
  ScanLine,
  Upload,
} from 'lucide-react'
import { SEGMENTATION_MESSAGES } from '@/constants/segmentation-messages'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

function getImageLayout(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number,
) {
  const scale = Math.min(
    containerWidth / naturalWidth,
    containerHeight / naturalHeight,
  )

  const renderedWidth = naturalWidth * scale
  const renderedHeight = naturalHeight * scale

  const offsetX = (containerWidth - renderedWidth) / 2
  const offsetY = (containerHeight - renderedHeight) / 2

  return { scale, renderedWidth, renderedHeight, offsetX, offsetY }
}

export default function SegmentationPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [points, setPoints] = useState<Point[]>([])
  const [maskUrl, setMaskUrl] = useState<string | null>(null)
  const [imageMeta, setImageMeta] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
    displayWidth: 0,
    displayHeight: 0,
  })

  const imgRef = useRef<HTMLImageElement | null>(null)

  const { mutate: segmentImage, isPending } = useSegmentImage()

  const handleFile = async (file: File) => {
    const normalized = await normalizeImage(file)

    setFile(normalized)
    setImageUrl(URL.createObjectURL(normalized))
    setPoints([])
    setMaskUrl(null)
  }

  const downloadMask = (url: string, filename: string = 'mask.png') => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!imgRef.current) return
    if (!imageMeta.displayWidth) return

    if (e.button !== 0 && e.button !== 2) return
    if (e.button === 2) e.preventDefault()

    const rect = e.currentTarget.getBoundingClientRect()

    const { renderedWidth, renderedHeight, offsetX, offsetY } = getImageLayout(
      rect.width,
      rect.height,
      imageMeta.naturalWidth,
      imageMeta.naturalHeight,
    )

    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    if (
      clickX < offsetX ||
      clickX > offsetX + renderedWidth ||
      clickY < offsetY ||
      clickY > offsetY + renderedHeight
    ) {
      return
    }

    const x = ((clickX - offsetX) / renderedWidth) * imageMeta.naturalWidth
    const y = ((clickY - offsetY) / renderedHeight) * imageMeta.naturalHeight

    const label = e.button === 0 ? 1 : 0

    setPoints((prev) => [...prev, { x, y, label }])
  }

  const handleSegment = () => {
    if (!file) return

    segmentImage(
      { file, points },
      {
        onSuccess: (data) => {
          setMaskUrl(data.maskUrl)
        },
      },
    )
  }

  const layout = imageMeta.displayWidth
    ? getImageLayout(
        imageMeta.displayWidth,
        imageMeta.displayHeight,
        imageMeta.naturalWidth,
        imageMeta.naturalHeight,
      )
    : null

  return (
    <main className="space-y-8">
      <section className="space-y-4 p-4 bg-zinc-50 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-zinc-800 text-lg">
            {SEGMENTATION_MESSAGES.TOOLS}
          </h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <CircleQuestionMark className="text-zinc-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="space-y-1 max-w-[60ch] text-balance">
              <h3 className="font-semibold">
                {SEGMENTATION_MESSAGES.TOOLTIP_TEXT_1}
              </h3>
              <p>{SEGMENTATION_MESSAGES.TOOLTIP_TEXT_2}</p>
              <p>{SEGMENTATION_MESSAGES.TOOLTIP_TEXT_3}</p>
              <p>{SEGMENTATION_MESSAGES.TOOLTIP_TEXT_4}</p>
              <p>{SEGMENTATION_MESSAGES.TOOLTIP_TEXT_5}</p>
              <p>{SEGMENTATION_MESSAGES.TOOLTIP_TEXT_6}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4">
          <InputGroup className="w-auto">
            <InputGroupAddon>
              <Upload />
            </InputGroupAddon>
            <InputGroupInput
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0])
                }
              }}
            />
          </InputGroup>
          <Button
            variant="secondary"
            disabled={!points.length}
            onClick={() => setPoints([])}
          >
            <Paintbrush />
            {SEGMENTATION_MESSAGES.CLEAR_POINTS_BUTTON}
          </Button>

          <Button
            variant="secondary"
            disabled={!maskUrl}
            onClick={() => setMaskUrl(null)}
          >
            <Paintbrush />
            {SEGMENTATION_MESSAGES.CLEAR_MASK_BUTTON}
          </Button>

          <Button
            variant="secondary"
            onClick={handleSegment}
            disabled={!file || !points.length || isPending}
          >
            <ScanLine />
            {isPending
              ? SEGMENTATION_MESSAGES.SEGMENT_LOADING_MESSAGE
              : SEGMENTATION_MESSAGES.SEGMENT_IMAGE_BUTTON}
          </Button>

          <Button
            variant="secondary"
            disabled={!maskUrl}
            onClick={() => downloadMask(maskUrl!)}
          >
            <Download />
            {SEGMENTATION_MESSAGES.SAVE_MASK_BUTTON}
          </Button>
        </div>
      </section>
      <div className="relative flex justify-center w-full max-h-200 aspect-video bg-zinc-800 rounded-xl overflow-hidden ">
        {imageUrl && (
          <>
            <Image
              className="object-contain w-full h-full cursor-crosshair"
              ref={imgRef}
              src={imageUrl}
              fill
              onClick={handleClick}
              onContextMenu={handleClick}
              alt={SEGMENTATION_MESSAGES.IMAGE_ALT}
              onLoad={(e: SyntheticEvent<HTMLImageElement>) => {
                const element = e.currentTarget
                const rect = element.getBoundingClientRect()

                setImageMeta({
                  naturalWidth: element.naturalWidth,
                  naturalHeight: element.naturalHeight,
                  displayWidth: rect.width,
                  displayHeight: rect.height,
                })
              }}
            />
            {maskUrl && layout && (
              <Image
                src={maskUrl}
                alt={SEGMENTATION_MESSAGES.MASK_IMAGE_ALT}
                width={Math.round(layout.renderedWidth)}
                height={Math.round(layout.renderedHeight)}
                style={{
                  position: 'absolute',
                  left: layout.offsetX,
                  top: layout.offsetY,
                  width: layout.renderedWidth,
                  height: layout.renderedHeight,
                  pointerEvents: 'none',
                }}
              />
            )}
            {points.map((point, index) => {
              if (!layout) return null

              const x =
                (point.x / imageMeta.naturalWidth) * layout.renderedWidth +
                layout.offsetX
              const y =
                (point.y / imageMeta.naturalHeight) * layout.renderedHeight +
                layout.offsetY

              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: point.label === 1 ? 'blue' : 'red',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                />
              )
            })}
          </>
        )}
      </div>
    </main>
  )
}
