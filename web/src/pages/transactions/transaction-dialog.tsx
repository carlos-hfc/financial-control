import { zodResolver } from "@hookform/resolvers/zod"
import * as Popover from "@radix-ui/react-popover"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ArrowUpDownIcon, BanknoteIcon, CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/button"
import { Calendar } from "@/components/calendar"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { Select } from "@/components/select"
import { addTransaction } from "@/http/add-transaction"
import { getTransaction, GetTransactionResponse } from "@/http/get-transaction"
import { listAccounts, ListAccountsResponse } from "@/http/list-accounts"
import { listCategories } from "@/http/list-categories"
import { updateTransaction } from "@/http/update-transaction"
import { queryClient } from "@/lib/react-query"

import { SelectTransactionType } from "./select-transaction-type"
import { TransactionDialogSkeleton } from "./transaction-dialog-skeleton"

const addTransactionSchema = z.object({
  description: z.string().nonempty("Descrição deve ser informada"),
  value: z.string().nonempty("Defina o valor da transação"),
  categoryId: z
    .uuid("Selecione uma categoria")
    .refine(value => value !== "all", "Selecione uma categoria"),
  accountId: z
    .uuid("Selecione uma conta")
    .refine(value => value !== "all", "Selecione uma conta"),
  date: z.string("Defina a data da transação"),
  type: z.string("Defina o tipo de transação"),
})

type AddTransactionSchema = z.infer<typeof addTransactionSchema>

interface TransactionDialogProps {
  transactionId?: string
  isEdit?: boolean
  open?: boolean
  onOpenChange?(open: boolean): void
}

