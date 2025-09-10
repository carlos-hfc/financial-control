import { DialogClose, DialogTitle } from "@radix-ui/react-dialog"
import {
  ArrowUpDownIcon,
  BanknoteIcon,
  CalendarIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { Select } from "@/components/select"

export function TransactionDialog() {
  return (
    <Dialog
      className="p-6 space-y-4"
      aria-describedby={undefined}
    >
      <div className="flex items-enter justify-between gap-6">
        <DialogTitle className="text-lg font-semibold text-zinc-800">
          Nova Transação
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
          <Label htmlFor="description">Descrição</Label>

          <InputRoot>
            <InputRoot.Icon>
              <ArrowUpDownIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field
              id="description"
              type="text"
              placeholder="Ex.: Supermercado, Salário, Uber..."
            />
          </InputRoot>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Valor</Label>

          <InputRoot>
            <InputRoot.Icon>
              <BanknoteIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field
              id="value"
              type="number"
              placeholder="0.00"
            />
          </InputRoot>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="space-y-2 w-full">
            <Label htmlFor="category">Categoria</Label>

            <Select>
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Selecione uma categoria" />
              </Select.Trigger>

              <Select.Content>
                <Select.Item value="corrente">Conta corrente</Select.Item>
                <Select.Item value="credito">Cartão de crédito</Select.Item>
                <Select.Item value="poupanca">Conta poupança</Select.Item>
              </Select.Content>
            </Select>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="account">Conta</Label>

            <Select>
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Selecione uma conta" />
              </Select.Trigger>

              <Select.Content>
                <Select.Item value="corrente">Conta corrente</Select.Item>
                <Select.Item value="credito">Cartão de crédito</Select.Item>
                <Select.Item value="poupanca">Conta poupança</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>

          <InputRoot>
            <InputRoot.Icon>
              <CalendarIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field
              id="date"
              type="date"
              placeholder="Ex.: Supermercado, Salário, Uber..."
            />
          </InputRoot>
        </div>

        <div className="flex flex-col justify-end md:flex-row gap-2">
          <Button>Adicionar transação</Button>
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
