import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { BanknoteIcon, TagIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { Select } from "@/components/select"
import { addAccount } from "@/http/add-account"
import { getAccount, GetAccountResponse } from "@/http/get-account"
import { ListAccountsResponse } from "@/http/list-accounts"
import { updateAccount } from "@/http/update-account"
import { queryClient } from "@/lib/react-query"

import { AccountDialogSkeleton } from "./account-dialog-skeleton"

const addAccountSchema = z.object({
  name: z.string().nonempty("Nome da conta deve ser inserido"),
  type: z
    .string("Tipo de conta deve ser escolhido")
    .refine(value => value !== "all", "Tipo de conta deve ser escolhido"),
  currentBalance: z.string().nonempty("Defina o saldo atual da conta"),
})

type AddAccountSchema = z.infer<typeof addAccountSchema>

interface AccountDialogProps {
  accountId?: string
  isEdit?: boolean
  open?: boolean
  onOpenChange?(open: boolean): void
}

export function AccountDialog({
  open,
  onOpenChange,
  isEdit,
  accountId,
}: AccountDialogProps) {
  const { data: account } = useQuery({
    queryKey: ["accounts", accountId],
    queryFn: () => getAccount({ accountId: String(accountId) }),
    enabled: Boolean(open && accountId),
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddAccountSchema>({
    resolver: zodResolver(addAccountSchema),
    values: {
      name: account?.name ?? "",
      currentBalance: String(account?.currentBalance) ?? "",
      type: account?.type ?? "all",
    },
  })

  function updateAccountOnCache(
    accountId: string,
    data: Omit<GetAccountResponse, "id">,
  ) {
    const cached = queryClient.getQueryData<GetAccountResponse>([
      "accounts",
      accountId,
    ])

    if (cached) {
      queryClient.setQueryData<GetAccountResponse>(["accounts", accountId], {
        ...cached,
        ...data,
      })
    }

    const accountsListCache = queryClient.getQueryData<ListAccountsResponse[]>([
      "accounts",
    ])

    if (accountsListCache) {
      if (!isEdit) {
        accountsListCache.push({
          ...data,
          id: accountId,
        })
      }

      queryClient.setQueryData<ListAccountsResponse[]>(
        ["accounts"],
        accountsListCache.map(account => {
          if (account.id === accountId) {
            return {
              ...account,
              ...data,
            }
          }

          return account
        }),
      )
    }
  }

  const { mutateAsync: addAccountFn } = useMutation({
    mutationFn: addAccount,
    onSuccess({ accountId }, variables) {
      updateAccountOnCache(accountId, variables)

      reset()
      if (onOpenChange) onOpenChange(false)
    },
  })

  const { mutateAsync: updateAccountFn } = useMutation({
    mutationFn: updateAccount,
    onSuccess(_, { accountId, ...variables }) {
      updateAccountOnCache(accountId, {
        ...variables,
        currentBalance: account?.currentBalance ?? 0,
      })
    },
  })

  async function handleStoreAccount(data: AddAccountSchema) {
    try {
      if (accountId) {
        const dataClone = structuredClone({
          name: data.name,
          type: data.type,
        })
        const accountClone = structuredClone({
          name: account?.name,
          type: account?.type,
        })

        if (JSON.stringify(accountClone) !== JSON.stringify(dataClone)) {
          await updateAccountFn({
            accountId,
            name: data.name,
            type: data.type,
          })
        }
      } else {
        await addAccountFn({
          name: data.name,
          type: data.type,
          currentBalance: Number(data.currentBalance),
        })
      }

      toast.success(
        accountId
          ? "Conta atualizada com sucesso!"
          : "Conta adicionada com sucesso!",
      )
    } catch (error) {
      toast.error(
        accountId
          ? "Falha ao editar conta, tente novamente"
          : "Falha ao cadastrar conta, tente novamente",
      )
    }
  }

  function handleReset() {
    reset()
  }

  if (!account && isEdit) {
    return <AccountDialogSkeleton />
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
        <Dialog.Title>
          {accountId ? `Conta: ${account?.name}` : "Nova Conta"}
        </Dialog.Title>
      </Dialog.Header>

      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleStoreAccount)}
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
              disabled={Boolean(accountId)}
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
            {accountId ? "Salvar conta" : "Adicionar conta"}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
