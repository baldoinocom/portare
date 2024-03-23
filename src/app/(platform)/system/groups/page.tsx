import { EmptyState } from '@/components/empty-state'
import { Shield } from '@/components/shield'
import { DataTable } from '@/components/tables/ui/data-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'

export default async function Page() {
  const groups = { data: [] }

  return (
    <Shield page permission="group.list">
      <div className="space-y-6">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-medium">Grupos</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie as permissões dos grupos do sistema
            </p>
          </div>

          <div className="mt-5 flex lg:ml-4 lg:mt-0">
            <Shield permission="group.create">
              <Button>
                <PlusIcon className="mr-1.5" />
                Cadastrar
              </Button>
            </Shield>
          </div>
        </div>

        <Separator />

        <main>
          {!groups.data?.length && (
            <EmptyState href="#">
              <PlusIcon
                strokeWidth={1.2}
                size={52}
                className="mx-auto text-muted-foreground"
              />

              <span className="mt-2 block text-sm font-semibold">
                Cadastrar um novo grupo
              </span>
            </EmptyState>
          )}

          {!!groups.data?.length && (
            <DataTable columns={[]} data={groups.data} />
          )}
        </main>
      </div>
    </Shield>
  )
}
