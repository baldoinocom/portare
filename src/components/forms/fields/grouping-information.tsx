import { GroupingWithUniqueSchema } from '@/actions/grouping/schema'
import {
  DriverResource,
  SemiTrailerResource,
  TruckResource,
} from '@/actions/types'
import { DriverSelect } from '@/components/forms/ui/driver-select'
import { SemiTrailerSelect } from '@/components/forms/ui/semi-trailer-select'
import { TruckSelect } from '@/components/forms/ui/truck-select'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const GroupingInformation = ({
  drivers,
  trucks,
  semiTrailers,
}: {
  drivers?: DriverResource[]
  trucks?: TruckResource[]
  semiTrailers?: SemiTrailerResource[]
}) => {
  const { control } = useFormContext<z.infer<typeof GroupingWithUniqueSchema>>()

  return (
    <>
      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="driverId"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Motorista</FormLabel>
              <DriverSelect drivers={drivers} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="truckId"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Caminhão</FormLabel>
              <TruckSelect trucks={trucks} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="semiTrailerId"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Semirreboque</FormLabel>
              <SemiTrailerSelect semiTrailers={semiTrailers} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
