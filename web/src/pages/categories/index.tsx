import { PlusIcon } from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { PageTitle } from "@/components/page-title"

import { Category } from "./category"
import { CategoryDialog } from "./category-dialog"

export function Categories() {
  return (
    <div className="space-y-6">
      <Dialog>
        <PageTitle
          title="Categorias"
          description="Organize suas transações por categoria"
        >
          <Dialog.Trigger asChild>
            <Button>
              <PlusIcon className="size-4" />
              Nova categoria
            </Button>
          </Dialog.Trigger>
        </PageTitle>

        <CategoryDialog />
      </Dialog>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Category key={i} />
        ))}
      </div>
    </div>
  )
}
