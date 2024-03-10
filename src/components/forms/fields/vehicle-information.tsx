import { VehicleWithoutRelationshipSchema } from '@/actions/vehicle/schema'
import { BrandSelect } from '@/components/forms/ui/brand-select'
import { InputMask } from '@/components/input-mask'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Brand } from '@prisma/client'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

const axles = [
  { label: 'Normal', value: 0 },
  { label: '4 Eixos', value: 4 },
]

export const VehicleInformation = ({ brands }: { brands?: Brand[] }) => {
  const { control } = useFormContext<{
    vehicle: z.infer<typeof VehicleWithoutRelationshipSchema>
  }>()

  return (
    <>
      <div className="sm:col-span-3">
        <FormField
          control={control}
          name="vehicle.licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  mask="aaa-9*99"
                  placeholder="ABC-1234"
                  className="uppercase"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="vehicle.brandId"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Marca</FormLabel>
              <BrandSelect brands={brands} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="vehicle.model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3">
        <FormField
          control={control}
          name="vehicle.year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <InputMask {...field} mask="9999" placeholder="2024" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="vehicle.axle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eixos</FormLabel>

              <Select
                value={String(field.value)}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o eixo" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {axles.map(({ value, label }, index) => (
                    <SelectItem
                      key={index}
                      title={label as string}
                      value={String(value)}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="vehicle.chassis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chassi</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  mask="*** ****** ** ******"
                  placeholder="1AB 123AB1 CD 123456"
                  className="uppercase"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3">
        <FormField
          control={control}
          name="vehicle.renavam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Renavam</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  mask="9999 99999 99"
                  placeholder="1234 56789 01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
