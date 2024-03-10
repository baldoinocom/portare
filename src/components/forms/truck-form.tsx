'use client'

import { action } from '@/actions'
import { RelationshipTypeEnum } from '@/actions/enums'
import { TruckWithRelationshipTypeSchema } from '@/actions/truck/schema'
import { AggregateResource, TruckResource, UnitResource } from '@/actions/types'
import { RelationshipType } from '@/components/forms/fields/relationship-type'
import { VehicleInformation } from '@/components/forms/fields/vehicle-information'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Brand } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const TruckForm = ({
  initialData,
  brands,
  units,
  aggregates,
}: {
  initialData?: TruckResource
  brands: Brand[]
  units?: UnitResource[]
  aggregates?: AggregateResource[]
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof TruckWithRelationshipTypeSchema>>({
    resolver: zodResolver(TruckWithRelationshipTypeSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      vehicle: {
        axle: 0,
        ...nullAsUndefined(initialData?.vehicle),
        relationshipType: initialData?.vehicle?.aggregateId
          ? RelationshipTypeEnum.aggregate
          : RelationshipTypeEnum.unit,
      },
    },
  })

  const onReset = () => {
    form.reset({
      vehicle: {
        licensePlate: '',
        model: '',
        year: '',
        chassis: '',
        renavam: '',
      },
      compressorModel: '',
    })
  }

  const { create, update } = action.truck()

  const { execute } = useAction(create, {
    onSuccess: () => {
      onReset()

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
              <h2 className="text-base font-semibold">Detalhes do caminhão</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe os detalhes do caminhão
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-5">
                <FormField
                  control={form.control}
                  name="compressor"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex flex-col rounded-lg border bg-popover p-4">
                      <div className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Compressor
                          </FormLabel>
                          <FormDescription>
                            Informe se o caminhão possui compressor
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={value} onCheckedChange={onChange} />
                        </FormControl>
                      </div>

                      <div>
                        <FormField
                          control={form.control}
                          name="compressorModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modelo</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="uppercase"
                                  disabled={!value}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Proprietário</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe o proprietário do veículo
              </p>
            </div>

            <FormFields>
              <RelationshipType
                type="vehicle"
                units={units}
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
                  type="reset"
                  variant="ghost"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Descartar
                </Button>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Loader2
                    className={cn(
                      'mr-2 size-4 animate-spin',
                      !form.formState.isSubmitting && 'sr-only',
                    )}
                  />
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Loader2
                    className={cn(
                      'mr-2 size-4 animate-spin',
                      !form.formState.isSubmitting && 'sr-only',
                    )}
                  />
                  Salvar
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
