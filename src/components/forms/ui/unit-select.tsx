import { UnitInclude } from '@/actions/types'
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
import { formatCNPJ } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export const UnitSelect = ({ units }: { units?: UnitInclude[] }) => {
  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedUnit = units?.find(
    ({ companyId }) => companyId === getValues(name),
  )

  const searchValue = (unit: UnitInclude) => {
    return (
      unit.company.name +
      ' ' +
      unit.company.tradeName +
      ' ' +
      formatCNPJ(unit.company.cnpj)
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
            {selectedUnit ? (
              <CompanyDetailCard company={selectedUnit.company} />
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
              {selectedUnit && (
                <>
                  <CommandItem>
                    <Check className="mr-2 size-4 shrink-0 opacity-100" />
                    <CompanyDetailCard company={selectedUnit.company} />
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}
              {units
                ?.filter(({ companyId }) => companyId !== getValues(name))
                ?.map((unit, index) => (
                  <CommandItem
                    key={index}
                    value={searchValue(unit)}
                    onSelect={() =>
                      setValue(name, unit.companyId, {
                        shouldDirty: true,
                      })
                    }
                  >
                    <div className="w-6" />
                    <CompanyDetailCard company={unit.company} />
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
