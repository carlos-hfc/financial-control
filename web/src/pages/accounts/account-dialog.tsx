import { BanknoteIcon, TagIcon, XIcon } from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { Select } from "@/components/select"

export function AccountDialog() {
  return (
    <Dialog.Content
      className="sm:max-w-sm"
      aria-describedby={undefined}
    >
      <Dialog.Header className="flex-row justify-between">
        <Dialog.Title>Nova Conta</Dialog.Title>

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
              placeholder="Ex.: Bradesco, Nubank, Itaú..."
            />
          </InputRoot>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo da Conta</Label>

          <Select>
            <Select.Trigger className="w-full">
              <Select.Value placeholder="Tipo de conta" />
            </Select.Trigger>

            <Select.Content>
              <Select.Item value="corrente">Conta corrente</Select.Item>
              <Select.Item value="credito">Cartão de crédito</Select.Item>
              <Select.Item value="poupanca">Conta poupança</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="currentBalance">Saldo Atual</Label>
          <InputRoot>
            <InputRoot.Icon>
              <BanknoteIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>
            <InputRoot.Field
              id="currentBalance"
              type="number"
              placeholder="0.00"
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
          <Button>Adicionar conta</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
