import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { useSearchParams } from "react-router"
import z from "zod"

import { Button } from "@/components/button"
import { Select } from "@/components/select"
import { Skeleton } from "@/components/skeleton"
import { listAccounts } from "@/http/list-accounts"
import { listCategories } from "@/http/list-categories"

const transactionFilterSchema = z.object({
  category: z.string().optional(),
  account: z.string().optional(),
  type: z.string().optional(),
})

type TransactionFilterSchema = z.infer<typeof transactionFilterSchema>

export function TransactionFilters() {
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: listAccounts,
  })

  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get("category")
  const account = searchParams.get("account")
  const type = searchParams.get("type")

  const { handleSubmit, control, reset } = useForm<TransactionFilterSchema>({
    resolver: zodResolver(transactionFilterSchema),
    defaultValues: {
      category: category ?? "all",
      account: account ?? "all",
      type: type ?? "all",
    },
  })

  function handleFilter(data: TransactionFilterSchema) {
    setSearchParams(prev => {
      if (data.category) {
        prev.set("category", data.category)
      } else {
        prev.delete("category")
      }

      if (data.account) {
        prev.set("account", data.account)
      } else {
        prev.delete("account")
      }

      if (data.type) {
        prev.set("type", data.type)
      } else {
        prev.delete("type")
      }

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams(prev => {
      prev.delete("category")
      prev.delete("account")
      prev.delete("type")
      prev.delete("page")

      return prev
    })

    reset()
  }

  return (
    <form
      className="bg-white shadow-sm rounded-2xl border border-zinc-100 p-6 space-y-2"
      onSubmit={handleSubmit(handleFilter)}
    >
      <div className="grid md:grid-cols-3 gap-2 *:w-full">
        {isLoadingCategories && isLoadingAccounts ? (
          <>
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
          </>
        ) : (
          <>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="all"
                  {...field}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>

                  <Select.Content>
                    <Select.Item value="all">Tipo de transação</Select.Item>
                    <Select.Item value="income">Receita</Select.Item>
                    <Select.Item value="expense">Despesa</Select.Item>
                  </Select.Content>
                </Select>
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="all"
                  {...field}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger>
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

            <Controller
              name="account"
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="all"
                  {...field}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger>
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
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:justify-end gap-2 w-full md:w-auto">
        <Button type="submit">Filtrar resultados</Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleClearFilters}
        >
          Remover filtros
        </Button>
      </div>
    </form>
  )
}
