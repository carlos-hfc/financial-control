import { Link } from "react-router"

export function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p className="text-zinc-600">
        Voltar para o{" "}
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800"
        >
          Dashboard
        </Link>
      </p>
    </div>
  )
}
