import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { aggregateColumns } from '@/components/tables/aggregate-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Separator } from '@/components/ui/separator'
import { BuildingIcon } from 'lucide-react'
import { Header } from './_components/header'

export default async function Page() {
  const aggregates = await action.aggregate().findMany()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!aggregates.data.length && (
            <EmptyState href="/aggregates/new">
              <BuildingIcon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Cadastrar um novo agregado
              </span>
            </EmptyState>
          )}

          {!!aggregates.data.length && (
            <DataTable columns={aggregateColumns} data={aggregates.data} />
          )}
        </div>
      </main>
    </div>
  )
}
