'use client'

import { BookOpen, ChartNoAxesColumn, Leaf } from 'lucide-react'
import { StatsCard } from './(components)/stats-card'
import { useDashboard } from '@/hooks/use-dashboard'
import { useRecentActivities } from '@/hooks/use-recent-activities'
import { RecentActivityCard } from '../(components)/recent-activity-card'
import { CLASSIFICATION_MESSAGES } from '@/constants/classification_messages'

export default function DashboardPage() {
  const { data: stats } = useDashboard()
  const { data: recentActivities } = useRecentActivities()

  const cards = [
    {
      id: 'total-classifications',
      icon: Leaf,
      label: 'Total de classificações',
      value: stats?.total_classifications ?? '-',
    },
    {
      id: 'species-identified',
      icon: BookOpen,
      label: 'Espécies identificadas',
      value: stats?.total_species_identified ?? '-',
    },
    {
      id: 'avg-accuracy',
      icon: ChartNoAxesColumn,
      label: 'Acurácia média',
      value:
        stats?.avg_accuracy != null
          ? `${(stats.avg_accuracy * 100).toFixed(2)}%`
          : '-',
    },
  ]

  return (
    <main className="grid grid-cols-3 gap-8">
      {cards.map(({ id, icon: Icon, label, value }) => (
        <StatsCard
          key={id}
          icon={<Icon className="text-green-600" size={32} />}
          label={label}
          value={value}
        />
      ))}

      <div className="bg-zinc-50 p-4 rounded-lg shadow col-span-2">
        <h2 className="text-zinc-800 font-semibold mb-6">
          Atividades recentes
        </h2>
        <div>
          {recentActivities?.length === 0 ? (
            <p className="text-zinc-600">
              {CLASSIFICATION_MESSAGES.NO_RECENT_ACTIVITIES}
            </p>
          ) : (
            <ol className="space-y-4">
              {recentActivities?.map((activity) => (
                <li key={activity.classification_id}>
                  <RecentActivityCard
                    classification_date={activity.classification_date}
                    scientific_name={activity.top_prediction.scientific_name}
                    original_image_url={activity.original_image_url}
                    score={activity.top_prediction.score}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="bg-zinc-50 p-4 rounded-lg shadow"></div>
    </main>
  )
}
