import {
  BarChart3Icon,
  ShieldIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react"
import { Outlet } from "react-router"

const features = [
  {
    icon: WalletIcon,
    title: "Controle Total",
    description: "Gerencie todas suas contas em um só lugar",
  },
  {
    icon: TrendingUpIcon,
    title: "Análise Inteligente",
    description: "Visualize seus gastos com gráficos detalhados",
  },
  {
    icon: ShieldIcon,
    title: "Segurança",
    description: "Seus dados protegidos com criptografia",
  },
  {
    icon: BarChart3Icon,
    title: "Relatórios",
    description: "Relatórios completos para tomada de decisão",
  },
]

export function AuthLayout() {
  return (
    <main className="h-svh flex">
      <section className="hidden lg:flex lg:w-1/2 flex-col justify-center gap-12 relative overflow-hidden bg-gradient-to-br from-blue-500 to-violet-900 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="size-12 bg-white/80 rounded-full flex items-center justify-center">
            <WalletIcon className="size-7 text-black" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Finance App</h1>
            <p className="text-blue-100">Controle Financeiro Inteligente</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold">
            Transforme sua relação com o dinheiro
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            Organize suas finanças, acompanhe seus gastos e alcance seus
            objetivos financeiro com nossa platafoma completa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {features.map(feature => (
            <div
              key={feature.title}
              className="flex gap-4"
            >
              <div className="size-10 bg-white/80 rounded-lg flex items-center justify-center shrink-0">
                <feature.icon className="size-5 text-black" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-10">
          <div className="flex lg:hidden items-center justify-center gap-3">
            <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-900 rounded-lg size-10">
              <WalletIcon className="size-6 text-white" />
            </div>

            <h1 className="text-xl font-bold text-zinc-900">Finance App</h1>
          </div>

          <Outlet />
        </div>
      </section>
    </main>
  )
}
