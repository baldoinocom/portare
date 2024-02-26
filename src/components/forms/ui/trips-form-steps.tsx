const steps = [
  { step: 1, name: 'Programação' },
  { step: 2, name: 'Informações da viagem' },
  { step: 3, name: 'Resumo' },
]

type TripFormStepsProps = {
  step: string
  onStep?: (step: string) => void
}

export const TripFormSteps = ({ step, onStep }: TripFormStepsProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((item, index) => (
          <li key={index} className="md:flex-1">
            {String(item.step) <= step ? (
              <div
                onClick={() => onStep && onStep(String(item.step))}
                className="flex cursor-pointer flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="border-primary text-sm font-medium">
                  Etapa {item.step}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ) : (
              <div
                onClick={() => onStep && onStep(String(item.step))}
                className="group flex cursor-pointer flex-col border-l-4 border-border py-2 pl-4 hover:border-muted-foreground md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-accent-foreground">
                  Etapa {item.step}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export const TripFormStepsFooter = ({ step, onStep }: TripFormStepsProps) => {
  const currentStep = steps.filter((item) => String(item.step) <= step).length

  return (
    <nav className="flex items-center justify-center" aria-label="Progress">
      <p className="text-sm font-medium">
        Etapa {currentStep} de {steps.length}
      </p>
      <ol role="list" className="ml-8 flex items-center space-x-5">
        {steps.map((item, index) => (
          <li key={index}>
            {String(item.step) <= step ? (
              <div
                onClick={() => onStep && onStep(String(item.step))}
                className="block size-2.5 cursor-pointer rounded-full bg-primary hover:bg-muted"
              >
                <span className="sr-only">{item.name}</span>
              </div>
            ) : (
              <div
                onClick={() => onStep && onStep(String(item.step))}
                className="block size-2.5 cursor-pointer rounded-full bg-border hover:bg-muted-foreground"
              >
                <span className="sr-only">{item.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
