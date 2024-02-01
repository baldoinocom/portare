'use client'

import { action } from '@/actions'
import {
  TripSchema,
  TripWithDraftSchema,
  TripWithStepSchema,
} from '@/actions/trips/schema'
import {
  ClientInclude,
  DriverInclude,
  GroupingInclude,
  SemiTrailerInclude,
  TripInclude,
  TruckInclude,
} from '@/actions/types'
import { ClientSelect } from '@/components/forms/ui/client-select'
import { DepartureAndArrivalDateSelect } from '@/components/forms/ui/departure-and-arrival-date-select'
import { DriverSelect } from '@/components/forms/ui/driver-select'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { GroupingSelect } from '@/components/forms/ui/grouping-select'
import { SemiTrailerSelect } from '@/components/forms/ui/semi-trailer-select'
import {
  TripFormSteps,
  TripFormStepsFooter,
} from '@/components/forms/ui/trips-form-steps'
import { TruckSelect } from '@/components/forms/ui/truck-select'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { TripSteps } from '@/lib/enums'
import {
  formatCPF,
  formatLicensePlate,
  formatRenavam,
  formatTripStatus,
} from '@/lib/formatters'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cargo, TripStatus } from '@prisma/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, ChevronsUpDown, Edit3Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type TripFormValues = z.infer<typeof TripWithStepSchema>

const status = Object.values(TripStatus).map((status) => ({
  label: formatTripStatus(status),
  value: status,
}))

