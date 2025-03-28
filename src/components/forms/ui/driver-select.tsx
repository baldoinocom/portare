'use client'

import { DriverResource } from '@/actions/types'
import { DriverDetailCard } from '@/components/forms/ui/driver-detail-card'
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
import { formatCPF } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export const DriverSelect = ({ drivers }: { drivers?: DriverResource[] }) => {
  const [open, setOpen] = React.useState(false)

  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedDriver = drivers?.find(
    ({ personId }) => personId === getValues(name),
  )

  const searchValue = (driver: DriverResource) => {
    return (
      driver.person.name +
      ' ' +
      driver.person.nickname +
      ' ' +
      formatCPF(driver.person.document)
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
            {selectedDriver ? (
              <DriverDetailCard driver={selectedDriver} />
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
              {selectedDriver && (
                <>
                  <CommandItem onSelect={() => setOpen(false)}>
                    <Check className="mr-2 size-4 shrink-0 opacity-100" />
                    <DriverDetailCard driver={selectedDriver} />
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}

              {drivers
                ?.filter(({ personId }) => personId !== getValues(name))
                ?.map((value, index) => (
                  <CommandItem
                    key={index}
                    value={searchValue(value)}
                    onSelect={() => {
                      setValue(name, value.personId, { shouldDirty: true })
                      setOpen(false)
                    }}
                  >
                    <div className="w-6" />
                    <DriverDetailCard driver={value} />
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
