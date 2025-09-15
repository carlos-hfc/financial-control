import { PiggyBankIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/button"
import { cn } from "@/utils/cn"
import { formatCurrency } from "@/utils/formatters"

interface AccountProps {
  account: {
    id: string
    name: string
    type: "corrente" | "poupanca" | "credito"
    currentBalance: number
  }
}

export function Account({ account }: AccountProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border-l-4 p-6 space-y-4 relative group",
        account.type === "corrente" && "border-l-emerald-500",
        account.type === "credito" && "border-l-rose-500",
        account.type === "poupanca" && "border-l-blue-500",
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="invisible group-hover:visible absolute right-6 size-10 hover:bg-rose-500/10"
      >
        <Trash2Icon className="size-5 text-rose-500" />
      </Button>

      <div
        className={cn(
          "size-12 rounded-xl flex items-center justify-center",
          account.type === "corrente" && "bg-emerald-100",
          account.type === "credito" && "bg-rose-100",
          account.type === "poupanca" && "bg-blue-100",
        )}
      >
        <PiggyBankIcon
          className={cn(
            "size-6",
            account.type === "corrente" && "text-emerald-500",
            account.type === "credito" && "text-rose-500",
            account.type === "poupanca" && "text-blue-500",
          )}
        />
      </div>

      <div>
        <h3 className="font-semibold text-zinc-800">{account.name}</h3>
        <p className="text-2xl font-bold">
          {formatCurrency(account.currentBalance)}
        </p>
      </div>
    </div>
  )
}
