import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { Shield } from '@/components/shield'
import { driverColumns } from '@/components/tables/driver-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import {
  ClipboardIcon,
  PlusIcon,
  RocketIcon,
  UserPlus2Icon,
} from 'lucide-react'
import Link from 'next/link'
import { ImportButton } from './_components/import-button'

export default async function Page() {
  const [drivers, registrations, inOperation] = await Promise.all([
    action.driver().findMany(),
    db.driver.count(),
    db.driver.count({
      where: {
        trips: {
          some: {
            status: { in: ['loaded', 'departure', 'terminal', 'unloaded'] },
          },
        },
      },
    }),
  ])

  return (
    <Shield page permission="driver.list">
      <main>
        <div className="flex flex-col gap-y-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold">Cadastro de motoristas</h1>

              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <ClipboardIcon className="mr-1.5" />
                  {registrations} Cadastrados
                </div>

                {/* <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <CheckIcon className="mr-1.5" />0 Disponíveis
                </div> */}

                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <RocketIcon className="mr-1.5" />
                  {inOperation} Em viagem
                </div>
              </div>
            </div>

            <div className="mt-3 space-x-2 sm:ml-4 sm:mt-0">
              <ImportButton />

              <Shield permission="driver.create">
                <Button asChild>
                  <Link href="/drivers/new">
                    <PlusIcon className="mr-1.5" />
                    Cadastrar
                  </Link>
                </Button>
              </Shield>
            </div>
          </div>

          <Separator />

          {!drivers.data?.length && (
            <EmptyState href="/drivers/new">
              <UserPlus2Icon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Cadastrar um novo motorista
              </span>
            </EmptyState>
          )}

          {!!drivers.data?.length && (
            <DataTable columns={driverColumns} data={drivers.data} />
          )}
        </div>
      </main>
    </Shield>
  )
}
