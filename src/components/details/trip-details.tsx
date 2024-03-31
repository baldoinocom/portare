import {
  ClientResource,
  DriverResource,
  SemiTrailerResource,
  TruckResource,
} from '@/actions/types'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  formatCPF,
  formatLicensePlate,
  formatRenavam,
  formatTripStatus,
} from '@/lib/formatters'
import { Cargo, TripStatus } from '@prisma/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const TripDetails = ({
  status,
  origin,
  destination,
  driver,
  truck,
  semiTrailer,
  cargo,
  note,
  departedAt,
  arrivedAt,
}: {
  status?: TripStatus | null
  origin?: ClientResource | null
  destination?: ClientResource | null
  driver?: DriverResource | null
  truck?: TruckResource | null
  semiTrailer?: SemiTrailerResource | null
  cargo?: Cargo | null
  note?: string | null
  departedAt?: Date | null
  arrivedAt?: Date | null
}) => {
  return (
    <div className="mx-1 space-y-8 rounded-lg px-4 py-8 shadow-sm ring-1 ring-border sm:px-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-16">
      <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
        <div className="sm:pr-4">
          <h2 className="text-lg font-semibold leading-6">Viagem</h2>
        </div>

        <div className="mt-2 sm:mt-0">
          {status ? (
            <Badge variant="secondary" className="text-sm">
              {formatTripStatus(status)}
            </Badge>
          ) : (
            <Skeleton className="h-6 w-24 rounded-full bg-muted" />
          )}
        </div>
      </dl>

      {origin && destination && (
        <>
          <Separator />

          <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
            {origin && (
              <div className="sm:w-2/3">
                <dt className="font-semibold">Origem</dt>
                <dd className="mt-2 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {origin?.company.name}
                  </span>
                  <br />
                  {origin?.company.address?.city}
                </dd>
              </div>
            )}

            <Separator className="my-8 sm:sr-only" />

            {destination && (
              <div className="sm:w-2/3">
                <dt className="font-semibold">Destino</dt>
                <dd className="mt-2 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {destination?.company.name}
                  </span>
                  <br />
                  {destination?.company.address?.city}
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
                  {driver?.person.aggregateId ? 'Agregado' : 'Frota'}
                </th>
              </tr>
            </thead>

            <tbody>
              {driver ? (
                <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                  <td>{driver?.person.name}</td>
                  <td className="pl-8">{driver?.person.nickname}</td>
                  <td className="pl-8">{formatCPF(driver?.person.document)}</td>
                  <td className="pl-8">{driver?.cnh}</td>
                  <td className="w-full pl-8 text-right">
                    {driver?.person.aggregateId
                      ? driver.person.aggregate?.company.name
                      : driver?.person.unit?.company.name}
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
                  {truck?.vehicle.aggregateId ? 'Agregado' : 'Frota'}
                </th>
              </tr>
            </thead>

            <tbody>
              {truck ? (
                <tr className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground">
                  <td>{formatLicensePlate(truck?.vehicle.licensePlate)}</td>
                  <td className="pl-8">{truck?.vehicle.model}</td>
                  <td className="pl-8">{truck?.vehicle.year}</td>
                  <td className="pl-8">
                    {truck?.vehicle?.axle
                      ? `${truck?.vehicle?.axle} Eixos`
                      : 'Normal'}
                  </td>
                  <td className="pl-8">
                    {formatRenavam(truck?.vehicle.renavam)}
                  </td>
                  <td className="pl-8">{truck?.vehicle.chassis}</td>
                  <td className="w-full pl-8 text-right">
                    {truck?.vehicle.aggregateId
                      ? truck.vehicle.aggregate?.company.name
                      : truck?.vehicle.unit?.company.name}
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
                  Carga
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
              {semiTrailer?.trailers.length ? (
                semiTrailer?.trailers.map(({ vehicle }, index) => (
                  <tr
                    key={index}
                    className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground"
                  >
                    <td>{formatLicensePlate(vehicle.licensePlate)}</td>
                    <td className="pl-8">{vehicle.brand?.name}</td>
                    <td className="pl-8">
                      {vehicle?.axle ? `${vehicle?.axle} Eixos` : 'Normal'}
                    </td>
                    <td className="pl-8">
                      {cargo ? (
                        cargo?.name
                      ) : (
                        <Skeleton className="h-6 w-20 rounded-sm bg-muted" />
                      )}
                    </td>
                    <td className="pl-8">{formatRenavam(vehicle.renavam)}</td>
                    <td className="pl-8">{vehicle.chassis}</td>
                    <td className="w-full pl-8 text-right">
                      {vehicle.unit?.company.name}
                    </td>
                  </tr>
                ))
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
                    <Skeleton className="h-6 w-20 rounded-sm bg-muted" />
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
          <dd className="mt-2 text-muted-foreground">{note || 'Nenhuma'}</dd>
        </div>
      </dl>

      {departedAt && arrivedAt && (
        <>
          <Separator />

          <dl className="text-sm leading-6">
            <div>
              <dt className="inline text-muted-foreground">
                Data prevista de partida
              </dt>{' '}
              <dd className="inline">
                <time dateTime="2023-23-01">
                  {format(departedAt, 'PPP', { locale: ptBR })}
                </time>
              </dd>{' '}
              <dt className="inline text-muted-foreground">e chegada</dt>{' '}
              <dd className="inline">
                <time dateTime="2023-23-01">
                  {format(arrivedAt, 'PPP', { locale: ptBR })}
                </time>
              </dd>
            </div>
          </dl>
        </>
      )}
    </div>
  )
}
