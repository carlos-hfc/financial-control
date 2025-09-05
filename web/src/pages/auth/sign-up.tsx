import { EyeIcon, LockIcon, MailIcon, UserIcon } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/button"
import { InputRoot } from "@/components/input"
import { Label } from "@/components/label"

export function SignUp() {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-zinc-900">Criar conta</h2>
        <p className="text-zinc-600">Comece a controlar suas finanças hoje</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label>Nome</Label>

          <InputRoot>
            <InputRoot.Icon>
              <UserIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field />
          </InputRoot>
        </div>

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

            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-full"
            >
              <EyeIcon className="size-6 text-zinc-500" />
            </Button>
          </InputRoot>
        </div>

        <div className="space-y-2">
          <Label>Confirmar Senha</Label>

          <InputRoot>
            <InputRoot.Icon>
              <LockIcon className="size-5 text-zinc-500" />
            </InputRoot.Icon>

            <InputRoot.Field />

            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-full"
            >
              <EyeIcon className="size-6 text-zinc-500" />
            </Button>
          </InputRoot>
        </div>

        <Button className="w-full">Cadastrar</Button>
      </form>

      <div>
        <span className="text-zinc-600">
          Já tem uma conta?{" "}
          <Button
            asChild
            variant="link"
            className="px-0 inline"
          >
            <Link to="/sign-in">Entrar</Link>
          </Button>
        </span>
      </div>
    </div>
  )
}
