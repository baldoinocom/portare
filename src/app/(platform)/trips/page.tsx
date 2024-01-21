import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { tripColumns } from '@/components/tables/trip-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Separator } from '@/components/ui/separator'
import { MapPinnedIcon } from 'lucide-react'
import { Header } from './_components/header'

export default async function Page() {
  const trips = await action.trip().findMany()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!trips.data.length && (
            <EmptyState href="/trips/new">
              <MapPinnedIcon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Registrar uma nova viagem
              </span>
            </EmptyState>
          )}

          {!!trips.data.length && (
            <DataTable columns={tripColumns} data={trips.data} />
          )}
        </div>
      </main>
    </div>
  )
}
