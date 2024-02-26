import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { PageContent } from '@/components/page-content'
import { clientColumns } from '@/components/tables/client-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Separator } from '@/components/ui/separator'
import { FactoryIcon } from 'lucide-react'
import { Header } from './_components/header'

export default async function Page() {
  const clients = await action.client().findMany()

  return (
    <PageContent>
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!clients.data.length && (
            <EmptyState href="/clients/new">
              <FactoryIcon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Cadastrar um novo cliente
              </span>
            </EmptyState>
          )}

          {!!clients.data.length && (
            <DataTable columns={clientColumns} data={clients.data} />
          )}
        </div>
      </main>
    </PageContent>
  )
}
