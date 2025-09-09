import { BriefcaseIcon, EditIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/button"

export function Category() {
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-xl flex items-center justify-center bg-cyan-100">
        <BriefcaseIcon className="size-5 text-cyan-500" />
      </div>
      <span className="font-medium text-zinc-800">Categoria</span>

      <div className="flex items-center justify-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="sm"
          className="size-10"
        >
          <EditIcon className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-10"
        >
          <TrashIcon className="size-5" />
        </Button>
      </div>
    </div>
  )
}
