import { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { api } from "@/lib/axios"

export function AppLayout() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      response => response,
      error => {
        if (isAxiosError(error)) {
          const status = error.response?.status

          if (status === 401) {
            navigate("/login", { replace: true })
          }

          throw error
        } else {
          throw error
        }
      },
    )

    return () => api.interceptors.response.eject(interceptorId)
  }, [navigate])

  return (
    <div className="min-h-svh flex flex-col bg-zinc-100">
      <Header onOpenMenu={() => setSidebarIsOpen(true)} />

      <main className="flex flex-1">
        <Sidebar
          isOpen={sidebarIsOpen}
          onClose={() => setSidebarIsOpen(false)}
        />

        <div className="flex-1 p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
