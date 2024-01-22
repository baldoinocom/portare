import { ClientInclude } from '@/actions/types'
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

export const ClientSelect = ({ clients }: { clients?: ClientInclude[] }) => {
  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const selectedClient = clients?.find(
    ({ companyId }) => companyId === getValues(name),
  )

  const searchValue = (client: ClientInclude) => {
    return (
      client.company.name +
      ' ' +
      client.company.tradeName +
      ' ' +
      formatCNPJ(client.company.cnpj)
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
            {selectedClient ? (
              <CompanyDetailCard company={selectedClient.company} />
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
              {selectedClient && (
                <>
                  <CommandItem>
                    <Check className="mr-2 size-4 shrink-0 opacity-100" />
                    <CompanyDetailCard company={selectedClient.company} />
                  </CommandItem>
                  <CommandSeparator className="m-1" />
                </>
              )}
              {clients
                ?.filter(({ companyId }) => companyId !== getValues(name))
                ?.map((client, index) => (
                  <CommandItem
                    key={index}
                    value={searchValue(client)}
                    onSelect={() =>
                      setValue(name, client.companyId, {
                        shouldDirty: true,
                      })
                    }
                  >
                    <div className="w-6" />
                    <CompanyDetailCard company={client.company} />
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
