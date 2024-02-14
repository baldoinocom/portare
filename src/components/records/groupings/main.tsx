'use client'

import {
  DriverResource,
  GroupingResource,
  SemiTrailerResource,
  TruckResource,
} from '@/actions/types'
import { EmptyState } from '@/components/empty-state'
import { groupingColumns } from '@/components/tables/grouping-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'

export const Main = ({
  groupings,
  drivers,
  trucks,
  semiTrailers,
}: {
  groupings: GroupingResource[]
  drivers: DriverResource[]
  trucks: TruckResource[]
  semiTrailers: SemiTrailerResource[]
}) => {
  return (
    <main>
      <div className="flex flex-col gap-y-8">
        {!groupings.length && (
          <DialogTrigger asChild>
            <EmptyState href="#">
              <PlusIcon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Registrar um agrupamento
              </span>
            </EmptyState>
          </DialogTrigger>
        )}

        {!!groupings.length && (
          <DataTable
            columns={groupingColumns({ drivers, trucks, semiTrailers })}
            data={groupings}
          />
        )}
      </div>
    </main>
  )
}
