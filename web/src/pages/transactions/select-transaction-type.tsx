import { cn } from "@/utils/cn"

interface SelectTransactionTypeProps
  extends React.ComponentProps<"input">,
    React.PropsWithChildren {
  transactionType: "income" | "expense"
}

export function SelectTransactionType({
  transactionType,
  className,
  children,
  id,
  ...props
}: SelectTransactionTypeProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "border border-zinc-600 rounded-md relative h-12 grid place-items-center",
        transactionType === "income" &&
          props.checked &&
          "bg-emerald-100 border-emerald-500 text-emerald-700",
        transactionType === "expense" &&
          props.checked &&
          "bg-rose-100 border-rose-500 text-rose-700",
        className,
      )}
    >
      <input
        type="radio"
        id={id}
        className="absolute inset-0 opacity-0"
        {...props}
      />
      {children}
    </label>
  )
}
