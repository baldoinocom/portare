import { PersonWithRelationshipTypeSchema } from '@/actions/person/schema'
import { Aggregate, Unit } from '@/actions/types'
import { VehicleWithRelationshipTypeSchema } from '@/actions/vehicle/schema'
import { AggregateSelect } from '@/components/forms/ui/aggregate-select'
import { UnitSelect } from '@/components/forms/ui/unit-select'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const RelationshipType = ({
  type,
  units,
  aggregates,
}: {
  type: 'person' | 'vehicle'
  units?: Unit[]
  aggregates?: Aggregate[]
}) => {
  const { control } = useFormContext<{
    person: z.infer<typeof PersonWithRelationshipTypeSchema>
    vehicle: z.infer<typeof VehicleWithRelationshipTypeSchema>
  }>()

  return (
    <div className="sm:col-span-4">
      <FormField
        control={control}
        name={
          type === 'person'
            ? 'person.relationshipType'
            : 'vehicle.relationshipType'
        }
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <Tabs
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-col space-y-8"
            >
              <TabsList className="flex">
                <TabsTrigger value="unit" className="w-full">
                  Frota
                </TabsTrigger>

                <TabsTrigger value="aggregate" className="w-full">
                  Agregado
                </TabsTrigger>
              </TabsList>

              <TabsContent value="unit">
                <FormField
                  control={control}
                  name={type === 'person' ? 'person.unitId' : 'vehicle.unitId'}
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Unidade</FormLabel>
                      <UnitSelect units={units} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="aggregate">
                <FormField
                  control={control}
                  name={
                    type === 'person'
                      ? 'person.aggregateId'
                      : 'vehicle.aggregateId'
                  }
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Agregado</FormLabel>
                      <AggregateSelect aggregates={aggregates} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
