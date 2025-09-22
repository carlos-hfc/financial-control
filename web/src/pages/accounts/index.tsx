import { useQuery } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { PageTitle } from "@/components/page-title"
import { listAccounts } from "@/http/list-accounts"

import { Account } from "./account"
import { AccountDialog } from "./account-dialog"
import { AccountSkeleton } from "./account-skeleton"

export function Accounts() {
  const [openDialog, setOpenDialog] = useState(false)

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: listAccounts,
  })

  return (
    <div className="space-y-6">
      <Dialog
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <PageTitle
          title="Contas"
          description="Gerencie suas contas financeiras"
        >
          <Dialog.Trigger asChild>
            <Button>
              <PlusIcon className="size-4" />
              Nova Conta
            </Button>
          </Dialog.Trigger>
        </PageTitle>

        <AccountDialog onOpenChange={setOpenDialog} />
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingAccounts &&
          Array.from({ length: 3 }).map((_, i) => <AccountSkeleton key={i} />)}

        {accounts?.map(account => (
          <Account
            key={account.id}
            account={account}
          />
        ))}
      </div>
    </div>
  )
}
