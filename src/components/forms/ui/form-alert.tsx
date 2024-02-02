import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export const FormAlert = ({ children }: { children?: React.ReactNode }) => {
  const {
    formState: { errors },
  } = useFormContext()

  const errorRootMessage: (error: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
  }) => string | null = (error) => {
    const message = error?.root?.message || error?.['']?.message
    if (message) return message || null

    for (const key in error) {
      const field = error[key]
      if (typeof field === 'object') {
        const result = errorRootMessage(field)
        if (result) return result
      }
    }

    return null
  }

  const body = errors ? errorRootMessage(errors) : children

  if (!body) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>{body}</AlertDescription>
    </Alert>
  )
}
