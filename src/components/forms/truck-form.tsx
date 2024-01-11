'use client'

import { action } from '@/actions'
import { TruckWithRelationshipTypeSchema } from '@/actions/truck/schema'
import { Aggregate, Fleet, Truck } from '@/actions/types'
import { RelationshipType } from '@/components/forms/fields/relationship-type'
import { VehicleInformation } from '@/components/forms/fields/vehicle-information'
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
import { Brand } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const TruckForm = ({
  initialData,
  brands,
  fleets,
  aggregates,
}: {
  initialData?: Truck
  brands: Brand[]
  fleets?: Fleet[]
  aggregates?: Aggregate[]
}) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof TruckWithRelationshipTypeSchema>>({
    resolver: zodResolver(TruckWithRelationshipTypeSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      vehicle: {
        ...nullAsUndefined(initialData?.vehicle),
        relationshipType: initialData?.vehicle?.aggregateId
          ? RelationshipTypeEnum.aggregate
          : RelationshipTypeEnum.fleet,
      },
    },
  })

  const { create, update } = action.truck()

  const { execute } = useAction(create, {
    onSuccess: (data) => {
      router.replace(String(data.id))
      toast({
        title: 'Caminhão cadastrado com sucesso',
        description: 'O caminhão foi cadastrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar o caminhão',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Caminhão atualizado com sucesso',
        description: 'O caminhão foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o caminhão',
        description: error,
      })
    },
  })

  const onSubmit = async (
    values: z.infer<typeof TruckWithRelationshipTypeSchema>,
  ) => {
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
              <h2 className="text-base font-semibold">
                Informações do veículo
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gerenciar configurações de informações do veículo
              </p>
            </div>

            <FormFields>
              <VehicleInformation brands={brands} />
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Unidade</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe a unidade
              </p>
            </div>

            <FormFields>
              <RelationshipType
                type="vehicle"
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
