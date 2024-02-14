'use client'

import { action } from '@/actions'
import {
  TripSchema,
  TripWithDraftSchema,
  TripWithStepSchema,
} from '@/actions/trips/schema'
import {
  ClientResource,
  DriverResource,
  GroupingResource,
  SemiTrailerResource,
  TripResource,
  TruckResource,
} from '@/actions/types'
import { GroupingInformation } from '@/components/forms/fields/grouping-information'
import { TripInformation } from '@/components/forms/fields/trip-information'
import { GroupingFormDialog } from '@/components/forms/form-dialogs/grouping-form-dialog'
import { ClientSelect } from '@/components/forms/ui/client-select'
import { DepartureAndArrivalDateSelect } from '@/components/forms/ui/departure-and-arrival-date-select'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { GroupingSelect } from '@/components/forms/ui/grouping-select'
import {
  TripFormSteps,
  TripFormStepsFooter,
} from '@/components/forms/ui/trips-form-steps'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { TripSteps } from '@/lib/enums'
import { formatTripStatus } from '@/lib/formatters'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cargo, TripStatus } from '@prisma/client'
import { Check, ChevronsUpDown, Edit3Icon, Loader2 } from 'lucide-react'
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
  initialData?: TripResource
  origins?: ClientResource[]
  destinations?: ClientResource[]
  groupings?: GroupingResource[]
  drivers?: DriverResource[]
  trucks?: TruckResource[]
  semiTrailers?: SemiTrailerResource[]
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

  const { create, createDraft, update } = action.trip()

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

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: (data) => {
      router.replace(String(data.id))
      toast({
        title: 'Viagem atualizada com sucesso',
        description: 'A viagem foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a viagem',
        description: error,
      })
    },
  })

  const onSubmit = async (values: TripFormValues) => {
    if (requiredStep()) return nextStep()

    if (draftStep()) {
      resolverStep()

      const data = TripWithDraftSchema.parse(values)

      if (initialData) {
        await executeUpdate({ id: initialData.id, ...data })
      } else {
        await executeDraft(data)
      }
    } else {
      const data = TripSchema.parse(values)

      if (initialData) {
        await executeUpdate({ id: initialData.id, ...data })
      } else {
        await execute(data)
      }
    }
  }

  const onErrorSubmit = () => {
    if (step !== TripSteps.one) {
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

  const [groupingMode, setGroupingMode] = React.useState(!initialData)

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

  const selectedGrouping = groupings?.find(
    ({ id }) => id === form.getValues('groupingId'),
  )

  const groupingErrors: (keyof z.infer<typeof TripSchema>)[] = [
    'driverId',
    'truckId',
    'semiTrailerId',
  ]

  return (
    <div className="space-y-12">
      <TripFormSteps step={step} onStep={onStep} />

      <Dialog>
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
                        Informe as datas previsões de partida e chegada da
                        viagem
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

                      {!initialData && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="grouping-mode"
                            defaultChecked={groupingMode}
                            onCheckedChange={setGroupingMode}
                          />
                          <Label htmlFor="grouping-mode">
                            Modo agrupamento
                          </Label>
                        </div>
                      )}
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
                                    <DialogTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                      >
                                        <Edit3Icon className="size-4" />
                                      </Button>
                                    </DialogTrigger>
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
                        <GroupingInformation
                          drivers={drivers}
                          trucks={trucks}
                          semiTrailers={semiTrailers}
                        />
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
                <TripInformation
                  status={form.getValues('status')}
                  origin={selectedOrigin}
                  destination={selectedDestination}
                  driver={selectedDriver}
                  truck={selectedTruck}
                  semiTrailer={selectedSemiTrailer}
                  cargo={selectedCargo}
                  note={form.getValues('note')}
                  departedAt={form.getValues('departedAt')}
                  arrivedAt={form.getValues('arrivedAt')}
                />
              )}

              {initialData && form.formState.isDirty && (
                <>
                  <Separator />

                  <FormAlert />

                  <div className="flex items-center justify-end space-x-6">
                    <div className="flex-1">
                      <TripFormStepsFooter step={step} onStep={onStep} />
                    </div>

                    <Button
                      type="reset"
                      variant="ghost"
                      disabled={form.formState.isSubmitting}
                      onClick={() => form.reset()}
                    >
                      Descartar
                    </Button>

                    {initialData.draft && step !== TripSteps.one && (
                      <Button
                        type="submit"
                        variant="outline"
                        onClick={resolverDraftStep}
                        disabled={form.formState.isSubmitting}
                      >
                        <Loader2
                          className={cn(
                            'mr-2 size-4 animate-spin',
                            !form.formState.isSubmitting && 'sr-only',
                          )}
                        />
                        Salvar pre-progamação
                      </Button>
                    )}

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      <Loader2
                        className={cn(
                          'mr-2 size-4 animate-spin',
                          !form.formState.isSubmitting && 'sr-only',
                        )}
                      />
                      {step !== TripSteps.three
                        ? 'Próximo'
                        : 'Salvar alterações'}
                    </Button>
                  </div>
                </>
              )}

              {!initialData && (
                <>
                  <Separator />

                  <FormAlert />

                  <div className="flex items-center justify-end space-x-6">
                    <div className="flex-1">
                      <TripFormStepsFooter step={step} onStep={onStep} />
                    </div>

                    {step !== TripSteps.one && (
                      <Button
                        type="submit"
                        variant="outline"
                        onClick={resolverDraftStep}
                        disabled={form.formState.isSubmitting}
                      >
                        <Loader2
                          className={cn(
                            'mr-2 size-4 animate-spin',
                            !form.formState.isSubmitting && 'sr-only',
                          )}
                        />
                        Salvar pre-progamação
                      </Button>
                    )}

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      <Loader2
                        className={cn(
                          'mr-2 size-4 animate-spin',
                          !form.formState.isSubmitting && 'sr-only',
                        )}
                      />
                      {step !== TripSteps.three ? 'Próximo' : 'Salvar'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </form>
        </Form>

        <FormDialogContent>
          <GroupingFormDialog
            initialData={selectedGrouping}
            drivers={drivers}
            trucks={trucks}
            semiTrailers={semiTrailers}
          />
        </FormDialogContent>
      </Dialog>
    </div>
  )
}
