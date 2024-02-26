import { ActionState, FieldErrors } from '@/lib/safe-action'
import * as React from 'react'

type Action<TInput, TOutput> = (
  data: TInput,
) => Promise<ActionState<TInput, TOutput>>

interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void
  onError?: (error: string) => void
  onComplete?: () => void
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {},
) => {
  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TInput> | undefined
  >(undefined)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [data, setData] = React.useState<TOutput | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const execute = React.useCallback(
    async (input: TInput) => {
      setIsLoading(true)

      try {
        const result = await action(input)

        if (!result) return

        setFieldErrors(result.fieldErrors)

        if (result.error) {
          setError(result.error)
          options.onError?.(result.error)
        }

        if (result.data) {
          setData(result.data)
          options.onSuccess?.(result.data)
        }
      } finally {
        setIsLoading(false)
        options.onComplete?.()
      }
    },
    [action, options],
  )

  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading,
  }
}
