'use client'

import { GroupingSchema } from '@/actions/grouping/schema'
import { GroupingInclude } from '@/actions/types'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const GroupingFormDialog = ({
  initialData,
}: {
  initialData?: GroupingInclude
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof GroupingSchema>>({
    resolver: zodResolver(GroupingSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  // const { create, update } = action.grouping()

  // const { execute } = useAction(create, {
  //   onSuccess: () => {
  //     toast({
  //       title: 'Agrupamento registrado com sucesso',
  //       description: 'O agrupamento foi registrado com sucesso! 🎉',
  //     })
  //   },
  //   onError: (error) => {
  //     toast({
  //       variant: 'destructive',
  //       title: 'Erro ao registrar o agrupamento',
  //       description: error,
  //     })
  //   },
  // })

  // const { execute: executeUpdate } = useAction(update, {
  //   onSuccess: () => {
  //     toast({
  //       title: 'Agrupamento atualizado com sucesso',
  //       description: 'O agrupamento foi atualizado com sucesso! 🎉',
  //     })
  //   },
  //   onError: (error) => {
  //     toast({
  //       variant: 'destructive',
  //       title: 'Erro ao atualizar o agrupamento',
  //       description: error,
  //     })
  //   },
  // })

  const onSubmit = async (values: z.infer<typeof GroupingSchema>) => {
    console.log(values)
    if (initialData) {
      // await executeUpdate({ id: initialData.id, ...values })
    } else {
      // await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <div className="grid gap-4 py-4">{/* FormField */}</div>

        <DialogFooter>
          <Button disabled={form.formState.isSubmitting}>
            {initialData ? 'Salvar alterações' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
