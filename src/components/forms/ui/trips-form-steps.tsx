const steps = [
  { id: 'Etapa 1', name: 'Programação', href: '#', status: 'active' },
  {
    id: 'Etapa 2',
    name: 'Informações da viagem',
    href: '#',
    status: 'disabled',
  },
  { id: 'Etapa 3', name: 'Resumo', href: '#', status: 'disabled' },
]

export const TripFormSteps = () => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.status === 'active' ? (
              <a
                href={step.href}
                className="flex flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="border-primary text-sm font-medium">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                href={step.href}
                className="group flex flex-col border-l-4 border-border py-2 pl-4 hover:border-muted-foreground md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-accent-foreground">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export const TripFormStepsFooter = () => {
  return (
    <nav className="flex items-center justify-center" aria-label="Progress">
      <p className="text-sm font-medium">
        Etapa {steps.filter((step) => step.status === 'active').length} de{' '}
        {steps.length}
      </p>
      <ol role="list" className="ml-8 flex items-center space-x-5">
        {steps.map((step) => (
          <li key={step.name}>
            {step.status === 'active' ? (
              <a
                href={step.href}
                className="block h-2.5 w-2.5 rounded-full bg-primary hover:bg-muted"
              >
                <span className="sr-only">{step.name}</span>
              </a>
            ) : (
              <a
                href={step.href}
                className="block h-2.5 w-2.5 rounded-full bg-border hover:bg-muted-foreground"
              >
                <span className="sr-only">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
