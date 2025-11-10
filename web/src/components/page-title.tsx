interface PageTitleProps extends React.PropsWithChildren {
  title: string
  description: string
}

export function PageTitle({ description, title, children }: PageTitleProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-800">{title}</h1>
        <p className="text-sm md:text-base text-zinc-600">{description}</p>
      </div>

      {children}
    </div>
  )
}
