import { zodResolver } from "@hookform/resolvers/zod"
import { EyeClosedIcon, EyeIcon, LockIcon, MailIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import z from "zod"

import { Button } from "@/components/button"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  })

  async function handleSignIn(data: SignInSchema) {
    console.log(data)
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

          <InputRoot>
            <InputRoot.Icon>
              <LockIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field
              id="password"
              type={showPassword ? "text" : "password"}
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
          Entrar
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
            <Link to="/sign-up">Cadastre-se</Link>
          </Button>
        </span>
      </div>
    </div>
  )
}
