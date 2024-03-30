'use client'

import { GroupResource, UserResource } from '@/actions/types'
import { EmptyState } from '@/components/empty-state'
import { DataTable } from '@/components/tables/ui/data-table'
import { userColumns } from '@/components/tables/user-columns'
import { DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'

export const Main = ({
  users,
  groups,
}: {
  users?: UserResource[]
  groups?: GroupResource[]
}) => {
  return (
    <main>
      {!users?.length && (
        <DialogTrigger asChild>
          <EmptyState href="#">
            <PlusIcon
              strokeWidth={1.2}
              size={52}
              className="mx-auto text-muted-foreground"
            />

            <span className="mt-2 block text-sm font-semibold">
              Cadastrar um novo usuário
            </span>
          </EmptyState>
        </DialogTrigger>
      )}

      {!!users?.length && (
        <DataTable columns={userColumns({ groups })} data={users} />
      )}
    </main>
  )
}
