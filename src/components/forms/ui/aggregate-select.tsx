import { AggregateResource } from '@/actions/types'
import { CompanyDetailCard } from '@/components/forms/ui/company-detail-card'
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
import { formatDocument } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export const AggregateSelect = ({
  aggregates,
}: {
  aggregates?: AggregateResource[]
}) => {
  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedAggregate = aggregates?.find(
    ({ companyId }) => companyId === getValues(name),
  )

  const searchValue = (aggregate: AggregateResource) => {
    return (
      aggregate.company?.name +
      ' ' +
      aggregate.company?.tradeName +
      ' ' +
      formatDocument(aggregate.company?.document)
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'h-auto justify-between',
              !getValues(name) && 'text-muted-foreground',
            )}
          >
            {selectedAggregate ? (
              <CompanyDetailCard company={selectedAggregate.company} />
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
              {selectedAggregate && (
                <>
                  <CommandItem>
                    <Check className="mr-2 size-4 shrink-0 opacity-100" />
                    <CompanyDetailCard company={selectedAggregate.company} />
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}
              {aggregates
                ?.filter(({ companyId }) => companyId !== getValues(name))
                ?.map((aggregate, index) => (
                  <CommandItem
                    key={index}
                    value={searchValue(aggregate)}
                    onSelect={() =>
                      setValue(name, aggregate.companyId, { shouldDirty: true })
                    }
                  >
                    <div className="w-6" />
                    <CompanyDetailCard company={aggregate.company} />
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
