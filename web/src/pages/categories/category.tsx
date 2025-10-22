import { BriefcaseIcon, EditIcon } from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"

import { CategoryDialog } from "./category-dialog"

interface CategoryProps {
  category: {
    id: string
    name: string
  }
}

export function Category({ category }: CategoryProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-xl flex items-center justify-center bg-cyan-100">
        <BriefcaseIcon className="size-5 text-cyan-500" />
      </div>
      <span className="font-medium text-zinc-800">{category.name}</span>

      <div className="flex items-center justify-center gap-2 ml-auto">
        <Dialog>
          <Dialog.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="size-10"
            >
              <EditIcon className="size-5" />
            </Button>
          </Dialog.Trigger>

          <CategoryDialog
            isEdit
            categoryId={category.id}
          />
        </Dialog>
      </div>
    </div>
  )
}
