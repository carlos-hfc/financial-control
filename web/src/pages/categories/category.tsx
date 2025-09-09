import { BriefcaseIcon, EditIcon, Trash2Icon } from "lucide-react"

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
          className="size-10 hover:bg-rose-500/10"
        >
          <Trash2Icon className="size-5 text-rose-500" />
        </Button>
      </div>
    </div>
  )
}
