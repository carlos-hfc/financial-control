import { useQuery } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { PageTitle } from "@/components/page-title"
import { listCategories } from "@/http/list-categories"

import { Category } from "./category"
import { CategoryDialog } from "./category-dialog"

export function Categories() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })

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
        {categories?.map(category => (
          <Category
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </div>
  )
}
