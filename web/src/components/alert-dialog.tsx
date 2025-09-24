import * as AlertPrimitive from "@radix-ui/react-alert-dialog"
import React from "react"

import { cn } from "@/utils/cn"

type AlertTriggerProps = React.FC<AlertPrimitive.AlertDialogTriggerProps>
type AlertContentProps = React.FC<AlertPrimitive.AlertDialogContentProps>
type AlertHeaderProps = React.FC<React.ComponentProps<"div">>
type AlertFooterProps = React.FC<React.ComponentProps<"div">>
type AlertTitleProps = React.FC<AlertPrimitive.AlertDialogTitleProps>
type AlertDescriptionProps =
  React.FC<AlertPrimitive.AlertDialogDescriptionProps>
type AlertActionProps = React.FC<AlertPrimitive.AlertDialogActionProps>
type AlertCancelProps = React.FC<AlertPrimitive.AlertDialogCancelProps>
interface AlertProps extends React.FC<AlertPrimitive.AlertDialogProps> {
  Footer: AlertFooterProps
  Header: AlertHeaderProps
  Description: AlertDescriptionProps
  Trigger: AlertTriggerProps
  Title: AlertTitleProps
  Content: AlertContentProps
  Action: AlertActionProps
  Cancel: AlertCancelProps
}

const Alert: AlertProps = props => {
  return <AlertPrimitive.Root {...props} />
}

const AlertTrigger: AlertTriggerProps = ({ ...props }) => {
  return <AlertPrimitive.Trigger {...props} />
}

const AlertContent: AlertContentProps = ({ className, ...props }) => {
  return (
    <AlertPrimitive.Portal>
      <AlertPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <AlertPrimitive.Content
        className={cn(
          "bg-white fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl sm:max-w-lg -translate-1/2 rounded-lg border border-zinc-200 shadow-lg p-6 grid gap-4",
          className,
        )}
        {...props}
      />
    </AlertPrimitive.Portal>
  )
}

const AlertHeader: AlertHeaderProps = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

const AlertFooter: AlertFooterProps = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row justify-end",
        className,
      )}
      {...props}
    />
  )
}

const AlertTitle: AlertTitleProps = ({ className, ...props }) => {
  return (
    <AlertPrimitive.Title
      className={cn(
        "text-lg leading-none font-semibold text-zinc-800",
        className,
      )}
      {...props}
    />
  )
}

const AlertDescription: AlertDescriptionProps = ({ className, ...props }) => {
  return (
    <AlertPrimitive.Description
      className={cn("text-zinc-700 text-sm", className)}
      {...props}
    />
  )
}

const AlertAction: AlertActionProps = ({ className, ...props }) => {
  return (
    <AlertPrimitive.Action
      className={cn(
        "rounded-md select-none outline-none font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none transition-colors text-sm px-4 h-9 has-[>svg]:px-3 bg-blue-600 hover:bg-blue-700 text-white",
        className,
      )}
      {...props}
    />
  )
}

const AlertCancel: AlertCancelProps = ({ className, ...props }) => {
  return (
    <AlertPrimitive.Cancel
      className={cn(
        "rounded-md select-none outline-none font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none transition-colors text-sm px-4 h-9 has-[>svg]:px-3 border bg-white hover:bg-blue-100 border-blue-600 text-blue-600",
        className,
      )}
      {...props}
    />
  )
}

Alert.Trigger = AlertTrigger
Alert.Content = AlertContent
Alert.Header = AlertHeader
Alert.Footer = AlertFooter
Alert.Title = AlertTitle
Alert.Description = AlertDescription
Alert.Action = AlertAction
Alert.Cancel = AlertCancel

export {
  Alert,
  AlertTrigger,
  AlertContent,
  AlertHeader,
  AlertFooter,
  AlertTitle,
  AlertDescription,
  AlertAction,
  AlertCancel,
}
