import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { Shield } from '@/components/shield'
import { semiTrailerColumns } from '@/components/tables/semi-trailer-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { ClipboardIcon, PlusIcon, RocketIcon } from 'lucide-react'
import Link from 'next/link'
import { ImportButton } from './_components/import-button'

export default async function Page() {
  const [semiTrailers, registrations, inOperation] = await Promise.all([
    action.semiTrailer().findMany(),
    db.semiTrailer.count(),
    db.semiTrailer.count({
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
    <Shield page permission="semiTrailer.list">
      <main>
        <div className="flex flex-col gap-y-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold">Cadastro de semirreboques</h1>

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

              <Shield permission="semiTrailer.create">
                <Button asChild>
                  <Link href="/semi-trailers/new">
                    <PlusIcon className="mr-1.5" />
                    Cadastrar
                  </Link>
                </Button>
              </Shield>
            </div>
          </div>

          <Separator />

          {!semiTrailers.data?.length && (
            <EmptyState href="/semi-trailers/new">
              <PlusIcon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Cadastrar um novo semirreboque
              </span>
            </EmptyState>
          )}

          {!!semiTrailers.data?.length && (
            <DataTable columns={semiTrailerColumns} data={semiTrailers.data} />
          )}
        </div>
      </main>
    </Shield>
  )
}
