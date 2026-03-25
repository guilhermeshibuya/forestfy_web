import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Dispatch, SetStateAction } from 'react'

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

type GeneratePaginationProps = {
  page: number
  totalPages: number
  setPage: Dispatch<SetStateAction<number>>
}

export function GeneratePagination({
  page,
  totalPages,
  setPage,
}: GeneratePaginationProps) {
  return (
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
  )
}
