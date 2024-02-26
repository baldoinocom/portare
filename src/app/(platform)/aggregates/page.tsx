import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { PageContent } from '@/components/page-content'
import { aggregateColumns } from '@/components/tables/aggregate-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Separator } from '@/components/ui/separator'
import { BuildingIcon } from 'lucide-react'
import { Header } from './_components/header'

export default async function Page() {
  const aggregates = await action.aggregate().findMany()

  return (
    <PageContent>
      <Header />

      <Separator />

      <main>
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
      </main>
    </PageContent>
  )
}
