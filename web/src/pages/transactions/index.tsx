import { useQuery } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { useSearchParams } from "react-router"
import z from "zod"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { PageTitle } from "@/components/page-title"
import { Pagination } from "@/components/pagination"
import { listTransactions } from "@/http/list-transactions"

import { Transaction } from "./transaction"
import { TransactionDialog } from "./transaction-dialog"
import { TransactionFilters } from "./transaction-filters"
import { TransactionSkeleton } from "./transaction-skeleton"

export function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams()

  const type = searchParams.get("type")
  const category = searchParams.get("category")
  const account = searchParams.get("account")
  const pageIndex = z.coerce
    .number()
    .transform(page => page - 1)
    .parse(searchParams.get("page") ?? 1)

  const { data: result, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", pageIndex, type, category, account],
    queryFn: () => listTransactions({ pageIndex, type, category, account }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams(prev => {
      prev.set("page", String(pageIndex + 1))

      return prev
    })
  }

  return (
    <div className="space-y-6">
      <Dialog>
        <PageTitle
          title="Transações"
          description="Gerencie suas receitas e despesas"
        >
          <Dialog.Trigger asChild>
            <Button>
              <PlusIcon className="size-4" />
              Nova Transação
            </Button>
          </Dialog.Trigger>
        </PageTitle>

        <TransactionDialog />
      </Dialog>

      <TransactionFilters />

      <div className="bg-white shadow-sm rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h3 className="text-lg font-semibold text-zinc-800">
            Histórico de Transações
          </h3>
        </div>

        <div className="divide-y divide-zinc-100">
          {isLoadingTransactions &&
            Array.from({ length: 10 }).map((_, i) => (
              <TransactionSkeleton key={i} />
            ))}

          {result?.transactions?.map(transaction => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>

        {result && (
          <div className="px-6 py-4 border-t border-zinc-100">
            <Pagination
              onPageChange={handlePaginate}
              pageIndex={result.meta.pageIndex}
              perPage={result.meta.perPage}
              totalCount={result.meta.totalCount}
            />
          </div>
        )}
      </div>
    </div>
  )
}
