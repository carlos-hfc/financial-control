import { TagIcon, XIcon } from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"

export function CategoryDialog() {
  return (
    <Dialog.Content aria-describedby={undefined}>
      <Dialog.Header className="flex-row justify-between">
        <Dialog.Title>Nova Categoria</Dialog.Title>

        <Dialog.Close asChild>
          <Button
            size="sm"
            variant="ghost"
          >
            <XIcon className="size-5 text-zinc-500" />
          </Button>
        </Dialog.Close>
      </Dialog.Header>

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

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
          </Dialog.Close>
          <Button>Adicionar categoria</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
