'use client'

import { action } from '@/actions'
import { CargoSchema } from '@/actions/cargo/schema'
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
import { Cargo } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const CargoFormDialog = ({ initialData }: { initialData?: Cargo }) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof CargoSchema>>({
    resolver: zodResolver(CargoSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const { create, update } = action.cargo()

  const { execute } = useAction(create, {
    onSuccess: () => {
      toast({
        title: 'Carga registrada com sucesso',
        description: 'A carga foi registrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar a carga',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Carga atualizada com sucesso',
        description: 'A carga foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a carga',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof CargoSchema>) => {
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
            {initialData ? 'Registro da carga' : 'Registro de carga'}
          </DialogTitle>

          <DialogDescription>
            {initialData ? 'Altere as cargas' : 'Regstre novas cargas'}
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
