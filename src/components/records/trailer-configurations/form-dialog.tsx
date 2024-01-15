'use client'

import { action } from '@/actions'
import { TrailerConfigurationSchema } from '@/actions/trailer-configuration/schema'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
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
import { TrailerConfiguration } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const FormDialog = ({
  initialData,
}: {
  initialData?: TrailerConfiguration
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof TrailerConfigurationSchema>>({
    resolver: zodResolver(TrailerConfigurationSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const { create, update } = action.trailerConfiguration()

  const { execute } = useAction(create, {
    onSuccess: () => {
      toast({
        title: 'Configuração de reboque registrada com sucesso',
        description: 'A configuração de reboque foi registrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar a configuração de reboque',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Configuração de reboque atualizada com sucesso',
        description: 'A configuração de reboque foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a configuração de reboque',
        description: error,
      })
    },
  })

  const onSubmit = async (
    values: z.infer<typeof TrailerConfigurationSchema>,
  ) => {
    if (initialData) {
      console.log(values)
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {initialData
                ? 'Registro da configuração de reboque'
                : 'Registro de configuração de reboque'}
            </DialogTitle>

            <DialogDescription>
              {initialData
                ? 'Altere as configurações de reboque'
                : 'Regstre novas configurações de reboque'}
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

            <FormField
              control={form.control}
              name="numberOfTrailers"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="col-span-3 text-right">
                      Número de reboques
                    </FormLabel>
                    <FormControl className="col-span-1">
                      <Input
                        {...field}
                        type="number"
                        defaultValue={'1'}
                        min={1}
                        max={4}
                      />
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
    </DialogContent>
  )
}
