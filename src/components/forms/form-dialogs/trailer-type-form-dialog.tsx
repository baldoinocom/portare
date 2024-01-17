'use client'

import { action } from '@/actions'
import { TrailerTypeSchema } from '@/actions/trailer-type/schema'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrailerType } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const TrailerTypeFormDialog = ({
  initialData,
}: {
  initialData?: TrailerType
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof TrailerTypeSchema>>({
    resolver: zodResolver(TrailerTypeSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const { create, update } = action.trailerType()

  const { execute } = useAction(create, {
    onSuccess: () => {
      toast({
        title: 'Tipo de reboque registrado com sucesso',
        description: 'O tipo de reboque foi registrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar o tipo de reboque',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Tipo de reboque atualizado com sucesso',
        description: 'O tipo de reboque foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o tipo de reboque',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof TrailerTypeSchema>) => {
    if (initialData) {
      console.log(values)
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? 'Registro do tipo de reboque'
              : 'Registro de tipo de reboque'}
          </DialogTitle>

          <DialogDescription>
            {initialData
              ? 'Altere os tipos de reboque'
              : 'Regstre novos tipos de reboque'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">Nome</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} className="uppercase" />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button disabled={form.formState.isSubmitting}>
            {initialData ? 'Salvar alterações' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
