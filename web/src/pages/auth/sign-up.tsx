import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
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
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/button"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { signUp } from "@/http/sign-up"

const signUpSchema = z
  .object({
    name: z
      .string()
      .nonempty("Digite o seu nome")
      .min(3, "O nome deve conter 3 caracteres"),
    email: z.email("E-mail inválido"),
    password: z
      .string()
      .nonempty("Digite a sua senha")
      .min(6, "Senha deve conter 6 caracteres"),
    confirmPassword: z
      .string()
      .nonempty("Digite a confirmação de senha")
      .min(6, "Confirmação de senha deve conter 6 caracteres"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Senha e confirmação de senha não correspondem",
    path: ["confirmPassword"],
  })

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const { mutateAsync: signUpFn, isPending: isSigningUp } = useMutation({
    mutationFn: signUp,
  })

  async function handleSignUp(data: SignUpSchema) {
    try {
      await signUpFn({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      toast.success("Cadastro efetuado com sucesso!", {
        action: {
          label: "Login",
          onClick: () => navigate(`/login?email=${data.email}`),
        },
      })
    } catch (error) {
      toast.error("Falha ao se cadastrar, tente novamente")
    }
  }

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-zinc-900">Criar conta</h2>
        <p className="text-zinc-600">Comece a controlar suas finanças hoje</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={handleSubmit(handleSignUp)}
      >
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

        <Button
          className="w-full"
          disabled={isSubmitting}
        >
          {isSigningUp ? (
            <Loader2Icon className="animate-spin size-5" />
          ) : (
            "Cadastrar"
          )}
        </Button>
      </form>

      <div>
        <span className="text-zinc-600">
          Já tem uma conta?{" "}
          <Button
            asChild
            variant="link"
            className="px-0 inline"
          >
            <Link to="/login">Entrar</Link>
          </Button>
        </span>
      </div>
    </div>
  )
}
