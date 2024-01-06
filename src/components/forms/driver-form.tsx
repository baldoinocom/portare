'use client'

import { action } from '@/actions'
import { DriverWithRelationshipTypeSchema } from '@/actions/driver/schema'
import { Aggregate, Driver, Fleet } from '@/actions/types'
import { PersonalInformation } from '@/components/forms/fields/personal-information'
import { RelationshipType } from '@/components/forms/fields/relationship-type'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { RelationshipTypeEnum } from '@/lib/enums'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const DriverForm = ({
  initialData,
  fleets,
  aggregates,
}: {
  initialData?: Driver
  fleets?: Fleet[]
  aggregates?: Aggregate[]
}) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof DriverWithRelationshipTypeSchema>>({
    resolver: zodResolver(DriverWithRelationshipTypeSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      person: {
        ...nullAsUndefined(initialData?.person),
        relationshipType: initialData?.person?.aggregateId
          ? RelationshipTypeEnum.aggregate
          : RelationshipTypeEnum.fleet,
      },
    },
  })

  const { create, update } = action.driver()

  const { execute } = useAction(create, {
    onSuccess: (data) => {
      router.replace(String(data.personId))
      toast({
        title: 'Motorista cadastrado com sucesso',
        description: 'O motorista foi cadastrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar o motorista',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Motorista atualizado com sucesso',
        description: 'O motorista foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o motorista',
        description: error,
      })
    },
  })

  const onSubmit = async (
    values: z.infer<typeof DriverWithRelationshipTypeSchema>,
  ) => {
    if (initialData) {
      await executeUpdate({ personId: initialData.personId, ...values })
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
              <h2 className="text-base font-semibold">Informações pessoais</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gerenciar configurações de informações pessoais
              </p>
            </div>

            <FormFields>
              <PersonalInformation />
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Tipo de motorista</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe o tipo de motorista
              </p>
            </div>

            <FormFields>
              <RelationshipType
                type="person"
                fleets={fleets}
                aggregates={aggregates}
              />
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
