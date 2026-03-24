'use client'

import { useRecentActivities } from '@/hooks/use-recent-activities'
import Image from 'next/image'
import dayjs from 'dayjs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon } from 'lucide-react'
import { ConfidenceBadge } from '../classification/(components)/confidence-badge'
import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

function generatePages(current: number, total: number) {
  const pages: (number | '...')[] = []

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)

  return pages
}

const PAGE_SIZE = 10

export default function HistoryPage() {
  const [page, setPage] = useState(1)
  const offset = (page - 1) * PAGE_SIZE

  const { data, isLoading } = useRecentActivities(PAGE_SIZE, offset)
  const activities = data?.data
  const total = data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Imagem</TableHead>
            <TableHead>Nome científico</TableHead>
            <TableHead>Confiança</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Data da classificação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity) => (
            <TableRow key={activity.classification_id}>
              <TableCell>
                <Image
                  src={activity.original_image_url}
                  alt="Imagem da classificação"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded"
                  unoptimized
                />
              </TableCell>
              <TableCell>{activity.top_prediction.scientific_name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {(activity.top_prediction.score * 100).toFixed(2)}%
                  <ConfidenceBadge score={activity.top_prediction.score} />
                </div>
              </TableCell>
              <TableCell>
                {activity.location ?? '24.654321, 123.456789'}
              </TableCell>
              <TableCell>
                {dayjs(activity.classification_date).format('DD/MM/YYYY HH:mm')}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Baixar imagem</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            />
          </PaginationItem>
          {generatePages(page, totalPages).map((p, i) => (
            <PaginationItem key={i}>
              {p === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
