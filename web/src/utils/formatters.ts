export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function formatDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

export function formatPercentage(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "percent",
  })
}
