type StatsCardProps = {
  icon: React.ReactNode
  label: string
  value: string | number
}

export function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <div className="flex flex-col items-start bg-zinc-50 gap-1 rounded-lg p-4 flex-1 shadow">
      {icon}
      <span className="text-2xl font-semibold text-zinc-800">
        {value ?? '-'}
      </span>
      <span className="text-zinc-600">{label}</span>
    </div>
  )
}
