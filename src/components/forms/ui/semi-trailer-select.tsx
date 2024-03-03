'use client'

import { SemiTrailerResource } from '@/actions/types'
import { SemiTrailerDetailCard } from '@/components/forms/ui/semi-trailer-detail-card'
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
import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export const SemiTrailerSelect = ({
  semiTrailers,
}: {
  semiTrailers?: SemiTrailerResource[]
}) => {
  const [open, setOpen] = React.useState(false)

  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedSemiTrailer = semiTrailers?.find(
    ({ id }) => id === getValues(name),
  )

  const searchValue = (semiTrailer: SemiTrailerResource) => {
    return (
      semiTrailer?.trailers?.at(0)?.vehicle.brand?.name +
      ' ' +
      semiTrailer?.trailers?.at(0)?.vehicle.model +
      ' ' +
      semiTrailer?.trailers
        .map(({ vehicle }) => formatLicensePlate(vehicle.licensePlate))
        .join(' | ')
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            {selectedSemiTrailer ? (
              <SemiTrailerDetailCard semiTrailer={selectedSemiTrailer} />
            ) : (
              'Selecione'
            )}
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
              {selectedSemiTrailer && (
                <>
                  <CommandItem onSelect={() => setOpen(false)}>
                    <Check className="mr-2 size-4 shrink-0 opacity-100" />
                    <SemiTrailerDetailCard semiTrailer={selectedSemiTrailer} />
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}

              {semiTrailers
                ?.filter(({ id }) => id !== getValues(name))
                ?.map((value, index) => (
                  <CommandItem
                    key={index}
                    value={searchValue(value)}
                    onSelect={() => {
                      setValue(name, value.id, { shouldDirty: true })
                      setOpen(false)
                    }}
                  >
                    <div className="w-6" />
                    <SemiTrailerDetailCard semiTrailer={value} />
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
