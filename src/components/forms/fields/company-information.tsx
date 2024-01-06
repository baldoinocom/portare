import { CompanySchema } from '@/actions/company/schema'
import { InputMask } from '@/components/input-mask'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatUF } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { UF } from '@prisma/client'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

const uf = Object.values(UF).map((uf) => ({
  label: formatUF(uf),
  value: uf,
}))

export const CompanyInformation = () => {
  const { control, setValue } = useFormContext<{
    company: z.infer<typeof CompanySchema>
  }>()

  return (
    <>
      <div className="sm:col-span-full">
        <FormField
          control={control}
          name="company.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da razão social</FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3">
        <FormField
          control={control}
          name="company.tradeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome fantasia</FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="company.cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  mask="99.999.999/9999-99"
                  placeholder="12.345.678/0001-98"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-full">
        <FormField
          control={control}
          name="company.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="company.uf"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>UF</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? uf.find(({ value }) => value === field.value)?.label
                        : 'Selecione o UF'}
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
                        {uf.map((uf, index) => (
                          <CommandItem
                            key={index}
                            value={uf.value}
                            onSelect={() => {
                              setValue(field.name, uf.value as UF, {
                                shouldDirty: true,
                              })
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                uf.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {uf.label}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
