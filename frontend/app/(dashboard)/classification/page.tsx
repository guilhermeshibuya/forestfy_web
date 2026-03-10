'use client'

import { useState } from 'react'
import { Dropzone } from './(components)/dropzone'
import { api, classificationEndpoint } from '@/utils/api'
import { ClassificationResultResponse } from '@/types/classification'
import { Button } from '@/components/ui/button'
import { Focus, Search, Sun } from 'lucide-react'
import { CLASSIFICATION_MESSAGES } from '@/constants/classification_messages'
import { useRouter } from 'next/navigation'
import { APP_ROUTES } from '@/constants/app-routes'

export default function ClassificationPage() {
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    if (!file) {
      // toast
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api<ClassificationResultResponse>(
        classificationEndpoint(),
        {
          method: 'POST',
          body: formData,
        },
      )
      setFile(null)
      router.push(
        `${APP_ROUTES.CLASSIFICATION_RESULTS}/${response.classification_id}`,
      )
    } catch (error) {
      // toast
    }
  }
  return (
    <div className="grid grid-cols-[4fr_3fr] gap-8">
      <form onSubmit={handleSubmit} className="row-span-3">
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
      <div className="p-8 bg-zinc-50 shadow-sm rounded-xl">
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
      </div>
      <div className="p-8 bg-zinc-50 shadow-sm rounded-xl row-span-2">
        <h3 className="text-xl text-green-900 font-semibold">
          {CLASSIFICATION_MESSAGES.LAST_ANALYSIS_TITLE}
        </h3>
        <ol className="text-zinc-700 mt-2 space-y-2">
          <li>Analysis 1</li>
          <li>Analysis 2</li>
          <li>Analysis 3</li>
        </ol>
      </div>
    </div>
  )
}
