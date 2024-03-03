'use client'

import { GroupingResource } from '@/actions/types'
import {
  GroupingDetailCard,
  GroupingPreviewCard,
} from '@/components/forms/ui/grouping-detail-card'
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
import { formatCPF, formatLicensePlate } from '@/lib/formatters'
import { cn, nullAsUndefined } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export const GroupingSelect = ({
  groupings,
}: {
  groupings?: GroupingResource[]
}) => {
  const [open, setOpen] = React.useState(false)

  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedGrouping = groupings?.find(({ id }) => id === getValues(name))

  const searchValue = (grouping: GroupingResource) => {
    return (
      grouping.driver?.person.name +
      ' ' +
      grouping.driver?.person.nickname +
      ' ' +
      formatCPF(grouping.driver?.person.document) +
      ' ' +
      grouping.truck?.vehicle.brand?.name +
      ' ' +
      grouping.truck?.vehicle.model +
      ' ' +
      formatLicensePlate(grouping.truck?.vehicle.licensePlate) +
      ' ' +
      grouping.semiTrailer?.trailers?.at(0)?.vehicle.brand?.name +
      ' ' +
      grouping.semiTrailer?.trailers?.at(0)?.vehicle.model +
      ' ' +
      grouping.semiTrailer?.trailers
        .map(({ vehicle }) => formatLicensePlate(vehicle.licensePlate))
        .join(' | ')
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'h-auto',
              !getValues(name) && 'text-wrap text-start text-muted-foreground',
            )}
          >
            {selectedGrouping ? (
              <GroupingDetailCard grouping={selectedGrouping} />
            ) : (
              <div className="flex flex-1 flex-row justify-between">
                <div>Selecione motorista, caminhão e semirreboque</div>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </div>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Pesquisar" />
          <CommandEmpty>Nenhum</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="flex max-h-72 flex-col">
              {selectedGrouping && (
                <>
                  <CommandItem onSelect={() => setOpen(false)}>
                    <Check className="mr-2 size-4 shrink-0 opacity-100" />
                    <GroupingPreviewCard grouping={selectedGrouping} />
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}
              {groupings
                ?.filter(({ id }) => id !== getValues(name))
                ?.map((value, index) => (
                  <CommandItem
                    key={index}
                    value={searchValue(value)}
                    onSelect={() => {
                      const data = nullAsUndefined(value)

                      setValue(name, value.id, { shouldDirty: true })
                      setValue('driverId', data?.driverId, {
                        shouldDirty: true,
                      })
                      setValue('truckId', data?.truckId, {
                        shouldDirty: true,
                      })
                      setValue('semiTrailerId', data?.semiTrailerId, {
                        shouldDirty: true,
                      })

                      setOpen(false)
                    }}
                  >
                    <div className="w-6" />
                    <GroupingPreviewCard grouping={value} />
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
