import { Trailer } from '@/actions/types'
import { TrailerDetailCard } from '@/components/forms/ui/trailer-detail-card'
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

export const TrailerSelect = ({ trailers }: { trailers?: Trailer[] }) => {
  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedTrailer = trailers?.find(({ id }) => id === getValues(name))

  const searchTrailer = (trailer: Trailer) => {
    return (
      trailer.vehicle.brand?.name +
      ' ' +
      trailer.vehicle.model +
      ' ' +
      formatLicensePlate(trailer.vehicle.licensePlate)
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
            {selectedTrailer ? (
              <TrailerDetailCard trailer={selectedTrailer} />
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
              {selectedTrailer && (
                <>
                  <CommandItem>
                    <Check className="mr-2 size-4 shrink-0 opacity-100" />
                    <TrailerDetailCard trailer={selectedTrailer} />
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}

              {trailers
                ?.filter(({ id }) => id !== getValues(name))
                ?.map((value, index) => (
                  <CommandItem
                    key={index}
                    value={searchTrailer(value)}
                    onSelect={() =>
                      setValue(name, value.id, {
                        shouldDirty: true,
                      })
                    }
                  >
                    <div className="w-6" />
                    <TrailerDetailCard trailer={value} />
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
