import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2Icon, TagIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { addCategory } from "@/http/add-category"
import { ListCategoriesResponse } from "@/http/list-categories"
import { queryClient } from "@/lib/react-query"

const addCategorySchema = z.object({
  name: z
    .string()
    .toLowerCase()
    .nonempty("Nome da categoria deve ser inserido"),
})

type AddCategorySchema = z.infer<typeof addCategorySchema>

export function CategoryDialog() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCategorySchema>({
    resolver: zodResolver(addCategorySchema),
  })

  const { mutateAsync: addCategoryFn, isPending: isAdding } = useMutation({
    mutationFn: addCategory,
    onSuccess({ categoryId }, { name }) {
      const cached = queryClient.getQueryData<ListCategoriesResponse>([
        "categories",
      ])

      if (cached) {
        queryClient.setQueryData<ListCategoriesResponse>(
          ["categories"],
          [
            {
              id: categoryId,
              name,
            },
            ...cached,
          ],
        )
      }

      reset()
    },
  })

  async function handleAddCategory(data: AddCategorySchema) {
    try {
      await addCategoryFn({
        name: data.name,
      })

      toast.success("Categoria adicionada com sucesso!")
    } catch (error) {
      toast.error("Falha ao cadastrar categoria, tente novamente")
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
        <Dialog.Title>Nova Categoria</Dialog.Title>
      </Dialog.Header>

      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleAddCategory)}
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
            {isAdding ? (
              <Loader2Icon className="animate-spin size-5" />
            ) : (
              "Adicionar categoria"
            )}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
