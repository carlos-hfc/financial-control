import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import {
  EyeClosedIcon,
  EyeIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/button"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"
import { signIn } from "@/http/sign-in"

const signInSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .nonempty("Digite a sua senha")
    .min(6, "Senha deve conter 6 caracteres"),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  })

  const { mutateAsync: signInFn, isPending: isSigningIn } = useMutation({
    mutationFn: signIn,
    onSuccess() {
      navigate("/", { replace: true })
    },
  })

  async function handleSignIn(data: SignInSchema) {
    try {
      await signInFn(data)
      toast.success("Login efetuado com sucesso!")
    } catch (error) {
      toast.error("Falha ao fazer login, tente novamente")
    }
  }

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-zinc-900">Bem-vindo de volta</h2>
        <p className="text-zinc-600">Entre na sua conta para continuar</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>

          <InputRoot>
            <InputRoot.Icon>
              <MailIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              autoComplete="username"
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
              placeholder="Digite sua senha"
              autoComplete="current-password"
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

        <Button
          className="w-full"
          disabled={isSubmitting}
        >
          {isSigningIn ? (
            <Loader2Icon className="animate-spin size-5" />
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      <div>
        <span className="text-zinc-600">
          Não tem conta?{" "}
          <Button
            asChild
            variant="link"
            className="px-0 inline"
          >
            <Link to="/criar-conta">Cadastre-se</Link>
          </Button>
        </span>
      </div>
    </div>
  )
}
