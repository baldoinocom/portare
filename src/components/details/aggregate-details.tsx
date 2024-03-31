import { AggregateResource } from '@/actions/types'
import { Separator } from '@/components/ui/separator'
import { formatCEP, formatDocument } from '@/lib/formatters'

export const AggregateDetails = ({
  aggregate,
}: {
  aggregate?: AggregateResource
}) => {
  return (
    <div className="mx-1 space-y-8 rounded-lg px-4 py-8 shadow-sm ring-1 ring-border sm:px-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:p-16">
      <dl className="grid grid-cols-1 text-sm leading-6">
        <div>
          <dt className="font-semibold">Informações da empresa</dt>
          <dd className="mt-2 text-muted-foreground">
            <div className="flex">
              <span className="text-muted-foreground ">Marca</span>
              <span className="ml-4 font-medium text-foreground">
                {aggregate?.company.name}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Nome fantasia</span>
              <span className="ml-4 font-medium text-foreground">
                {aggregate?.company.tradeName}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">
                {aggregate?.company.type === 'cpf' ? 'CPF' : 'CNPJ'}
              </span>
              <span className="ml-4 font-medium text-foreground">
                {formatDocument(aggregate?.company.document)}
              </span>
            </div>
          </dd>
        </div>

        <Separator className="my-8" />

        <div>
          <dt className="font-semibold">Endereço</dt>
          <dd className="mt-2 text-muted-foreground">
            <div className="flex">
              <span className="text-muted-foreground ">CEP</span>
              <span className="ml-4 font-medium text-foreground">
                {formatCEP(aggregate?.company.address?.zipCode)}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Estado</span>
              <span className="ml-4 font-medium text-foreground">
                {aggregate?.company.address?.state}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Cidade</span>
              <span className="ml-4 font-medium text-foreground">
                {aggregate?.company.address?.city}
              </span>
            </div>

            <div className="flex">
              <span className="text-muted-foreground ">Endereço</span>
              <span className="ml-4 font-medium text-foreground">
                {aggregate?.company.address?.locale}
              </span>
            </div>
          </dd>
        </div>
      </dl>
    </div>
  )
}
