import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { TagIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { addCategory } from "@/http/add-category"
import { listCategories, ListCategoriesResponse } from "@/http/list-categories"
import { updateCategory } from "@/http/update-category"
import { queryClient } from "@/lib/react-query"

import { CategoryDialogSkeleton } from "./category-dialog-skeleton"

const addCategorySchema = z.object({
  name: z
    .string()
    .toLowerCase()
    .nonempty("Nome da categoria deve ser inserido"),
})

type AddCategorySchema = z.infer<typeof addCategorySchema>

interface CategoryDialogProps {
  categoryId?: string
  isEdit?: boolean
}

export function CategoryDialog({ categoryId, isEdit }: CategoryDialogProps) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })

  const category = categories?.find(item => item.id === categoryId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCategorySchema>({
    resolver: zodResolver(addCategorySchema),
    values: {
      name: category?.name ?? "",
    },
  })

  function updateCategoryOnCache(
    categoryId: string,
    data: Omit<ListCategoriesResponse, "id">,
  ) {
    const cached = queryClient.getQueryData<ListCategoriesResponse[]>([
      "categories",
    ])

    if (cached) {
      if (!isEdit) {
        queryClient.setQueryData<ListCategoriesResponse[]>(
          ["categories"],
          [
            {
              id: categoryId,
              ...data,
            },
            ...cached,
          ],
        )

        return
      }

      queryClient.setQueryData(
        ["categories"],
        cached.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              ...data,
            }
          }

          return category
        }),
      )
    }
  }

  const { mutateAsync: addCategoryFn } = useMutation({
    mutationFn: addCategory,
    onSuccess({ categoryId }, { name }) {
      updateCategoryOnCache(categoryId, { name })

      reset()
    },
  })

  const { mutateAsync: updateCategoryFn } = useMutation({
    mutationFn: updateCategory,
    onSuccess(_, { categoryId, name }) {
      updateCategoryOnCache(categoryId, { name })
    },
  })

  async function handleStoreCategory(data: AddCategorySchema) {
    try {
      if (categoryId && data.name !== category?.name) {
        await updateCategoryFn({
          categoryId,
          name: data.name,
        })
      } else {
        await addCategoryFn({
          name: data.name,
        })
      }

      toast.success(
        categoryId
          ? "Categoria atualizada com sucesso!"
          : "Categoria adicionada com sucesso!",
      )
    } catch (error) {
      toast.error(
        categoryId
          ? "Falha ao editar categoria, tente novamente"
          : "Falha ao cadastrar categoria, tente novamente",
      )
    }
  }

  function handleReset() {
    reset()
  }

  if (!category && isEdit) {
    return <CategoryDialogSkeleton />
  }

  return (
    <Dialog.Content
      aria-describedby={undefined}
      onEscapeKeyDown={handleReset}
      onInteractOutside={handleReset}
      onPointerDownOutside={handleReset}
    >
      <Dialog.Header>
        <Dialog.Title>
          {categoryId ? `Categoria: ${category?.name}` : "Nova Categoria"}
        </Dialog.Title>
      </Dialog.Header>

      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleStoreCategory)}
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
              placeholder="Ex.: Alimentação, Salário, Investimento, Transporte..."
              {...register("name")}
            />
          </InputRoot>

          {errors.name?.message && (
            <p className="text-left text-rose-500 text-xs font-semibold">
              {errors.name.message}
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
            {categoryId ? "Salvar categoria" : "Adicionar categoria"}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
