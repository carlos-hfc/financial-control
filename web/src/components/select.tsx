import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/utils/cn"

type SelectItemProps = React.FC<SelectPrimitive.SelectItemProps>
type SelectContentProps = React.FC<SelectPrimitive.SelectContentProps>
type SelectValueProps = React.FC<SelectPrimitive.SelectValueProps>
type SelectTriggerProps = React.FC<SelectPrimitive.SelectTriggerProps>
interface SelectProps extends React.FC<SelectPrimitive.SelectProps> {
  Value: SelectValueProps
  Trigger: SelectTriggerProps
  Content: SelectContentProps
  Item: SelectItemProps
}

const Select: SelectProps = props => {
  return <SelectPrimitive.Root {...props} />
}

const SelectValue: SelectValueProps = props => {
  return <SelectPrimitive.Value {...props} />
}

const SelectTrigger: SelectTriggerProps = ({
  className,
  children,
  ...props
}) => {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "border border-zinc-200 flex min-w-40 w-fit items-center justify-between gap-2 rounded-md bg-white px-3 py-2 text-sm outline-none [&_svg]:shrink-0 data-[state=open]:[&>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-75 transition-transform" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

const SelectContent: SelectContentProps = ({
  className,
  children,
  ...props
}) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "bg-white relative z-50 max-h-(--radix-select-content-available-height) max-w-(--radix-select-trigger-width) overflow-x-hidden overflow-y-auto rounded-md border border-zinc-200 shadow-md translate-y-1",
          className,
        )}
        position="popper"
        {...props}
      >
        <SelectPrimitive.ScrollUpButton />
        <SelectPrimitive.Viewport className="p-1 h-(--radix-select-trigger-height) w-(--radix-select-trigger-width) scroll-my-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

const SelectItem: SelectItemProps = ({ className, children, ...props }) => {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full items-center rounded-sm gap-2 pl-2 pr-8 py-1.5 text-sm outline-hidden select-none [&_svg]:shrink-0 hover:bg-zinc-100 text-zinc-800 focus:bg-zinc-100",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-zinc-800" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

Select.Value = SelectValue
Select.Trigger = SelectTrigger
Select.Item = SelectItem
Select.Content = SelectContent

export { Select, SelectValue, SelectTrigger, SelectItem, SelectContent }
