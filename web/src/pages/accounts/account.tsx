import { useMutation } from "@tanstack/react-query"
import { EditIcon, PiggyBankIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Alert } from "@/components/alert-dialog"
import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { deleteAccount } from "@/http/delete-account"
import { ListAccountsResponse } from "@/http/list-accounts"
import { queryClient } from "@/lib/react-query"
import { cn } from "@/utils/cn"
import { formatCurrency } from "@/utils/formatters"

import { AccountDialog } from "./account-dialog"
import { DeleteAccountDialog } from "./delete-account-dialog"

interface AccountProps {
  account: {
    id: string
    name: string
    type: string
    currentBalance: number
  }
}

export function Account({ account }: AccountProps) {
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false)

  const { mutateAsync: deleteAccountFn, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccount,
    async onSuccess(_, { accountId }) {
      const cached = queryClient.getQueryData<ListAccountsResponse[]>([
        "accounts",
      ])

      if (cached) {
        queryClient.setQueryData(
          ["accounts"],
          cached.filter(item => item.id !== accountId),
        )
      }
    },
  })

  async function handleDeleteAccount() {
    try {
      await deleteAccountFn({
        accountId: account.id,
      })

      toast.success("Conta excluída com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir sua conta, tente novamente")
    }
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border-l-4 p-6 space-y-4 relative group",
        account.type === "corrente" && "border-l-emerald-500",
        account.type === "credito" && "border-l-rose-500",
        account.type === "poupanca" && "border-l-blue-500",
      )}
    >
      <div className="invisible group-hover:visible absolute right-6 flex items-center gap-2">
        <Dialog
          open={isEditAccountOpen}
          onOpenChange={setIsEditAccountOpen}
        >
          <Dialog.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="size-10 hover:bg-zinc-500/10"
            >
              <EditIcon className="size-5" />
            </Button>
          </Dialog.Trigger>

          <AccountDialog
            isEdit
            open={isEditAccountOpen}
            accountId={account.id}
          />
        </Dialog>

        <Alert>
          <Alert.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="size-10 hover:bg-rose-500/10"
            >
              <Trash2Icon className="size-5 text-rose-500" />
            </Button>
          </Alert.Trigger>

          <DeleteAccountDialog
            onDelete={handleDeleteAccount}
            disabledOnDelete={isDeleting}
          />
        </Alert>
      </div>
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
