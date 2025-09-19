import { zodResolver } from "@hookform/resolvers/zod"
import * as Popover from "@radix-ui/react-popover"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  ArrowUpDownIcon,
  BanknoteIcon,
  CalendarIcon,
  Loader2Icon,
} from "lucide-react"
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
import { listAccounts, ListAccountsResponse } from "@/http/list-accounts"
import { listCategories } from "@/http/list-categories"
import { ListTransactionsResponse } from "@/http/list-transactions"
import { queryClient } from "@/lib/react-query"

import { SelectTransactionType } from "./select-transaction-type"

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

export function TransactionDialog() {
  const [openDatePopover, setOpenDatePopover] = useState(false)

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
    defaultValues: {
      categoryId: "all",
      accountId: "all",
    },
  })

  const { mutateAsync: addTransactionFn, isPending: isAdding } = useMutation({
    mutationFn: addTransaction,
    onSuccess({ transactionId }, variables) {
      const cached = queryClient.getQueryData<ListTransactionsResponse[]>([
        "transactions",
      ])

      if (cached) {
        queryClient.setQueryData<ListTransactionsResponse[]>(
          ["transactions"],
          [
            {
              id: transactionId,
              account: accounts!.find(item => item.id === variables.accountId)!,
              category: categories!.find(
                item => item.id === variables.categoryId,
              )!,
              ...variables,
            },
            ...cached,
          ],
        )
      }

      const accountCached = queryClient.getQueryData<ListAccountsResponse[]>([
        "accounts",
      ])

      if (accountCached) {
        queryClient.setQueryData<ListAccountsResponse[]>(
          ["accounts"],
          accountCached.map(item => {
            if (item.id === variables.accountId) {
              const newBalance =
                Number(item.currentBalance) +
                Number(
                  variables.value * (variables.type === "expense" ? -1 : 1),
                )

              return { ...item, currentBalance: Number(newBalance.toFixed(2)) }
            }

            return item
          }),
        )
      }

      reset()
    },
  })

  async function handleAddTransaction(data: AddTransactionSchema) {
    try {
      await addTransactionFn({
        accountId: data.accountId,
        categoryId: data.categoryId,
        description: data.description,
        type: data.type,
        value: Number(data.value),
        date: data.date,
      })

      toast.success("Transação adicionada com sucesso!")
    } catch (error) {
      toast.error("Falha ao adicionar transação, tente novamente")
    }
  }

  function handleReset() {
    reset()
  }

  return (
    <Dialog.Content
      aria-describedby={undefined}
      onEscapeKeyDown={handleReset}
      onInteractOutside={handleReset}
      onPointerDownOutside={handleReset}
    >
      <Dialog.Header>
        <Dialog.Title>Nova Transação</Dialog.Title>
      </Dialog.Header>

      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleAddTransaction)}
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
                    {categories?.map(category => (
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
                    {accounts?.map(account => (
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </Dialog.Close>

          <Button disabled={isSubmitting}>
            {isAdding ? (
              <Loader2Icon className="animate-spin size-5" />
            ) : (
              "Adicionar transação"
            )}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
