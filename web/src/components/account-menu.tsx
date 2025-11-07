import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react"
import { useNavigate } from "react-router"

import { Dialog } from "@/components/dialog"
import { getProfile } from "@/http/get-profile"
import { signOut } from "@/http/sign-out"
import { queryClient } from "@/lib/react-query"

import { Button } from "./button"
import { ProfileDialog } from "./profile-dialog"
import { Skeleton } from "./skeleton"

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
  })

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess() {
      queryClient.clear()
      navigate("/login", { replace: true })
    },
  })

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="select-none data-[state=open]:[&>svg]:rotate-180 text-nowrap"
          >
            {isLoadingProfile ? (
              <Skeleton className="w-20 h-4" />
            ) : (
              profile?.name
            )}
            <ChevronDownIcon className="size-4 transition-transform" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            sideOffset={8}
            align="end"
            className="w-56 *:leading-none z-50 max-h-(--radix-dropdown-menu-content-available-height) overflow-x-hidden overflow-y-auto rounded-md border border-zinc-200 p-1 shadow-md bg-white"
          >
            <DropdownMenuLabel className="flex flex-col px-2 py-1.5">
              {isLoadingProfile ? (
                <>
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-32 h-3 mt-1" />
                </>
              ) : (
                <>
                  <span className="font-bold text-sm text-zinc-700">
                    {profile?.name}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {profile?.email}
                  </span>
                </>
              )}
            </DropdownMenuLabel>

            <div className="bg-zinc-200 -mx-1 my-1 h-px" />

            <Dialog.Trigger asChild>
              <DropdownMenuItem className="flex items-center gap-2 rounded-sm px-2 py-1.5 select-none outline-hidden text-sm text-zinc-700 hover:bg-zinc-100 font-medium">
                <UserIcon className="size-4 shrink-0" />
                <span>Perfil</span>
              </DropdownMenuItem>
            </Dialog.Trigger>

            <DropdownMenuItem
              className="flex items-center gap-2 rounded-sm px-2 py-1.5 select-none outline-hidden text-sm w-full text-rose-500 hover:bg-zinc-100 font-medium"
              asChild
            >
              <button
                onClick={() => signOutFn()}
                disabled={isSigningOut}
              >
                <LogOutIcon className="size-4 shrink-0" />
                <span>Sair</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <ProfileDialog />
    </Dialog>
  )
}