export function TransactionDialog({
  isEdit,
  onOpenChange,
  open,
  transactionId,
}: TransactionDialogProps) {
  const [openDatePopover, setOpenDatePopover] = useState(false)

  const { data: transaction } = useQuery({
    queryKey: ["transactions", transactionId],
    queryFn: () => getTransaction({ transactionId: String(transactionId) }),
    enabled: Boolean(open && transactionId),
  })

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: listAccounts,
  })

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddTransactionSchema>({
    resolver: zodResolver(addTransactionSchema),
    values: {
      categoryId: transaction?.categoryId ?? "all",
      accountId: transaction?.accountId ?? "all",
      date: transaction?.date ?? "",
      description: transaction?.description ?? "",
      value: String(transaction?.value) ?? "",
      type: transaction?.type ?? "",
    },
  })

  function updateTransactionOnCache(data: Omit<GetTransactionResponse, "id">) {
    queryClient.invalidateQueries({ queryKey: ["transactions"] })
    queryClient.invalidateQueries({ queryKey: ["metrics"] })

    const accountCached = queryClient.getQueryData<ListAccountsResponse[]>([
      "accounts",
    ])

    if (accountCached) {
      queryClient.setQueryData<ListAccountsResponse[]>(
        ["accounts"],
        accountCached.map(item => {
          if (item.id === data.accountId) {
            const newBalance =
              Number(item.currentBalance) +
              Number(data.value * (data.type === "expense" ? -1 : 1))

            return { ...item, currentBalance: Number(newBalance.toFixed(2)) }
          }

          return item
        }),
      )
    }
  }

  const { mutateAsync: addTransactionFn } = useMutation({
    mutationFn: addTransaction,
    onSuccess(_, variables) {
      updateTransactionOnCache(variables)

      reset()
    },
  })

  const { mutateAsync: updateTransactionFn } = useMutation({
    mutationFn: updateTransaction,
    onSuccess(_, variables) {
      updateTransactionOnCache(variables)

      reset()
      if (onOpenChange) onOpenChange(false)
    },
  })

  async function handleStoreTransaction(data: AddTransactionSchema) {
    try {
      if (transactionId) {
        const dataClone = {
          categoryId: data?.categoryId,
          accountId: data?.accountId,
          date: data?.date,
          description: data?.description,
          value: String(data?.value),
          type: data?.type,
        }

        const transactionClone = {
          categoryId: transaction?.categoryId,
          accountId: transaction?.accountId,
          date: transaction?.date,
          description: transaction?.description,
          value: String(transaction?.value),
          type: transaction?.type,
        }

        if (JSON.stringify(dataClone) !== JSON.stringify(transactionClone)) {
          await updateTransactionFn({
            accountId: data.accountId,
            categoryId: data?.categoryId,
            date: data?.date,
            description: data?.description,
            value: Number(data?.value),
            type: data?.type,
            transactionId,
          })
        }
      } else {
        await addTransactionFn({
          accountId: data.accountId,
          categoryId: data.categoryId,
          description: data.description,
          type: data.type,
          value: Number(data.value),
          date: data.date,
        })
      }

      toast.success(
        transactionId
          ? "Transação atualizada com sucesso!"
          : "Transação adicionada com sucesso!",
      )
    } catch (error) {
      toast.error(
        transactionId
          ? "Falha ao editar transação, tente novamente"
          : "Falha ao adicionar transação, tente novamente",
      )
    }
  }

  function handleReset() {
    reset()
  }

  if (!transaction && isEdit) {
    return <TransactionDialogSkeleton />
  }

  return (
    <Dialog.Content
      aria-describedby={undefined}
      onEscapeKeyDown={handleReset}
      onInteractOutside={handleReset}
      onPointerDownOutside={handleReset}
      aria-disabled={isSubmitting}
      className="group"
    >
      <Dialog.Header>
        <Dialog.Title>
          {transactionId ? `Transação: ${transaction?.id}` : "Nova Transação"}
        </Dialog.Title>
      </Dialog.Header>

      <form
        className="space-y-4 group-aria-disabled:opacity-70 group-aria-disabled:pointer-events-none"
        onSubmit={handleSubmit(handleStoreTransaction)}
      >
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row gap-2 *:w-full">
            <SelectTransactionType
              transactionType="income"
              value="income"
              checked={watch("type") === "income"}
              {...register("type")}
            >
              Receita
            </SelectTransactionType>
            <SelectTransactionType
              transactionType="expense"
              value="expense"
              checked={watch("type") === "expense"}
              {...register("type")}
            >
              Despesa
            </SelectTransactionType>
          </div>

          {errors.type?.message && (
            <p className="text-left text-rose-500 text-xs font-semibold">
              {errors.type.message}
            </p>
          )}
        </div>

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
              {...register("description")}
            />
          </InputRoot>

          {errors.description?.message && (
            <p className="text-left text-rose-500 text-xs font-semibold">
              {errors.description.message}
            </p>
          )}
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
              step={0.01}
              {...register("value")}
            />
          </InputRoot>

          {errors.value?.message && (
            <p className="text-left text-rose-500 text-xs font-semibold">
              {errors.value.message}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="space-y-2 w-full">
            <Label htmlFor="category">Categoria</Label>

            <Controller
              name="categoryId"
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
                    <Select.Item value="all">Categoria</Select.Item>
                    {categories
                      ?.toSorted((a, b) => a.name.localeCompare(b.name))
                      ?.map(category => (
                        <Select.Item
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </Select.Item>
                      ))}
                  </Select.Content>
                </Select>
              )}
            />

            {errors.categoryId?.message && (
              <p className="text-left text-rose-500 text-xs font-semibold">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="account">Conta</Label>

            <Controller
              defaultValue={undefined}
              name="accountId"
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
                    <Select.Item value="all">Conta</Select.Item>
                    {accounts
                      ?.toSorted((a, b) => a.name.localeCompare(b.name))
                      ?.map(account => (
                        <Select.Item
                          key={account.id}
                          value={account.id}
                        >
                          {account.name}
                        </Select.Item>
                      ))}
                  </Select.Content>
                </Select>
              )}
            />

            {errors.accountId?.message && (
              <p className="text-left text-rose-500 text-xs font-semibold">
                {errors.accountId.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>

          <Popover.Root
            open={openDatePopover}
            onOpenChange={setOpenDatePopover}
          >
            <Popover.Trigger asChild>
              <InputRoot>
                <InputRoot.Icon>
                  <CalendarIcon className="size-5 text-zinc-500" />
                </InputRoot.Icon>

                <InputRoot.Field
                  readOnly
                  placeholder="Escolha uma data"
                  value={
                    watch("date")
                      ? new Date(watch("date")).toLocaleDateString()
                      : ""
                  }
                />
              </InputRoot>
            </Popover.Trigger>

            <Popover.Content className="bg-white rounded-xl shadow-sm">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Calendar
                    autoFocus
                    disabled={{ after: new Date() }}
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={date => {
                      field.onChange(date?.toISOString())
                      setOpenDatePopover(false)
                    }}
                  />
                )}
              />
            </Popover.Content>
          </Popover.Root>

          {errors.date?.message && (
            <p className="text-left text-rose-500 text-xs font-semibold">
              {errors.date.message}
            </p>
          )}
        </div>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Cancelar
            </Button>
          </Dialog.Close>

          <Button>
            {transactionId ? "Salvar transação" : "Adicionar transação"}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
