import { Aggregate } from '@/actions/types'
import { CompanyDetailCard } from '@/components/forms/ui/company-detail-card'
import { PersonDetailCard } from '@/components/forms/ui/person-detail-card'
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
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export const AggregateSelect = ({
  aggregates,
}: {
  aggregates?: Aggregate[]
}) => {
  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedAggregate = aggregates?.find(({ id }) => id === getValues(name))

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
              <>
                {selectedAggregate.company && (
                  <CompanyDetailCard company={selectedAggregate.company} />
                )}
                {selectedAggregate.person && (
                  <PersonDetailCard person={selectedAggregate.person} />
                )}
              </>
            ) : (
              'Selecione'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    <Check className="mr-2 h-4 w-4 shrink-0 opacity-100" />
                    {selectedAggregate.company && (
                      <CompanyDetailCard company={selectedAggregate.company} />
                    )}
                    {selectedAggregate.person && (
                      <PersonDetailCard person={selectedAggregate.person} />
                    )}
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}
              {aggregates
                ?.filter(({ id }) => id !== getValues(name))
                ?.map((aggregate, index) => (
                  <CommandItem
                    key={index}
                    value={String(aggregate.id)}
                    onSelect={(value) =>
                      setValue(name, Number(value), {
                        shouldDirty: true,
                      })
                    }
                  >
                    <div className="w-6" />
                    {aggregate.company && (
                      <CompanyDetailCard company={aggregate.company} />
                    )}
                    {aggregate.person && (
                      <PersonDetailCard person={aggregate.person} />
                    )}
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
