'use client'

import { action } from '@/actions'
import { GroupingWithUniqueSchema } from '@/actions/grouping/schema'
import {
  DriverResource,
  GroupingResource,
  SemiTrailerResource,
  TruckResource,
} from '@/actions/types'
import { GroupingInformation } from '@/components/forms/fields/grouping-information'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const GroupingFormDialog = ({
  initialData,
  drivers,
  trucks,
  semiTrailers,
}: {
  initialData?: GroupingResource
  drivers?: DriverResource[]
  trucks?: TruckResource[]
  semiTrailers?: SemiTrailerResource[]
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof GroupingWithUniqueSchema>>({
    resolver: zodResolver(GroupingWithUniqueSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const { create, update } = action.grouping()

  const { execute } = useAction(create, {
    onSuccess: () => {
      toast({
        title: 'Agrupamento registrado com sucesso',
        description: 'O agrupamento foi registrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar o agrupamento',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Agrupamento atualizado com sucesso',
        description: 'O agrupamento foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o agrupamento',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof GroupingWithUniqueSchema>) => {
    if (initialData) {
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {initialData
                ? 'Registro do agrupamento'
                : 'Registro de agrupamento'}
            </DialogTitle>

            <DialogDescription>
              {initialData
                ? 'Altere os agrupamentos'
                : 'Regstre novos agrupamentos'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <GroupingInformation
              drivers={drivers}
              trucks={trucks}
              semiTrailers={semiTrailers}
            />
          </div>

          <FormAlert />

          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Loader2
                className={cn(
                  'mr-2 size-4 animate-spin',
                  !form.formState.isSubmitting && 'sr-only',
                )}
              />
              {initialData ? 'Salvar alterações' : 'Salvar'}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  )
}
