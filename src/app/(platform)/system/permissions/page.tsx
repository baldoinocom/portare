import { Shield } from '@/components/shield'
import { DataTable } from '@/components/tables/ui/data-table'
import { Separator } from '@/components/ui/separator'

export default async function Page() {
  const permissions = { data: [] }

  return (
    <Shield page permission="permission.list">
      <div className="space-y-6">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-medium">Permissões</h3>
            <p className="text-sm text-muted-foreground">
              Visualize as permissões disponíveis no sistema
            </p>
          </div>
        </div>

        <Separator />

        <main>
          <DataTable columns={[]} data={permissions.data} />
        </main>
      </div>
    </Shield>
  )
}
