import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "react-router"
import { Toaster } from "sonner"

import { queryClient } from "./lib/react-query"
import { router } from "./routes"

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>
  )
}
