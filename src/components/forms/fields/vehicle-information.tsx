import { VehicleWithoutRelationshipSchema } from '@/actions/vehicle/schema'
import { InputMask } from '@/components/input-mask'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Brand } from '@prisma/client'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const VehicleInformation = ({ brands }: { brands?: Brand[] }) => {
  const { control, setValue } = useFormContext<{
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
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Marca</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? brands?.find(({ id }) => id === field.value)?.name
                        : 'Selecione a marca'}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Pesquisar" />
                    <CommandEmpty>Nenhum</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="flex max-h-72 flex-col">
                        {brands?.map(({ id, name }, index) => (
                          <CommandItem
                            key={index}
                            value={name}
                            onSelect={() =>
                              setValue(field.name, id, { shouldDirty: true })
                            }
                          >
                            <Check
                              className={cn(
                                'mr-2 size-4',
                                id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
