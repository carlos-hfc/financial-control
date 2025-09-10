import * as Popover from "@radix-ui/react-popover"
import { format, setDefaultOptions } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/utils/cn"

import { Calendar } from "./calendar"
import { InputRoot } from "./input"

setDefaultOptions({ locale: ptBR })

interface DateRangePickerProps extends React.ComponentProps<"div"> {
  date?: DateRange
  onDateChange(date?: DateRange): void
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  ...props
}: DateRangePickerProps) {
  return (
    <div
      className={cn("grid gap-2 z-50", className)}
      {...props}
    >
      <Popover.Root>
        <Popover.Trigger asChild>
          <InputRoot>
            <InputRoot.Icon>
              <CalendarIcon className="size-4" />
            </InputRoot.Icon>

            <InputRoot.Field
              id="date"
              readOnly
              placeholder="Escolha uma data"
              className="w-2xs justify-start text-left font-normal cursor-default"
              value={
                date?.from
                  ? date.to
                    ? `${format(date.from, "dd LLL y")} - ${format(date.to, "dd LLL y")}`
                    : format(date.from, "dd LLL y")
                  : ""
              }
            />
          </InputRoot>
        </Popover.Trigger>

        <Popover.Content className="bg-white rounded-xl shadow-sm">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
