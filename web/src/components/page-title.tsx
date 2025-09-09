interface PageTitleProps extends React.PropsWithChildren {
  title: string
  description: string
}

export function PageTitle({ description, title, children }: PageTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-800">{title}</h1>
        <p className="text-zinc-600">{description}</p>
      </div>

      {children}
    </div>
  )
}
