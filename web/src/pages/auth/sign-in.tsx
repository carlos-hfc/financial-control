import { LockIcon, MailIcon } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/button"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"

export function SignIn() {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-zinc-900">Bem-vindo de volta</h2>
        <p className="text-zinc-600">Entre na sua conta para continuar</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label>E-mail</Label>

          <InputRoot>
            <InputRoot.Icon>
              <MailIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field />
          </InputRoot>
        </div>

        <div className="space-y-2">
          <Label>Senha</Label>

          <InputRoot>
            <InputRoot.Icon>
              <LockIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field />
          </InputRoot>
        </div>

        <Button className="w-full">Entrar</Button>
      </form>

      <div>
        <span className="text-zinc-600">
          Não tem conta?{" "}
          <Button
            asChild
            variant="link"
            className="px-0 inline"
          >
            <Link to="/">Cadastre-se</Link>
          </Button>
        </span>
      </div>
    </div>
  )
}
