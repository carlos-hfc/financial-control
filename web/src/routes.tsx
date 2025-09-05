import { createBrowserRouter } from "react-router"

import { AuthLayout } from "./_layouts/auth"
import { SignIn } from "./pages/auth/sign-in"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ path: "/", element: <SignIn /> }],
  },
])
