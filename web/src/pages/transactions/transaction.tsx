import { addHours, format } from "date-fns"
import { PiggyBankIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/button"
import { ListAccountsResponse } from "@/http/list-accounts"
import { ListCategoriesResponse } from "@/http/list-categories"
import { cn } from "@/utils/cn"
import { formatCurrency } from "@/utils/formatters"

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
  return (
    <div className="flex items-center justify-between group hover:bg-zinc-50 px-6 py-4">
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
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>{transaction.category.name}</span>
            <span>&bull;</span>
            <span>{transaction.account.name}</span>
            <span>&bull;</span>
            <span>{format(addHours(new Date(transaction.date), 3), "P")}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
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

        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity size-10 hover:bg-rose-500/10"
        >
          <Trash2Icon className="size-5 text-rose-500" />
        </Button>
      </div>
    </div>
  )
}
