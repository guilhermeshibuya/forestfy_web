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
import { GeneratePagination } from '../(components)/generate-pagination'
import { Logo } from '@/components/logo'

const PAGE_SIZE = 10

export default function HistoryPage() {
  const [page, setPage] = useState(1)
  const offset = (page - 1) * PAGE_SIZE

  const { data, isLoading } = useRecentActivities(PAGE_SIZE, offset)
  const activities = data?.data
  const total = data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Logo
          width={260}
          height={91}
          textColor="#4ADE80"
          className="animate-pulse"
        />
      </div>
    )
  }

  return (
    <>
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

      <GeneratePagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </>
  )
}
