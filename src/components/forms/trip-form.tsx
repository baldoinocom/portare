'use client'

import { action } from '@/actions'
import { TripSchema } from '@/actions/trips/schema'
import { ClientInclude } from '@/actions/types'
import { ClientSelect } from '@/components/forms/ui/client-select'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trip } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const TripForm = ({
  initialData,
  origins,
  destinations,
}: {
  initialData?: Trip
  origins?: ClientInclude[]
  destinations?: ClientInclude[]
}) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof TripSchema>>({
    resolver: zodResolver(TripSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const { create, update } = action.trip()

  const { execute } = useAction(create, {
    onSuccess: (data) => {
      router.replace(String(data.id))
      toast({
        title: 'Viagem registrada com sucesso',
        description: 'A viagem foi registrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar a viagem',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Viagem atualizada com sucesso',
        description: 'A viagem foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a viagem',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof TripSchema>) => {
    if (initialData) {
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Informações da viagem</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe as informações iniciais da viagem
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordem</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">
                Empresa de origem e destino
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe a empresa de origem e destino da viagem
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="originId"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Origem</FormLabel>
                      <ClientSelect clients={origins} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="originId"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Destino</FormLabel>
                      <ClientSelect clients={destinations} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormFields>
          </FormSession>

          {initialData && form.formState.isDirty && (
            <>
              <Separator />

              <FormAlert />

              <div className="flex items-center justify-end space-x-6">
                <Button
                  variant="ghost"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Descartar
                </Button>
                <Button disabled={form.formState.isSubmitting}>
                  Salvar alterações
                </Button>
              </div>
            </>
          )}

          {!initialData && (
            <>
              <Separator />

              <FormAlert />

              <div className="flex items-center justify-end space-x-6">
                <Button disabled={form.formState.isSubmitting}>Salvar</Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
