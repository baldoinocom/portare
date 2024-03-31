import { TruckResource } from '@/actions/types'
import { Separator } from '@/components/ui/separator'
import { formatLicensePlate, formatRenavam } from '@/lib/formatters'

export const TruckDetails = ({ truck }: { truck?: TruckResource }) => {
  return (
    <div className="mx-1 space-y-8 rounded-lg px-4 py-8 shadow-sm ring-1 ring-border sm:px-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-16">
      <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Informações do caminhão</dt>
          <dd className="mt-2 text-muted-foreground">
            <div className="flex">
              <span className="text-muted-foreground ">Placa</span>
              <span className="ml-4 font-medium text-foreground">
                {formatLicensePlate(truck?.vehicle.licensePlate)}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Marca</span>
              <span className="ml-4 font-medium text-foreground">
                {truck?.vehicle.brand?.name}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Modelo</span>
              <span className="ml-4 font-medium text-foreground">
                {truck?.vehicle.model}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Ano</span>
              <span className="ml-4 font-medium text-foreground">
                {truck?.vehicle.year}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Eixo</span>
              <span className="ml-4 font-medium text-foreground">
                {truck?.vehicle.axle === 4 ? '4 Eixos' : 'Normal'}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Chassi</span>
              <span className="ml-4 font-medium text-foreground">
                {truck?.vehicle.chassis}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Renavam</span>
              <span className="ml-4 font-medium text-foreground">
                {formatRenavam(truck?.vehicle.renavam)}
              </span>
            </div>
          </dd>
        </div>

        <Separator className="my-8 sm:sr-only" />

        <div>
          <dt className="font-semibold">Detalhes do caminhão</dt>
          <dd className="mt-2 text-muted-foreground">
            <div className="flex">
              <span className="text-muted-foreground ">Compressor</span>
              <span className="ml-4 font-medium text-foreground">
                {truck?.compressor ? 'Sim' : 'Não'}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">
                Modelo do compressor
              </span>
              <span className="ml-4 font-medium text-foreground">
                {truck?.compressorModel}
              </span>
            </div>
          </dd>
        </div>
      </dl>

      <Separator className="my-8" />

      <div className="text-sm">
        <div className="sm:w-2/3">
          <dt className="font-semibold">
            {truck?.vehicle.aggregateId ? 'Agregado' : 'Unidade'}
          </dt>
          <dd className="mt-2 text-muted-foreground">
            <span className="font-medium text-foreground">
              {truck?.vehicle.aggregate?.company.name ||
                truck?.vehicle.unit?.company.name}
            </span>
            <br />
            {truck?.vehicle.aggregate?.company.address?.city ||
              truck?.vehicle.unit?.company.address?.city}
          </dd>
        </div>
      </div>
    </div>
  )
}
