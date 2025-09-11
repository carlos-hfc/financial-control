import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  EyeClosedIcon,
  EyeIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { editProfile } from "@/http/edit-profile"
import { getProfile, GetProfileResponse } from "@/http/get-profile"
import { queryClient } from "@/lib/react-query"

import { Button } from "./button"
import { Dialog } from "./dialog"
import { InputRoot } from "./input"
import { Label } from "./label"

const profileDialogSchema = z
  .object({
    name: z.string().min(3, "O nome deve conter 3 caracteres").optional(),
    email: z.email("E-mail inválido").optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Senha e confirmação de senha não correspondem",
    path: ["confirmPassword"],
  })

type ProfileDialogSchema = z.infer<typeof profileDialogSchema>

export function ProfileDialog() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { data: profile } = useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileDialogSchema>({
    resolver: zodResolver(profileDialogSchema),
    values: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
    },
  })

  const { mutateAsync: editProfileFn, isPending: isEditing } = useMutation({
    mutationFn: editProfile,
    onSuccess(_, { email, name }) {
      const cached = queryClient.getQueryData<GetProfileResponse>(["profile"])

      if (cached) {
        queryClient.setQueryData(["profile"], {
          ...cached,
          name,
          email,
        })
      }
    },
  })

  async function handleUpdateProfile(data: ProfileDialogSchema) {
    try {
      await editProfileFn({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      toast.error("Falha ao atualizar o perfil, tente novamente")
    }
  }

  function handleReset() {
    setShowPassword(false)
    setShowConfirmPassword(false)

    reset()
  }

  return (
    <Dialog.Content
      onEscapeKeyDown={handleReset}
      onInteractOutside={handleReset}
      onPointerDownOutside={handleReset}
    >
      <Dialog.Header>
        <Dialog.Title>Meu perfil</Dialog.Title>
        <Dialog.Description>Atualize as suas informações</Dialog.Description>
      </Dialog.Header>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>

            <InputRoot>
              <InputRoot.Icon>
                <UserIcon className="size-5 text-zinc-500" />
              </InputRoot.Icon>

              <InputRoot.Field
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Digite o seu nome"
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
            <Label htmlFor="email">E-mail</Label>

            <InputRoot>
              <InputRoot.Icon>
                <MailIcon className="size-5 text-zinc-500" />
              </InputRoot.Icon>

              <InputRoot.Field
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Digite o seu e-mail"
                {...register("email")}
              />
            </InputRoot>

            {errors.email?.message && (
              <p className="text-left text-rose-500 text-xs font-semibold">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>

            <InputRoot className="pr-0">
              <InputRoot.Icon>
                <LockIcon className="size-5 text-zinc-500" />
              </InputRoot.Icon>

              <InputRoot.Field
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Defina uma senha"
                {...register("password")}
              />

              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-full"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? (
                  <EyeClosedIcon className="size-6 text-zinc-500" />
                ) : (
                  <EyeIcon className="size-6 text-zinc-500" />
                )}
              </Button>
            </InputRoot>

            {errors.password?.message && (
              <p className="text-left text-rose-500 text-xs font-semibold">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>

            <InputRoot className="pr-0">
              <InputRoot.Icon>
                <LockIcon className="size-5 text-zinc-500" />
              </InputRoot.Icon>

              <InputRoot.Field
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirme a sua senha"
                {...register("confirmPassword")}
              />

              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-full"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? (
                  <EyeClosedIcon className="size-6 text-zinc-500" />
                ) : (
                  <EyeIcon className="size-6 text-zinc-500" />
                )}
              </Button>
            </InputRoot>

            {errors.confirmPassword?.message && (
              <p className="text-left text-rose-500 text-xs font-semibold">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
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
            {isEditing ? (
              <Loader2Icon className="animate-spin size-5" />
            ) : (
              "Salvar"
            )}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
