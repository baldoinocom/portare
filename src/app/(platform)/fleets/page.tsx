import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { DataTable } from '@/components/records/ui/data-table'
import { Separator } from '@/components/ui/separator'
import { FactoryIcon } from 'lucide-react'
import { columns } from './_components/columns'
import { Header } from './_components/header'

export default async function Page() {
  const fleets = await action.fleet().findMany()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!fleets.data.length && (
            <EmptyState href="/fleets/new">
              <FactoryIcon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Cadastrar uma nova frota
              </span>
            </EmptyState>
          )}

          {!!fleets.data.length && (
            <DataTable columns={columns} data={fleets.data} />
          )}
        </div>
      </main>
    </div>
  )
}
