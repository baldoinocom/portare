'use client'

import { action } from '@/actions'
import { ClientSchema } from '@/actions/client/schema'
import { Client } from '@/actions/types'
import { CompanyInformation } from '@/components/forms/fields/company-information'
import { ClientTypeCard } from '@/components/forms/ui/client-type-card'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RadioGroup } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClientType } from '@prisma/client'
import {
  FlagTriangleLeftIcon,
  FlagTriangleRightIcon,
  LandPlotIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const ClientForm = ({ initialData }: { initialData?: Client }) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      type: initialData?.type || ClientType.both,
    },
  })

  const { create, update } = action.client()

  const { execute } = useAction(create, {
    onSuccess: (data) => {
      router.replace(String(data.companyId))
      toast({
        title: 'Cliente cadastrado com sucesso',
        description: 'O cliente foi cadastrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar o cliente',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Cliente atualizado com sucesso',
        description: 'O cliente foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o cliente',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof ClientSchema>) => {
    if (initialData) {
      await executeUpdate({ companyId: initialData.companyId, ...values })
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
              <h2 className="text-base font-semibold">
                Informações da empresa
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gerenciar configurações de informações da empresa
              </p>
            </div>

            <FormFields>
              <CompanyInformation />
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Detalhes da empresa</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe os detalhes da empresa
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-full">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <RadioGroup
                        {...field}
                        onValueChange={field.onChange}
                        className="grid grid-cols-3 gap-4"
                      >
                        <ClientTypeCard value={ClientType.origin}>
                          <FlagTriangleLeftIcon
                            strokeWidth={1.5}
                            size={42}
                            className="mb-8"
                          />
                          <span className="text-xs text-muted-foreground">
                            Empresa de
                          </span>
                          Origem
                        </ClientTypeCard>

                        <ClientTypeCard value={ClientType.both}>
                          <LandPlotIcon
                            strokeWidth={1.5}
                            size={42}
                            className="mb-8"
                          />
                          <span className="text-xs text-muted-foreground">
                            Origem/Destino
                          </span>
                          Ambos
                        </ClientTypeCard>

                        <ClientTypeCard value={ClientType.destination}>
                          <FlagTriangleRightIcon
                            strokeWidth={1.5}
                            size={42}
                            className="mb-8"
                          />
                          <span className="text-xs text-muted-foreground">
                            Empresa de
                          </span>
                          Destino
                        </ClientTypeCard>
                      </RadioGroup>
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
