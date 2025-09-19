import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { BanknoteIcon, Loader2Icon, TagIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { Select } from "@/components/select"
import { addAccount } from "@/http/add-account"
import { ListAccountsResponse } from "@/http/list-accounts"
import { queryClient } from "@/lib/react-query"

const addAccountSchema = z.object({
  name: z.string().nonempty("Nome da conta deve ser inserido"),
  type: z
    .string("Tipo de conta deve ser escolhido")
    .refine(value => value !== "all", "Tipo de conta deve ser escolhido"),
  currentBalance: z.string().nonempty("Defina o saldo atual da conta"),
})

type AddAccountSchema = z.infer<typeof addAccountSchema>

export function AccountDialog() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddAccountSchema>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      type: "all",
    },
  })

  const { mutateAsync: addAccountFn, isPending: isAdding } = useMutation({
    mutationFn: addAccount,
    onSuccess({ accountId }, variables) {
      const cached = queryClient.getQueryData<ListAccountsResponse[]>([
        "accounts",
      ])

      if (cached) {
        queryClient.setQueryData<ListAccountsResponse[]>(
          ["accounts"],
          [
            {
              id: accountId,
              ...variables,
            },
            ...cached,
          ],
        )
      }

      reset()
    },
  })

  async function handleAddAccount(data: AddAccountSchema) {
    try {
      await addAccountFn({
        name: data.name,
        type: data.type,
        currentBalance: Number(data.currentBalance),
      })

      toast.success("Conta adicionada com sucesso!")
    } catch (error) {
      toast.error("Falha ao cadastrar conta, tente novamente")
    }
  }

  function handleReset() {
    reset()
  }

  return (
    <Dialog.Content
      className="sm:max-w-sm"
      aria-describedby={undefined}
      onEscapeKeyDown={handleReset}
      onInteractOutside={handleReset}
      onPointerDownOutside={handleReset}
    >
      <Dialog.Header>
        <Dialog.Title>Nova Conta</Dialog.Title>
      </Dialog.Header>

      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleAddAccount)}
      >
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
              {...register("name")}
            />
          </InputRoot>

          {errors.name?.message && (
            <p className="text-left text-rose-500 text-xs font-semibold">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo da Conta</Label>

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                defaultValue="all"
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <Select.Trigger className="w-full">
                  <Select.Value />
                </Select.Trigger>

                <Select.Content>
                  <Select.Item value="all">Tipo de conta</Select.Item>
                  <Select.Item value="corrente">Conta corrente</Select.Item>
                  <Select.Item value="credito">Cartão de crédito</Select.Item>
                  <Select.Item value="poupanca">
                    Conta de investimento
                  </Select.Item>
                </Select.Content>
              </Select>
            )}
          />

          {errors.type?.message && (
            <p className="text-left text-rose-500 text-xs font-semibold">
              {errors.type.message}
            </p>
          )}
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
              {...register("currentBalance")}
            />
          </InputRoot>

          {errors.currentBalance?.message && (
            <p className="text-left text-rose-500 text-xs font-semibold">
              {errors.currentBalance.message}
            </p>
          )}
        </div>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </Dialog.Close>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isAdding ? (
              <Loader2Icon className="animate-spin size-5" />
            ) : (
              "Adicionar conta"
            )}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
