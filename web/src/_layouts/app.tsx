import { useState } from "react"
import { Outlet } from "react-router"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export function AppLayout() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

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
