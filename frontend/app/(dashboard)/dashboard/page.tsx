'use client'

import { BookOpen, ChartNoAxesColumn, Leaf } from 'lucide-react'
import { StatsCard } from './(components)/stats-card'
import { useDashboard } from '@/hooks/use-dashboard'

export default function DashboardPage() {
  const { data: stats } = useDashboard()

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
    <div>
      <div className="flex justify-between items-center gap-8">
        {cards.map(({ id, icon: Icon, label, value }) => (
          <StatsCard
            key={id}
            icon={<Icon className="text-green-600" size={32} />}
            label={label}
            value={value}
          />
        ))}
      </div>
    </div>
  )
}
