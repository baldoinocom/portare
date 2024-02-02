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
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrailerType } from '@prisma/client'
import { Loader2 } from 'lucide-react'
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
                ? 'Registro do tipo de reboque'
                : 'Registro de tipo de reboque'}
            </DialogTitle>

            <DialogDescription>
              {initialData
                ? 'Altere os tipos de reboque'
                : 'Regstre novos tipos de reboque'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
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
