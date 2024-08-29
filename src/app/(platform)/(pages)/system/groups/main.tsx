'use client'

import { GroupResource, RoleResource } from '@/actions/types'
import { EmptyState } from '@/components/empty-state'
import { groupColumns } from '@/components/tables/group-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'

export const Main = ({
  groups,
  roles,
}: {
  groups?: GroupResource[]
  roles?: RoleResource[]
}) => {
  return (
    <main>
      {!groups?.length && (
        <DialogTrigger asChild>
          <EmptyState href="#">
            <PlusIcon
              strokeWidth={1.2}
              size={52}
              className="mx-auto text-muted-foreground"
            />

            <span className="mt-2 block text-sm font-semibold">
              Cadastrar um novo cargos
            </span>
          </EmptyState>
        </DialogTrigger>
      )}

      {!!groups?.length && (
        <DataTable columns={groupColumns({ roles })} data={groups} />
      )}
    </main>
  )
}
