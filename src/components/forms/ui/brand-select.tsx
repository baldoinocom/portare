import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { FormControl, useFormField } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Brand } from '@prisma/client'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export const BrandSelect = ({ brands }: { brands?: Brand[] }) => {
  const [open, setOpen] = React.useState(false)

  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'justify-between',
              !getValues(name) && 'text-muted-foreground',
            )}
          >
            {getValues(name)
              ? brands?.find(({ id }) => id === getValues(name))?.name
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
              {brands?.map((value, index) => (
                <CommandItem
                  key={index}
                  value={value.name}
                  onSelect={() => {
                    setValue(name, value.id, { shouldDirty: true })
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value.id === getValues(name)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {value.name}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
