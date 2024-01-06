'use client'

import { action } from '@/actions'
import { FleetSchema } from '@/actions/fleet/schema'
import { Fleet } from '@/actions/types'
import { CompanyInformation } from '@/components/forms/fields/company-information'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const FleetForm = ({ initialData }: { initialData?: Fleet }) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof FleetSchema>>({
    resolver: zodResolver(FleetSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const { execute } = useAction(action.fleet.create, {
    onSuccess: (data) => {
      router.replace(String(data.companyId))
      toast({
        title: 'Frota cadastrada com sucesso',
        description: 'A frota foi cadastrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar a frota',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(action.fleet.update, {
    onSuccess: () => {
      toast({
        title: 'Frota atualizada com sucesso',
        description: 'A frota foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a frota',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof FleetSchema>) => {
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
              <h2 className="text-base font-semibold">Informações da frota</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gerenciar configurações de informações da frota
              </p>
            </div>

            <FormFields>
              <CompanyInformation />
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
