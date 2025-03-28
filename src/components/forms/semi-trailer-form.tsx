'use client'

import { action } from '@/actions'
import { SemiTrailerSchema } from '@/actions/semi-trailer/schema'
import { SemiTrailerResource, UnitResource } from '@/actions/types'
import { BrandSelect } from '@/components/forms/ui/brand-select'
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
  useFormField,
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
import { Check, ChevronsUpDown, Info, Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'

const axles = [
  { label: 'Normal', value: 0 },
  { label: '4 Eixos', value: 4 },
]

export const SemiTrailerForm = ({
  initialData,
  brands,
  trailerTypes,
  cargos,
  trailerConfigurations,
  units,
}: {
  initialData?: SemiTrailerResource
  brands?: Brand[]
  trailerTypes?: TrailerType[]
  cargos?: Cargo[]
  trailerConfigurations?: TrailerConfiguration[]
  units?: UnitResource[]
}) => {
  const pathname = usePathname()
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
      axle: 0,
      ...nullAsUndefined(initialData),
      ...nullAsUndefined(initialData?.trailers?.at(0)?.vehicle),
      trailers: getTrailerFields(),
    },
  })

  const {
    fields: cargoFields,
    append,
    remove,
  } = useFieldArray({ control: form.control, name: 'cargos', keyName: 'key' })

  const { fields: trailerFields, replace } = useFieldArray({
    control: form.control,
    name: 'trailers',
  })

  const setTrailerFields = (numberOfTrailers: number) => {
    const fields = Array(numberOfTrailers).fill({
      vehicle: { licensePlate: '', chassis: '', renavam: '' },
      fleetNumber: '',
    })

    replace(fields)
  }

  const onReset = () => {
    form.reset({ model: '', year: '', cargos: [], trailers: [] })
  }

  const { create, update } = action.semiTrailer()

  const { execute } = useAction(create, {
    onSuccess: () => {
      onReset()

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
      router.replace(pathname.replace(/\/edit$/, ''))

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
    if (!isLS) values.axle = null

    if (initialData) {
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  const isLS =
    trailerConfigurations?.find(
      ({ id }) => id === form.getValues('configurationId'),
    )?.name === 'LS'

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
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Marca</FormLabel>
                      <BrandSelect brands={brands} />
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
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tipo</FormLabel>
                      <TrailerTypeSelect trailerTypes={trailerTypes} />
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
                      <FormLabel>Carga</FormLabel>
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
                                'Selecione a carga'
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
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Configuração</FormLabel>
                      <TrailerConfigurationSelect
                        trailerConfigurations={trailerConfigurations}
                        setTrailerFields={setTrailerFields}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isLS && (
                <div className="sm:col-span-4">
                  <FormField
                    control={form.control}
                    name="axle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eixos</FormLabel>

                        <Select
                          value={String(field.value)}
                          onValueChange={field.onChange}
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
              )}
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
                    name={`trailers.${index}.vehicle.chassis`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Chassi</FormLabel>
                        <FormControl>
                          <InputMask
                            {...field}
                            mask="*** ****** ** ******"
                            placeholder="1AB 123AB1 CD 123456"
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
                  type="reset"
                  variant="ghost"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Descartar
                </Button>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Loader2
                    className={cn(
                      'mr-2 size-4 animate-spin',
                      !form.formState.isSubmitting && 'sr-only',
                    )}
                  />
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Loader2
                    className={cn(
                      'mr-2 size-4 animate-spin',
                      !form.formState.isSubmitting && 'sr-only',
                    )}
                  />
                  Salvar
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

const TrailerTypeSelect = ({
  trailerTypes,
}: {
  trailerTypes?: TrailerType[]
}) => {
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
              ? trailerTypes?.find(({ id }) => id === getValues(name))?.name
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
              {trailerTypes?.map((value, index) => (
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

const TrailerConfigurationSelect = ({
  trailerConfigurations,
  setTrailerFields,
}: {
  trailerConfigurations?: TrailerConfiguration[]
  setTrailerFields: (numberOfTrailers: number) => void
}) => {
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
              ? trailerConfigurations?.find(({ id }) => id === getValues(name))
                  ?.name
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
              {trailerConfigurations?.map((value, index) => (
                <CommandItem
                  key={index}
                  value={value.name}
                  onSelect={() => {
                    setValue(name, value.id, { shouldDirty: true })
                    setTrailerFields(value.numberOfTrailers)
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
