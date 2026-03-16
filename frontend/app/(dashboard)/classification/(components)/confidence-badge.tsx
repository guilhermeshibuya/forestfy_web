import { Badge } from '@/components/ui/badge'
import { ShieldAlert, ShieldCheck, ShieldQuestionMark } from 'lucide-react'
import { getConfidenceLevel } from '../(utils)/get-confidence-level'

type ConfidenceBadgeProps = {
  score: number
}

const badgeVariants = {
  low: {
    style: 'bg-red-100 text-red-800',
    label: 'Confiança baixa',
    icon: ShieldCheck,
  },
  medium: {
    style: 'bg-yellow-100 text-yellow-800',
    label: 'Confiança média',
    icon: ShieldQuestionMark,
  },
  high: {
    style: 'bg-green-100 text-green-800',
    label: 'Confiança alta',
    icon: ShieldAlert,
  },
}

export function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const level = getConfidenceLevel(score)
  const { style, label, icon: Icon } = badgeVariants[level]

  return (
    <Badge
      className={`${style} px-2.5 py-1 text-sm [&>svg]:size-4`}
      data-icon="inline-start"
    >
      <Icon />
      {label}
    </Badge>
  )
}
