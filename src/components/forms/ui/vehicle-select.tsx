import { VehicleInclude } from '@/actions/types'
import { VehicleDetailCard } from '@/components/forms/ui/vehicle-detail-card'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { FormControl, useFormField } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatLicensePlate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export const VehicleSelect = ({
  vehicles,
}: {
  vehicles?: VehicleInclude[]
}) => {
  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedVehicle = vehicles?.find(({ id }) => id === getValues(name))

  const searchVehicle = (vehicle: VehicleInclude) => {
    return (
      vehicle.brand?.name +
      ' ' +
      vehicle.model +
      ' ' +
      formatLicensePlate(vehicle.licensePlate)
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl className="col-span-3">
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'h-auto justify-between',
              !getValues(name) && 'text-muted-foreground',
            )}
          >
            {selectedVehicle ? (
              <VehicleDetailCard vehicle={selectedVehicle} />
            ) : (
              'Selecione'
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="p-0" align="end">
        <Command>
          <CommandInput placeholder="Pesquisar" />
          <CommandEmpty>Nenhum</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="flex max-h-72 flex-col">
              {selectedVehicle && (
                <>
                  <CommandItem>
                    <Check className="mr-2 size-4 shrink-0 opacity-100" />
                    <VehicleDetailCard vehicle={selectedVehicle} />
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}

              {vehicles
                ?.filter(({ id }) => id !== getValues(name))
                ?.map((value, index) => (
                  <CommandItem
                    key={index}
                    value={searchVehicle(value)}
                    onSelect={() =>
                      setValue(name, value.id, {
                        shouldDirty: true,
                      })
                    }
                  >
                    <div className="w-6" />
                    <VehicleDetailCard vehicle={value} />
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
