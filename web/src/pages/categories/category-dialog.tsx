import { DialogClose, DialogTitle } from "@radix-ui/react-dialog"
import { TagIcon, XIcon } from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"

export function CategoryDialog() {
  return (
    <Dialog
      className="p-6 space-y-4"
      aria-describedby={undefined}
    >
      <div className="flex items-enter justify-between gap-6">
        <DialogTitle className="text-lg font-semibold text-zinc-800">
          Nova Categoria
        </DialogTitle>

        <DialogClose asChild>
          <Button
            size="sm"
            variant="ghost"
          >
            <XIcon className="size-5 text-zinc-500" />
          </Button>
        </DialogClose>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>

          <InputRoot>
            <InputRoot.Icon>
              <TagIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field
              id="name"
              type="text"
              placeholder="Ex.: Alimentação, Salário, Investimento, Transporte..."
            />
          </InputRoot>
        </div>

        <div className="flex flex-col justify-end md:flex-row gap-2">
          <Button>Adicionar categoria</Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
          </DialogClose>
        </div>
      </form>
    </Dialog>
  )
}
