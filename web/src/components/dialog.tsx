import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/utils/cn"

type DialogFooterProps = React.FC<React.ComponentProps<"div">>
type DialogHeaderProps = React.FC<React.ComponentProps<"div">>
type DialogDescriptionProps = React.FC<DialogPrimitive.DialogDescriptionProps>
type DialogTriggerProps = React.FC<DialogPrimitive.DialogTriggerProps>
type DialogTitleProps = React.FC<DialogPrimitive.DialogTitleProps>
type DialogContentProps = React.FC<
  DialogPrimitive.DialogContentProps & {
    showCloseButton?: boolean
  }
>
type DialogCloseProps = React.FC<DialogPrimitive.DialogCloseProps>
interface DialogProps extends React.FC<DialogPrimitive.DialogProps> {
  Close: DialogCloseProps
  Footer: DialogFooterProps
  Header: DialogHeaderProps
  Description: DialogDescriptionProps
  Trigger: DialogTriggerProps
  Title: DialogTitleProps
  Content: DialogContentProps
}

const Dialog: DialogProps = props => {
  return <DialogPrimitive.Root {...props} />
}

const DialogClose: DialogCloseProps = props => {
  return <DialogPrimitive.Close {...props} />
}

const DialogContent: DialogContentProps = ({
  className,
  children,
  showCloseButton = true,
  ...props
}) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          "bg-white fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl sm:max-w-lg -translate-1/2 rounded-lg border border-zinc-200 shadow-lg p-6 space-y-4",
          className,
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogClose className="absolute right-4 top-4 hover:bg-zinc-100 size-6 flex items-center justify-center rounded-md">
            <XIcon className="size-4 text-zinc-500" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

const DialogTrigger: DialogTriggerProps = props => {
  return <DialogPrimitive.Trigger {...props} />
}

const DialogTitle: DialogTitleProps = ({ className, ...props }) => {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg leading-none font-semibold text-zinc-800",
        className,
      )}
      {...props}
    />
  )
}

const DialogDescription: DialogDescriptionProps = ({ className, ...props }) => {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-zinc-700", className)}
      {...props}
    />
  )
}

const DialogHeader: DialogHeaderProps = ({ className, ...props }) => {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

const DialogFooter: DialogFooterProps = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row gap-2 justify-end",
        className,
      )}
      {...props}
    />
  )
}

Dialog.Footer = DialogFooter
Dialog.Header = DialogHeader
Dialog.Description = DialogDescription
Dialog.Trigger = DialogTrigger
Dialog.Title = DialogTitle
Dialog.Content = DialogContent
Dialog.Close = DialogClose

export {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogClose,
}
