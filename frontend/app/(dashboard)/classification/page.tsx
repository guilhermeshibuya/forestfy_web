'use client'

import { useState } from 'react'
import { Dropzone } from './(components)/dropzone'
import { Button } from '@/components/ui/button'
import { Focus, Search, Sun } from 'lucide-react'
import { CLASSIFICATION_MESSAGES } from '@/constants/classification-messages'
import { useRouter } from 'next/navigation'
import { APP_ROUTES } from '@/constants/app-routes'
import { useRecentActivities } from '@/hooks/use-recent-activities'
import { RecentActivityCard } from '../(components)/recent-activity-card'
import { useClassification } from '@/hooks/use-classification'
import { toast } from 'sonner'

export default function ClassificationPage() {
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const { data } = useRecentActivities()
  const classificaton = useClassification()

  const recentActivities = data?.data ?? []

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    if (!file) {
      toast.error('Por favor, selecione um arquivo para classificação.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await classificaton.mutateAsync(file)
      setFile(null)
      router.push(
        `${APP_ROUTES.CLASSIFICATION_RESULTS}/${response.classification_id}`,
      )
    } catch {
      toast.error('Ocorreu um erro ao classificar a imagem. Tente novamente.')
    }
  }

  return (
    <div className="grid grid-cols-[4fr_3fr] gap-8">
      <main className="row-span-3">
        <form onSubmit={handleSubmit} className="h-full">
          <Dropzone
            file={file}
            onFileSelect={setFile}
            button={
              <Button type="submit" disabled={!file} className="w-full mt-6">
                <Search /> {CLASSIFICATION_MESSAGES.CLASSIFY_FORM_BUTTON_LABEL}
              </Button>
            }
          />
        </form>
      </main>
      <section className="p-4 bg-zinc-50 shadow-sm rounded-xl">
        <h3 className="text-xl text-green-900 font-semibold">
          {CLASSIFICATION_MESSAGES.TIPS_TITLE}
        </h3>
        <ul className="text-zinc-700 mt-2 space-y-2 *:flex *:items-center *:gap-2">
          <li>
            <Sun className="text-yellow-500" /> {CLASSIFICATION_MESSAGES.TIP_1}
          </li>
          <li>
            <Focus className="text-blue-500" /> {CLASSIFICATION_MESSAGES.TIP_2}
          </li>
        </ul>
      </section>
      <section className="p-4 bg-zinc-50 shadow-sm rounded-xl row-span-2">
        <h3 className="text-xl text-green-900 font-semibold">
          {CLASSIFICATION_MESSAGES.LAST_ANALYSIS_TITLE}
        </h3>
        <ol className="text-zinc-700 mt-2 space-y-2">
          {recentActivities?.length === 0 ? (
            <p className="text-zinc-600">
              {CLASSIFICATION_MESSAGES.NO_RECENT_ACTIVITIES}
            </p>
          ) : (
            recentActivities?.map((activity) => (
              <li key={activity.classification_id}>
                {activity.original_image_url &&
                activity.original_image_url !== '' ? (
                  <RecentActivityCard
                    original_image_url={activity.original_image_url}
                    classification_date={activity.classification_date}
                    scientific_name={activity.top_prediction.scientific_name}
                    score={activity.top_prediction.score}
                  />
                ) : (
                  <div className="bg-zinc-400 size-20 rounded-md" />
                )}
              </li>
            ))
          )}
        </ol>
      </section>
    </div>
  )
}
