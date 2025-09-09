import { createBrowserRouter } from "react-router"

import { AppLayout } from "./_layouts/app"
import { AuthLayout } from "./_layouts/auth"
import { SignIn } from "./pages/auth/sign-in"
import { SignUp } from "./pages/auth/sign-up"
import { Categories } from "./pages/categories"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [{ path: "/categorias", element: <Categories /> }],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <SignIn /> },
      { path: "/criar-conta", element: <SignUp /> },
    ],
  },
])
