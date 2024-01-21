import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { DataTable } from '@/components/tables/ui/data-table'
import { unitColumns } from '@/components/tables/unit-columns'
import { Separator } from '@/components/ui/separator'
import { Building2Icon } from 'lucide-react'
import { Header } from './_components/header'

export default async function Page() {
  const units = await action.unit().findMany()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!units.data.length && (
            <EmptyState href="/units/new">
              <Building2Icon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Cadastrar uma nova unidade
              </span>
            </EmptyState>
          )}

          {!!units.data.length && (
            <DataTable columns={unitColumns} data={units.data} />
          )}
        </div>
      </main>
    </div>
  )
}
