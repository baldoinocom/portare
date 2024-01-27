'use client'

import { action } from '@/actions'
import { TripStartStepSchema } from '@/actions/trips/schema'
import { ClientInclude } from '@/actions/types'
import { ClientSelect } from '@/components/forms/ui/client-select'
import { DepartureAndArrivalDateSelect } from '@/components/forms/ui/departure-and-arrival-date-select'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { formatTripStatus } from '@/lib/formatters'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trip, TripStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TripFormSteps, TripFormStepsFooter } from './ui/trips-form-steps'

const status = Object.values(TripStatus).map((status) => ({
  label: formatTripStatus(status),
  value: status,
}))

export const TripForm = ({
  initialData,
  origins,
  destinations,
}: {
  initialData?: Trip
  origins?: ClientInclude[]
  destinations?: ClientInclude[]
}) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof TripStartStepSchema>>({
    resolver: zodResolver(TripStartStepSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      departedAt: initialData?.departedAt
        ? new Date(initialData?.departedAt)
        : new Date(),
      arrivedAt: initialData?.arrivedAt
        ? new Date(initialData?.arrivedAt)
        : new Date(),
    },
  })

  const { create, update } = action.trip()

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

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
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

  const onSubmit = async (values: z.infer<typeof TripStartStepSchema>) => {
    console.log(values)

    const queryParams =
      '?' +
      Object.entries(values)
        .map(
          ([key, value]) =>
            encodeURIComponent(key) + '=' + encodeURIComponent(String(value)),
        )
        .join('&')

    router.push(queryParams)
    // if (initialData) {
    //   await executeUpdate({ id: initialData.id, ...values })
    // } else {
    //   await execute(values)
    // }
  }

  return (
    <div className="space-y-12">
      <TripFormSteps />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <FormSession>
              <div>
                <h2 className="text-base font-semibold">Detalhes da viagem</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Informe os detalhes iniciais da viagem
                </p>
              </div>

              <FormFields>
                {/* <div className="sm:col-span-4">
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
              </div> */}

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
                    name="originId"
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
                  <div className="flex-1">
                    <TripFormStepsFooter />
                  </div>

                  <Button disabled={form.formState.isSubmitting}>
                    Próximo
                  </Button>
                </div>
              </>
            )}

            {/* <div className="-mx-4 space-y-8 px-4 py-8 shadow-sm ring-1 ring-border sm:mx-0 sm:rounded-lg sm:px-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-16">
              <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <h2 className="text-lg font-semibold leading-6">Viagem</h2>
                </div>
              </dl>

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
                          Frota
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                        <td>
                          <div className="h-6 w-40 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-16 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-32 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-28 rounded-sm bg-muted" />
                        </td>
                        <td className="flex w-full flex-1 justify-end pl-8">
                          <div className="h-6 w-56 rounded-sm bg-muted" />
                        </td>
                      </tr>
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
                          Frota
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                        <td>
                          <div className="h-6 w-40 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-16 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-10 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-14 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-28 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-28 rounded-sm bg-muted" />
                        </td>
                        <td className="flex w-full flex-1 justify-end pl-8">
                          <div className="h-6 w-56 rounded-sm bg-muted" />
                        </td>
                      </tr>
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
                      <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                        <td>
                          <div className="h-6 w-40 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-20 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-14 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-28 rounded-sm bg-muted" />
                        </td>
                        <td className="pl-8">
                          <div className="h-6 w-28 rounded-sm bg-muted" />
                        </td>
                        <td className="flex w-full flex-1 justify-end pl-8">
                          <div className="h-6 w-56 rounded-sm bg-muted" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>

            <div className="-mx-4 space-y-8 px-4 py-8 shadow-sm ring-1 ring-border sm:mx-0 sm:rounded-lg sm:px-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-16">
              <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <h2 className="text-lg font-semibold leading-6">Viagem</h2>
                </div>

                <div className="mt-2 sm:mt-0">
                  <Badge variant="secondary" className="text-sm">
                    Partido
                  </Badge>
                </div>
              </dl>

              <Separator />

              <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:w-2/3">
                  <dt className="font-semibold">Origem</dt>
                  <dd className="mt-2 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      UNILEVER BRASIL INDUSTRIAL LTDA
                    </span>
                    <br />
                    Avenida das Nacoes Unidas, 14261 Ala A-1 Andar 3 VILA
                    GERTRUDES SAO PAULO - SP 04794-000
                  </dd>
                </div>

                <Separator className="my-8 sm:sr-only" />

                <div className="sm:w-2/3">
                  <dt className="font-semibold">Destino</dt>
                  <dd className="mt-2 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      COMPANHIA DE BEBIDAS DAS AMERICAS - AMBEV
                    </span>
                    <br />
                    Avenida Henry Wall de Carvalho, 7220 Sul DISTRITO INDUSTRIAL
                    TERESINA - PI 64022-050
                  </dd>
                </div>
              </dl>

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
                          Agregado
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                        <td>NICOLAS RIBEIRO BALDOINO</td>
                        <td className="pl-8">NICO</td>
                        <td className="pl-8">{formatCPF('000.000.000-00')}</td>
                        <td className="pl-8">00000000000</td>
                        <td className="w-full pl-8 text-right">
                          ELIAS JUSTINO
                        </td>
                      </tr>
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
                          Agregado
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                        <td>{formatLicensePlate('NIC0000')}</td>
                        <td className="pl-8">VOLVO</td>
                        <td className="pl-8">2024</td>
                        <td className="pl-8">4 Eixos</td>
                        <td className="pl-8">{formatRenavam('00000000000')}</td>
                        <td className="pl-8">00000000000</td>
                        <td className="w-full pl-8 text-right">
                          ELIAS JUSTINO
                        </td>
                      </tr>
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
                      <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                        <td>{formatLicensePlate('NIC0000')}</td>
                        <td className="pl-8">RANDON</td>
                        <td className="pl-8">4 Eixos</td>
                        <td className="pl-8">{formatRenavam('00000000000')}</td>
                        <td className="pl-8">00000000000</td>
                        <td className="w-full pl-8 text-right">
                          COMIX TRANSPORTES LTDA
                        </td>
                      </tr>

                      <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                        <td>{formatLicensePlate('NIC0000')}</td>
                        <td className="pl-8">RANDON</td>
                        <td className="pl-8">4 Eixos</td>
                        <td className="pl-8">{formatRenavam('00000000000')}</td>
                        <td className="pl-8">00000000000</td>
                        <td className="w-full pl-8 text-right">
                          COMIX TRANSPORTES LTDA
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              <Separator />

              <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:w-2/3">
                  <dt className="font-semibold">Observação</dt>
                  <dd className="mt-2 text-muted-foreground">Nenhuma</dd>
                </div>
              </dl>

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
                  <dt className="inline text-muted-foreground">e chegada</dt>{' '}
                  <dd className="inline">
                    <time dateTime="2023-23-01">
                      {format(form.getValues('arrivedAt'), 'PPP', {
                        locale: ptBR,
                      })}
                    </time>
                  </dd>
                </div>
              </dl>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  )
}
