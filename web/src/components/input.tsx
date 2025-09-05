import { cn } from "@/utils/cn"

type InputIconProps = React.FC<React.ComponentProps<"span">>
type InputFieldProps = React.FC<React.ComponentProps<"input">>
interface InputRootProps extends React.FC<React.ComponentProps<"div">> {
  Field: InputFieldProps
  Icon: InputIconProps
}

const InputField: InputFieldProps = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "placeholder:text-gray-600 text-sm border-0 w-full min-w-0 bg-transparent outline-none",
        className,
      )}
      {...props}
    />
  )
}

const InputIcon: InputIconProps = props => {
  return <span {...props} />
}

const InputRoot: InputRootProps = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 border border-gray-200 rounded-md px-3 h-12",
        className,
      )}
      {...props}
    />
  )
}

InputRoot.Icon = InputIcon
InputRoot.Field = InputField

export { InputRoot, InputField, InputIcon }
