import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "./button"

interface PaginationProps {
  pageIndex: number
  perPage: number
  totalCount: number
  onPageChange(pageIndex: number): Promise<void> | void
}

export function Pagination({
  onPageChange,
  pageIndex,
  perPage,
  totalCount,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-600">
        Total de {totalCount} item(s)
      </span>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Página {pageIndex + 1} de {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="size-8 !p-0"
            aria-label="Primeira página"
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
          >
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 !p-0"
            aria-label="Página anterior"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 !p-0"
            aria-label="Próxima página"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={totalPages <= pageIndex + 1}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 !p-0"
            aria-label="Última página"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={totalPages <= pageIndex + 1}
          >
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
