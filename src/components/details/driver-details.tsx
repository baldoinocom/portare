import { DriverResource } from '@/actions/types'
import { Separator } from '@/components/ui/separator'
import { formatDocument, formatPhoneNumber } from '@/lib/formatters'

export const DriverDetails = ({ driver }: { driver?: DriverResource }) => {
  return (
    <div className="mx-1 space-y-8 rounded-lg px-4 py-8 shadow-sm ring-1 ring-border sm:px-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-16">
      <dl className="grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Informações do motorista</dt>
          <dd className="mt-2 text-muted-foreground">
            <div className="flex">
              <span className="text-muted-foreground ">Nome completo</span>
              <span className="ml-4 font-medium text-foreground">
                {driver?.person.name}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Apelido</span>
              <span className="ml-4 font-medium text-foreground">
                {driver?.person.nickname}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">CPF</span>
              <span className="ml-4 font-medium text-foreground">
                {formatDocument(driver?.person.document)}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Telefone</span>
              <span className="ml-4 font-medium text-foreground">
                {formatPhoneNumber(driver?.person.phoneNumber)}
              </span>
            </div>
          </dd>
        </div>

        <Separator className="my-8 sm:sr-only" />

        <div>
          <dt className="font-semibold">Detalhes do motorista</dt>
          <dd className="mt-2 text-muted-foreground">
            <div className="flex">
              <span className="text-muted-foreground ">CNH</span>
              <span className="ml-4 font-medium text-foreground">
                {driver?.cnh}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">CNH espelho</span>
              <span className="ml-4 font-medium text-foreground">
                {driver?.cnhMirror}
              </span>
            </div>
          </dd>
        </div>
      </dl>

      <Separator className="my-8" />

      <div className="text-sm">
        <div className="sm:w-2/3">
          <dt className="font-semibold">Unidade</dt>
          <dd className="mt-2 text-muted-foreground">
            <span className="font-medium text-foreground">
              {driver?.person.unit?.company.name}
            </span>
            <br />
            {driver?.person.unit?.company.address?.city}
          </dd>
        </div>
      </div>
    </div>
  )
}
