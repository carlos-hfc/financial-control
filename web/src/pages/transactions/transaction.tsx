import { useMutation } from "@tanstack/react-query"
import { addHours, format } from "date-fns"
import { EditIcon, PiggyBankIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Alert } from "@/components/alert-dialog"
import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { deleteTransaction } from "@/http/delete-transaction"
import { ListAccountsResponse } from "@/http/list-accounts"
import { ListCategoriesResponse } from "@/http/list-categories"
import { queryClient } from "@/lib/react-query"
import { cn } from "@/utils/cn"
import { formatCurrency } from "@/utils/formatters"

import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { TransactionDialog } from "./transaction-dialog"

interface TransactionProps {
  transaction: {
    id: string
    categoryId: string
    accountId: string
    type: string
    value: number
    description: string
    date: string
    category: ListCategoriesResponse
    account: ListAccountsResponse
  }
}

export function Transaction({ transaction }: TransactionProps) {
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false)

  const { mutateAsync: deleteTransactionFn, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteTransaction,
      async onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
        queryClient.invalidateQueries({ queryKey: ["metrics"] })
        queryClient.invalidateQueries({ queryKey: ["accounts"] })
      },
    })

  async function handleDeleteTransaction() {
    try {
      await deleteTransactionFn({
        transactionId: transaction.id,
      })

      toast.success("Transação excluída com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir sua transação, tente novamente")
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 group hover:bg-zinc-50 px-6 py-4">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "size-12 rounded-xl flex items-center justify-center",
            transaction.type === "income" && "bg-emerald-100",
            transaction.type === "expense" && "bg-rose-100",
          )}
        >
          <PiggyBankIcon
            className={cn(
              "size-6",
              transaction.type === "income" && "text-emerald-500",
              transaction.type === "expense" && "text-rose-500",
            )}
          />
        </div>

        <div>
          <h4 className="font-medium text-zinc-800">
            {transaction.description}
          </h4>
          <div className="flex items-center gap-2 text-sm text-zinc-500 flex-wrap">
            <span>{transaction.category.name}</span>
            <span>&bull;</span>
            <span>{transaction.account.name}</span>
            <span>&bull;</span>
            <span>{format(addHours(new Date(transaction.date), 3), "P")}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-4 md:ml-auto">
        <p
          className={cn(
            "text-lg text-right font-semibold",
            transaction.type === "income" && "text-emerald-600",
            transaction.type === "expense" && "text-rose-500",
          )}
        >
          {transaction.type === "income" ? "+" : "-"}{" "}
          {formatCurrency(transaction.value)}
        </p>

        <div className="flex items-center gap-2">
          <Dialog
            open={isEditTransactionOpen}
            onOpenChange={setIsEditTransactionOpen}
          >
            <Dialog.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity size-10"
              >
                <EditIcon className="size-5" />
              </Button>
            </Dialog.Trigger>

            <TransactionDialog
              isEdit
              open={isEditTransactionOpen}
              onOpenChange={setIsEditTransactionOpen}
              transactionId={transaction.id}
            />
          </Dialog>

          <Alert>
            <Alert.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity size-10 hover:bg-rose-500/10"
              >
                <Trash2Icon className="size-5 text-rose-500" />
              </Button>
            </Alert.Trigger>

            <DeleteTransactionDialog
              onDelete={handleDeleteTransaction}
              disabledOnDelete={isDeleting}
            />
          </Alert>
        </div>
      </div>
    </div>
  )
}
