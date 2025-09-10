import { createBrowserRouter } from "react-router"

import { AppLayout } from "./_layouts/app"
import { AuthLayout } from "./_layouts/auth"
import { Accounts } from "./pages/accounts"
import { SignIn } from "./pages/auth/sign-in"
import { SignUp } from "./pages/auth/sign-up"
import { Categories } from "./pages/categories"
import { Dashboard } from "./pages/dashboard"
import { Transactions } from "./pages/transactions"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/categorias", element: <Categories /> },
      { path: "/contas", element: <Accounts /> },
      { path: "/transacoes", element: <Transactions /> },
    ],
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
