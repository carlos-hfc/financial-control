import { useQuery } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { PageTitle } from "@/components/page-title"
import { Select } from "@/components/select"
import { Skeleton } from "@/components/skeleton"
import { listCategories } from "@/http/list-categories"
import { listTransactions } from "@/http/list-transactions"

import { Transaction } from "./transaction"
import { TransactionDialog } from "./transaction-dialog"
import { TransactionSkeleton } from "./transaction-skeleton"

export function Transactions() {
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: listTransactions,
  })

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })

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

      <div className="bg-white shadow-sm rounded-2xl border border-zinc-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 *:w-full">
          {isLoadingCategories ? (
            <>
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </>
          ) : (
            <>
              <Select>
                <Select.Trigger>
                  <Select.Value placeholder="Tipo de transação" />
                </Select.Trigger>

                <Select.Content>
                  <Select.Item value="income">Receita</Select.Item>
                  <Select.Item value="outcome">Despesa</Select.Item>
                </Select.Content>
              </Select>

              <Select>
                <Select.Trigger>
                  <Select.Value placeholder="Categoria" />
                </Select.Trigger>

                <Select.Content>
                  {categories?.map(category => (
                    <Select.Item
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h3 className="text-lg font-semibold text-zinc-800">
            Histórico de Transações ({transactions?.length ?? 0})
          </h3>
        </div>

        <div className="divide-y divide-zinc-100">
          {isLoadingTransactions &&
            Array.from({ length: 4 }).map((_, i) => (
              <TransactionSkeleton key={i} />
            ))}

          {transactions?.map(transaction => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
