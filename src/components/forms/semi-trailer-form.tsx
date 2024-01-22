'use client'

import { action } from '@/actions'
import { SemiTrailerSchema } from '@/actions/semi-trailer/schema'
import { SemiTrailerInclude, UnitInclude } from '@/actions/types'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { UnitSelect } from '@/components/forms/ui/unit-select'
import { InputMask } from '@/components/input-mask'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Form,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Brand, Cargo, TrailerConfiguration, TrailerType } from '@prisma/client'
import { Check, ChevronsUpDown, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const axles = [{ label: 'Normal' }, { label: '4 Eixos', value: 4 }]

export const SemiTrailerForm = ({
  initialData,
  brands,
  trailerTypes,
  cargos,
  trailerConfigurations,
  units,
}: {
  initialData?: SemiTrailerInclude
  brands?: Brand[]
  trailerTypes?: TrailerType[]
  cargos?: Cargo[]
  trailerConfigurations?: TrailerConfiguration[]
  units?: UnitInclude[]
}) => {
  const router = useRouter()

  const { toast } = useToast()

  const getTrailerFields = () => {
    const newLength = Math.max(
      0,
      (initialData?.configuration?.numberOfTrailers || 0) -
        (initialData?.trailers?.length || 0),
    )

    return initialData?.trailers
      ?.map((value) => nullAsUndefined(value))
      ?.concat(Array(newLength).fill({}))
  }

  const form = useForm<z.infer<typeof SemiTrailerSchema>>({
    resolver: zodResolver(SemiTrailerSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      ...nullAsUndefined(initialData?.trailers?.at(0)?.vehicle),
      trailers: getTrailerFields(),
    },
  })

  const {
    fields: cargoFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'cargos',
    keyName: 'key',
  })

  const { fields: trailerFields, replace } = useFieldArray({
    control: form.control,
    name: 'trailers',
  })

  const setTrailerFields = (numberOfTrailers: number) => {
    const fields = Array(numberOfTrailers).fill({
      fleetNumber: '',
      vehicle: { licensePlate: '', renavam: '' },
    })

    replace(fields)
  }

  const { create, update } = action.semiTrailer()

  const { execute } = useAction(create, {
    onSuccess: (data) => {
      router.replace(String(data.id))
      toast({
        title: 'Semirreboque cadastrado com sucesso',
        description: 'O semirreboque foi cadastrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar o semirreboque',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Semirreboque atualizado com sucesso',
        description: 'O semirreboque foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o semirreboque',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof SemiTrailerSchema>) => {
    if (initialData) {
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <FormSession>
            <div>
              <h2 className="text-base font-semibold">
                Informações do veículo
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gerenciar configurações de informações do veículo
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Marca</FormLabel>
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
                                ? brands?.find(({ id }) => id === field.value)
                                    ?.name
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
                                {brands?.map(({ id, name }, index) => (
                                  <CommandItem
                                    key={index}
                                    value={name}
                                    onSelect={() =>
                                      form.setValue(field.name, id, {
                                        shouldDirty: true,
                                      })
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 size-4',
                                        id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {name}
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

              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
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
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <InputMask {...field} mask="9999" placeholder="2024" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="axle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eixos</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o eixo" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {axles.map(({ value, label }, index) => (
                            <SelectItem
                              key={index}
                              title={label as string}
                              value={String(value)}
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">
                Detalhes do semirreboque
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe os detalhes do semirreboque
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tipo</FormLabel>
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
                                ? trailerTypes?.find(
                                    ({ id }) => id === field.value,
                                  )?.name
                                : 'Selecione o tipo'}
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
                                {trailerTypes?.map(({ id, name }, index) => (
                                  <CommandItem
                                    key={index}
                                    value={name}
                                    onSelect={() =>
                                      form.setValue(field.name, id, {
                                        shouldDirty: true,
                                      })
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 size-4',
                                        id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {name}
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

              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="cargos"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tipos de carga</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'h-auto justify-between',
                                !cargoFields?.length && 'text-muted-foreground',
                              )}
                            >
                              {cargoFields?.length ? (
                                <div className="flex flex-wrap gap-2">
                                  {cargos
                                    ?.filter(({ id }) =>
                                      cargoFields.some((v) => v.id === id),
                                    )
                                    .map(({ name }, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="font-medium"
                                      >
                                        {name}
                                      </Badge>
                                    ))}
                                </div>
                              ) : (
                                'Selecione o tipo de carga'
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
                                {cargos?.map(({ id, name }, index) => (
                                  <CommandItem
                                    key={index}
                                    value={name}
                                    onSelect={() => {
                                      if (
                                        cargoFields?.some((v) => v.id === id)
                                      ) {
                                        remove(
                                          cargoFields.findIndex(
                                            (v) => v.id === id,
                                          ),
                                        )
                                      } else {
                                        append({ id })
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 size-4',
                                        cargoFields?.length &&
                                          cargoFields.some((v) => v.id === id)
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {name}
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

              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="configurationId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Configuração</FormLabel>
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
                                ? trailerConfigurations?.find(
                                    ({ id }) => id === field.value,
                                  )?.name
                                : 'Selecione a configuração'}
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
                                {trailerConfigurations?.map(
                                  ({ id, name, numberOfTrailers }, index) => (
                                    <CommandItem
                                      key={index}
                                      value={name}
                                      onSelect={() => {
                                        form.setValue(field.name, id, {
                                          shouldDirty: true,
                                        })
                                        setTrailerFields(numberOfTrailers)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 size-4',
                                          id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {name}
                                    </CommandItem>
                                  ),
                                )}
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
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Reboque</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe os dados do reboque
              </p>
            </div>

            <FormFields>
              {!form.getValues('configurationId') && (
                <div className="sm:col-span-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Aviso</AlertTitle>
                    <AlertDescription>
                      Selecione uma configuração para adicionar reboques
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              {trailerFields.map((trailerField, index) => (
                <div
                  key={trailerField.id}
                  className="flex gap-x-6 sm:col-span-full"
                >
                  <FormField
                    control={form.control}
                    name={`trailers.${index}.vehicle.licensePlate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Placa</FormLabel>
                        <FormControl>
                          <InputMask
                            {...field}
                            mask="aaa-9*99"
                            placeholder="ABC-1234"
                            className="uppercase"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`trailers.${index}.vehicle.renavam`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Renavam</FormLabel>
                        <FormControl>
                          <InputMask
                            {...field}
                            mask="9999 99999 99"
                            placeholder="1234 56789 01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`trailers.${index}.fleetNumber`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Nº de frota</FormLabel>
                        <FormControl>
                          <InputMask
                            {...field}
                            mask="9999"
                            placeholder="0124"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Unidade</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe a unidade
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="unitId"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Unidade</FormLabel>
                      <UnitSelect units={units} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormFields>
          </FormSession>

          {initialData && form.formState.isDirty && (
            <>
              <Separator />

              <FormAlert />

              <div className="flex items-center justify-end space-x-6">
                <Button
                  variant="ghost"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Descartar
                </Button>
                <Button disabled={form.formState.isSubmitting}>
                  Salvar alterações
                </Button>
              </div>
            </>
          )}

          {!initialData && (
            <>
              <Separator />

              <FormAlert />

              <div className="flex items-center justify-end space-x-6">
                <Button disabled={form.formState.isSubmitting}>Salvar</Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
