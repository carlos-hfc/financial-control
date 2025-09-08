import { useState } from "react"
import { Outlet } from "react-router"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export function AppLayout() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

  return (
    <div className="min-h-svh flex flex-col">
      <Header onOpenMenu={() => setSidebarIsOpen(true)} />

      <main className="flex flex-1">
        <Sidebar
          isOpen={sidebarIsOpen}
          onClose={() => setSidebarIsOpen(false)}
        />

        <Outlet />
      </main>
    </div>
  )
}
