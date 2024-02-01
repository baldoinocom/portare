import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { tripColumns } from '@/components/tables/trip-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ClipboardCheckIcon, MapPinnedIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default async function Page() {
  const trips = await action.trip().findMany({ draft: true })

  return (
    <main>
      <div className="flex flex-col gap-y-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">Pré-programação</h2>

            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <ClipboardCheckIcon className="mr-1.5" />0 Registros a definir
              </div>
            </div>
          </div>

          <div className="mt-3 space-x-2 sm:ml-4 sm:mt-0">
            <Button asChild>
              <Link href="/trips/new">
                <PlusIcon className="mr-1.5" />
                Registrar
              </Link>
            </Button>
          </div>
        </div>

        <Separator />

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
  )
}
