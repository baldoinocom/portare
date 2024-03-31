import { SemiTrailerResource } from '@/actions/types'
import { Separator } from '@/components/ui/separator'
import { formatLicensePlate, formatRenavam } from '@/lib/formatters'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

export const SemiTrailerDetails = ({
  semiTrailer,
}: {
  semiTrailer?: SemiTrailerResource
}) => {
  return (
    <div className="mx-1 space-y-8 rounded-lg px-4 py-8 shadow-sm ring-1 ring-border sm:px-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-16">
      <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Informações do semirreboque</dt>
          <dd className="mt-2 text-muted-foreground">
            <div className="flex">
              <span className="text-muted-foreground ">Marca</span>
              <span className="ml-4 font-medium text-foreground">
                {semiTrailer?.trailers.at(0)?.vehicle.brand?.name}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Modelo</span>
              <span className="ml-4 font-medium text-foreground">
                {semiTrailer?.trailers.at(0)?.vehicle.model}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Ano</span>
              <span className="ml-4 font-medium text-foreground">
                {semiTrailer?.trailers.at(0)?.vehicle.year}
              </span>
            </div>
          </dd>
        </div>

        <Separator className="my-8 sm:sr-only" />

        <div>
          <dt className="font-semibold">Detalhes do semirreboque</dt>
          <dd className="mt-2 text-muted-foreground">
            <div className="flex">
              <span className="text-muted-foreground ">Tipo</span>
              <span className="ml-4 font-medium text-foreground">
                {semiTrailer?.type.name}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Carga</span>
              <span className="ml-4 font-medium text-foreground">
                {semiTrailer?.cargos.map(({ name }) => name).join(', ')}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Configuração</span>
              <span className="ml-4 font-medium text-foreground">
                {semiTrailer?.configuration.name}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Eixo</span>
              <span className="ml-4 font-medium text-foreground">
                {semiTrailer?.trailers.at(0)?.vehicle.axle === 4
                  ? '4 Eixos'
                  : 'Normal'}
              </span>
            </div>
          </dd>
        </div>
      </dl>

      <Separator className="my-8" />

      <div className="text-sm">
        <div className="font-semibold">Reboque</div>

        <ScrollArea>
          <ScrollBar orientation="horizontal" />

          <table className="w-full whitespace-nowrap text-left text-sm leading-6">
            <thead>
              <tr className="*:py-2 *:font-semibold">
                <th scope="col">Placa</th>
                <th scope="col" className="pl-8">
                  Chassi
                </th>
                <th scope="col" className="pl-8">
                  Renavam
                </th>
                <th scope="col" className="pl-8">
                  N° de frota
                </th>
              </tr>
            </thead>

            <tbody>
              {semiTrailer?.trailers.map(({ vehicle, fleetNumber }, index) => (
                <tr
                  key={index}
                  className="border-t border-border pt-4 *:py-2 *:align-top *:tabular-nums *:text-muted-foreground"
                >
                  <td>{formatLicensePlate(vehicle.licensePlate)}</td>
                  <td className="pl-8">{vehicle.chassis}</td>
                  <td className="pl-8">{formatRenavam(vehicle.renavam)}</td>
                  <td className="pl-8">{fleetNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      <Separator className="my-8" />

      <div className="text-sm">
        <div className="sm:w-2/3">
          <dt className="font-semibold">Unidade</dt>
          <dd className="mt-2 text-muted-foreground">
            <span className="font-medium text-foreground">
              {semiTrailer?.trailers.at(0)?.vehicle.unit?.company.name}
            </span>
            <br />
            {semiTrailer?.trailers.at(0)?.vehicle.unit?.company.address?.city}
          </dd>
        </div>
      </div>
    </div>
  )
}