export const TripForm = ({
  initialData,
  origins,
  destinations,
  groupings,
  drivers,
  trucks,
  semiTrailers,
  cargos,
}: {
  initialData?: TripInclude
  origins?: ClientInclude[]
  destinations?: ClientInclude[]
  groupings?: GroupingInclude[]
  drivers?: DriverInclude[]
  trucks?: TruckInclude[]
  semiTrailers?: SemiTrailerInclude[]
  cargos?: Cargo[]
}) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<TripFormValues>({
    resolver: zodResolver(TripWithStepSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      step: TripSteps.one,
      departedAt: initialData?.departedAt
        ? new Date(initialData?.departedAt)
        : new Date(),
      arrivedAt: initialData?.arrivedAt
        ? new Date(initialData?.arrivedAt)
        : new Date(),
    },
  })

  const { create, createDraft } = action.trip()

  const { execute } = useAction(create, {
    onSuccess: (data) => {
      router.replace(String(data.id))
      toast({
        title: 'Viagem registrada com sucesso',
        description: 'A viagem foi registrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar a viagem',
        description: error,
      })
    },
  })

  const { execute: executeDraft } = useAction(createDraft, {
    onSuccess: (data) => {
      router.replace(String(data.id))
      toast({
        title: 'Viagem registrada com sucesso',
        description: 'A viagem foi registrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar a viagem',
        description: error,
      })
    },
  })

  const onSubmit = async (values: TripFormValues) => {
    if (requiredStep()) return nextStep()

    if (draftStep()) {
      resolverStep()

      await executeDraft(TripWithDraftSchema.parse(values))
    } else {
      await execute(TripSchema.parse(values))
    }
  }

  const onErrorSubmit = () => {
    if (!requiredStep()) {
      toast({
        variant: 'destructive',
        title: 'Dados incompletos',
        description: 'Preencha todos os campos obrigatórios',
      })
    }

    if (draftStep()) resolverStep()
  }

  const [step, setStep] = React.useState<TripSteps>(
    form.formState.defaultValues?.step as TripSteps,
  )

  const setStepValue = (step: string) => {
    form.setValue('step', step as TripSteps)
    setStep(step as TripSteps)
  }

  const onStep = (step: string) => {
    router.replace('#')
    setStepValue(step)
  }

  const requiredStep = () => step === TripSteps.one || step === TripSteps.two

  const draftStep = () => step === TripSteps.four || step === TripSteps.five

  const nextStep = () => onStep(String(Number(step) + 1))

  const resolverDraftStep = () => setStepValue(String(Number(step) + 2))

  const resolverStep = () => setStepValue(String(Number(step) - 2))

  const [groupingMode, setGroupingMode] = React.useState(true)

  const selectedOrigin = origins?.find(
    ({ companyId }) => companyId === form.getValues('originId'),
  )

  const selectedDestination = destinations?.find(
    ({ companyId }) => companyId === form.getValues('destinationId'),
  )

  const selectedDriver = drivers?.find(
    ({ personId }) => personId === form.getValues('driverId'),
  )

  const selectedTruck = trucks?.find(
    ({ id }) => id === form.getValues('truckId'),
  )

  const selectedSemiTrailer = semiTrailers?.find(
    ({ id }) => id === form.getValues('semiTrailerId'),
  )

  const selectedCargo = cargos?.find(
    ({ id }) => id === form.getValues('cargoId'),
  )

  const groupingErrors: (keyof z.infer<typeof TripSchema>)[] = [
    'driverId',
    'truckId',
    'semiTrailerId',
  ]

  return (
    <div className="space-y-12">
      <TripFormSteps step={step} onStep={onStep} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onErrorSubmit)}>
          <div className="space-y-12">
            {step === TripSteps.one && (
              <>
                <FormSession>
                  <div>
                    <h2 className="text-base font-semibold">
                      Detalhes da viagem
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Informe os detalhes iniciais da viagem
                    </p>
                  </div>

                  <FormFields>
                    <div className="sm:col-span-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status da viagem</FormLabel>

                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {status.map(({ value, label }, index) => (
                                  <SelectItem
                                    key={index}
                                    title={label as string}
                                    value={value}
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
                      Empresa de origem e destino
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Informe a empresa de origem e destino da viagem
                    </p>
                  </div>

                  <FormFields>
                    <div className="sm:col-span-4">
                      <FormField
                        control={form.control}
                        name="originId"
                        render={() => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Origem</FormLabel>
                            <ClientSelect clients={origins} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <FormField
                        control={form.control}
                        name="destinationId"
                        render={() => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Destino</FormLabel>
                            <ClientSelect clients={destinations} />
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
                      Previsões de partida e chegada
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Informe as datas previsões de partida e chegada da viagem
                    </p>
                  </div>

                  <FormFields>
                    <div className="sm:col-span-4">
                      <FormField
                        control={form.control}
                        name="departedAt"
                        render={() => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de partida e chegada</FormLabel>
                            <DepartureAndArrivalDateSelect />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormFields>
                </FormSession>
              </>
            )}

            {step === TripSteps.two && (
              <>
                <FormSession>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-base font-semibold">
                        Informações da viagem
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Informe as informações da viagem
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="grouping-mode"
                        defaultChecked={groupingMode}
                        onCheckedChange={setGroupingMode}
                      />
                      <Label htmlFor="grouping-mode">Modo agrupamento</Label>
                    </div>
                  </div>

                  <FormFields>
                    {groupingMode ? (
                      <div className="sm:col-span-5">
                        <FormField
                          control={form.control}
                          name="groupingId"
                          render={({ field }) => (
                            <FormItem className="group flex flex-col">
                              <FormLabel className="flex items-center justify-between">
                                Agrupamento
                                {field.value && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                  >
                                    <Edit3Icon className="size-4" />
                                  </Button>
                                )}
                              </FormLabel>
                              <GroupingSelect groupings={groupings} />
                              <FormDescription>
                                Agrupamento de motoristas, caminhões e
                                semirreboques
                              </FormDescription>

                              {groupingErrors.map((name, index) => (
                                <FormField
                                  key={index}
                                  name={name}
                                  render={() => <FormMessage />}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="sm:col-span-4">
                          <FormField
                            control={form.control}
                            name="driverId"
                            render={() => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Motorista</FormLabel>
                                <DriverSelect drivers={drivers} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <FormField
                            control={form.control}
                            name="truckId"
                            render={() => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Caminhão</FormLabel>
                                <TruckSelect trucks={trucks} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <FormField
                            control={form.control}
                            name="semiTrailerId"
                            render={() => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Semirreboque</FormLabel>
                                <SemiTrailerSelect
                                  semiTrailers={semiTrailers}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}

                    <div className="sm:col-span-3">
                      <FormField
                        control={form.control}
                        name="cargoId"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Carga</FormLabel>
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
                                      ? cargos?.find(
                                          ({ id }) => id === field.value,
                                        )?.name
                                      : 'Selecione'}
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
                  </FormFields>
                </FormSession>

                <Separator />

                <FormSession>
                  <div>
                    <h2 className="text-base font-semibold">
                      Informações adicionais
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Informe as informações adicionais da viagem
                    </p>
                  </div>

                  <FormFields>
                    <div className="sm:col-span-3">
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ordem</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observação</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormFields>
                </FormSession>
              </>
            )}

            {step === TripSteps.three && (
              <div className="-mx-4 space-y-8 px-4 py-8 shadow-sm ring-1 ring-border sm:mx-0 sm:rounded-lg sm:px-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-16">
                <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                  <div className="sm:pr-4">
                    <h2 className="text-lg font-semibold leading-6">Viagem</h2>
                  </div>

                  <div className="mt-2 sm:mt-0">
                    {form.getValues('status') ? (
                      <Badge variant="secondary" className="text-sm">
                        {formatTripStatus(form.getValues('status'))}
                      </Badge>
                    ) : (
                      <Skeleton className="h-6 w-24 rounded-full bg-muted" />
                    )}
                  </div>
                </dl>

                {selectedOrigin && selectedDestination && (
                  <>
                    <Separator />

                    <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                      {selectedOrigin && (
                        <div className="sm:w-2/3">
                          <dt className="font-semibold">Origem</dt>
                          <dd className="mt-2 text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {selectedOrigin?.company.name}
                            </span>
                            <br />
                            {selectedOrigin?.company.address}
                          </dd>
                        </div>
                      )}

                      <Separator className="my-8 sm:sr-only" />

                      {selectedDestination && (
                        <div className="sm:w-2/3">
                          <dt className="font-semibold">Destino</dt>
                          <dd className="mt-2 text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {selectedDestination?.company.name}
                            </span>
                            <br />
                            {selectedDestination?.company.address}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </>
                )}

                <Separator />

                <div>
                  <div className="font-semibold">Motorista</div>

                  <ScrollArea>
                    <ScrollBar orientation="horizontal" />

                    <table className="w-full whitespace-nowrap text-left text-sm leading-6">
                      <thead>
                        <tr className="*:py-2 *:font-semibold">
                          <th scope="col">Nome</th>
                          <th scope="col" className="pl-8">
                            Apelido
                          </th>
                          <th scope="col" className="pl-8">
                            CPF
                          </th>
                          <th scope="col" className="pl-8">
                            CNH
                          </th>
                          <th scope="col" className="pl-8 text-right">
                            {selectedDriver?.person.aggregateId
                              ? 'Agregado'
                              : 'Frota'}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedDriver ? (
                          <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                            <td>{selectedDriver?.person.name}</td>
                            <td className="pl-8">
                              {selectedDriver?.person.nickname}
                            </td>
                            <td className="pl-8">
                              {formatCPF(selectedDriver?.person.cpf)}
                            </td>
                            <td className="pl-8">{selectedDriver?.cnh}</td>
                            <td className="w-full pl-8 text-right">
                              {selectedDriver?.person.aggregateId
                                ? selectedDriver.person.aggregate?.personId
                                  ? selectedDriver.person.aggregate?.person
                                      ?.name
                                  : selectedDriver.person.aggregate?.company
                                      ?.name
                                : selectedDriver?.person.unit?.company.name}
                            </td>
                          </tr>
                        ) : (
                          <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                            <td>
                              <Skeleton className="h-6 w-40 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-16 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-32 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-28 rounded-sm bg-muted" />
                            </td>
                            <td className="flex w-full flex-1 justify-end pl-8">
                              <Skeleton className="h-6 w-56 rounded-sm bg-muted" />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <div className="font-semibold">Caminhão</div>

                  <ScrollArea>
                    <ScrollBar orientation="horizontal" />

                    <table className="w-full whitespace-nowrap text-left text-sm leading-6">
                      <thead>
                        <tr className="*:py-2 *:font-semibold">
                          <th scope="col">Placa</th>
                          <th scope="col" className="pl-8">
                            Modelo
                          </th>
                          <th scope="col" className="pl-8">
                            Ano
                          </th>
                          <th scope="col" className="pl-8">
                            Eixo
                          </th>
                          <th scope="col" className="pl-8">
                            Renavam
                          </th>
                          <th scope="col" className="pl-8">
                            Chassi
                          </th>
                          <th scope="col" className="pl-8 text-right">
                            {selectedTruck?.vehicle.aggregateId
                              ? 'Agregado'
                              : 'Frota'}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedTruck ? (
                          <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                            <td>
                              {formatLicensePlate(
                                selectedTruck?.vehicle.licensePlate,
                              )}
                            </td>
                            <td className="pl-8">
                              {selectedTruck?.vehicle.model}
                            </td>
                            <td className="pl-8">
                              {selectedTruck?.vehicle.year}
                            </td>
                            <td className="pl-8">
                              {selectedTruck?.vehicle?.axle
                                ? `${selectedTruck?.vehicle?.axle} Eixos`
                                : 'Normal'}
                            </td>
                            <td className="pl-8">
                              {formatRenavam(selectedTruck?.vehicle.renavam)}
                            </td>
                            <td className="pl-8">
                              {selectedTruck?.vehicle.chassis}
                            </td>
                            <td className="w-full pl-8 text-right">
                              {selectedTruck?.vehicle.aggregateId
                                ? selectedTruck.vehicle.aggregate?.personId
                                  ? selectedTruck.vehicle.aggregate?.person
                                      ?.name
                                  : selectedTruck.vehicle.aggregate?.company
                                      ?.name
                                : selectedTruck?.vehicle.unit?.company.name}
                            </td>
                          </tr>
                        ) : (
                          <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                            <td>
                              <Skeleton className="h-6 w-40 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-16 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-10 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-14 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-28 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-28 rounded-sm bg-muted" />
                            </td>
                            <td className="flex w-full flex-1 justify-end pl-8">
                              <Skeleton className="h-6 w-56 rounded-sm bg-muted" />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <div className="font-semibold">Semirreboque</div>

                  <ScrollArea>
                    <ScrollBar orientation="horizontal" />

                    <table className="w-full whitespace-nowrap text-left text-sm leading-6">
                      <thead>
                        <tr className="*:py-2 *:font-semibold">
                          <th scope="col">Placa</th>
                          <th scope="col" className="pl-8">
                            Marca
                          </th>
                          <th scope="col" className="pl-8">
                            Eixo
                          </th>
                          <th scope="col" className="pl-8">
                            Renavam
                          </th>
                          <th scope="col" className="pl-8">
                            Chassi
                          </th>
                          <th scope="col" className="pl-8 text-right">
                            Frota
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedSemiTrailer?.trailers.length ? (
                          selectedSemiTrailer?.trailers.map(
                            ({ vehicle }, index) => (
                              <tr
                                key={index}
                                className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground"
                              >
                                <td>
                                  {formatLicensePlate(vehicle.licensePlate)}
                                </td>
                                <td className="pl-8">{vehicle.model}</td>
                                <td className="pl-8">
                                  {vehicle?.axle
                                    ? `${vehicle?.axle} Eixos`
                                    : 'Normal'}
                                </td>
                                <td className="pl-8">
                                  {formatRenavam(vehicle.renavam)}
                                </td>
                                <td className="pl-8">{vehicle.chassis}</td>
                                <td className="w-full pl-8 text-right">
                                  {vehicle.unit?.company.name}
                                </td>
                              </tr>
                            ),
                          )
                        ) : (
                          <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                            <td>
                              <Skeleton className="h-6 w-40 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-20 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-14 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-28 rounded-sm bg-muted" />
                            </td>
                            <td className="pl-8">
                              <Skeleton className="h-6 w-28 rounded-sm bg-muted" />
                            </td>
                            <td className="flex w-full flex-1 justify-end pl-8">
                              <Skeleton className="h-6 w-56 rounded-sm bg-muted" />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>

                <Separator />

                <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                  <div className="sm:w-2/3">
                    <dt className="font-semibold">Observação</dt>
                    <dd className="mt-2 text-muted-foreground">
                      {form.getValues('note') || 'Nenhuma'}
                    </dd>
                  </div>
                </dl>

                {form.getValues('departedAt') &&
                  form.getValues('arrivedAt') && (
                    <>
                      <Separator />

                      <dl className="text-sm leading-6">
                        <div>
                          <dt className="inline text-muted-foreground">
                            Data prevista de partida
                          </dt>{' '}
                          <dd className="inline">
                            <time dateTime="2023-23-01">
                              {format(form.getValues('departedAt'), 'PPP', {
                                locale: ptBR,
                              })}
                            </time>
                          </dd>{' '}
                          <dt className="inline text-muted-foreground">
                            e chegada
                          </dt>{' '}
                          <dd className="inline">
                            <time dateTime="2023-23-01">
                              {format(form.getValues('arrivedAt'), 'PPP', {
                                locale: ptBR,
                              })}
                            </time>
                          </dd>
                        </div>
                      </dl>
                    </>
                  )}
              </div>
            )}

            <Separator />

            <FormAlert />

            <div className="flex items-center justify-end space-x-6">
              <div className="flex-1">
                <TripFormStepsFooter step={step} onStep={onStep} />
              </div>

              {step !== TripSteps.one && (
                <Button
                  variant="outline"
                  onClick={resolverDraftStep}
                  disabled={form.formState.isSubmitting}
                >
                  Salvar rascunho
                </Button>
              )}

              <Button disabled={form.formState.isSubmitting}>
                {step !== TripSteps.three ? 'Próximo' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
