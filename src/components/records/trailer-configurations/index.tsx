import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { DataTable } from '@/components/records/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { columns } from './columns'
import { FormDialog } from './form-dialog'
import { Header } from './header'

export const TrailerConfigurations = async () => {
  const trailerConfigurations = await action.trailerConfiguration().findMany()

  return (
    <Dialog>
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!trailerConfigurations.data.length && (
            <DialogTrigger asChild>
              <EmptyState href="#">
                <PlusIcon
                  strokeWidth={1.2}
                  size={52}
                  className="mx-auto text-muted-foreground"
                />

                <span className="mt-2 block text-sm font-semibold">
                  Registrar uma nova configuração de reboque
                </span>
              </EmptyState>
            </DialogTrigger>
          )}

          {!!trailerConfigurations.data.length && (
            <DataTable columns={columns} data={trailerConfigurations.data} />
          )}
        </div>
      </main>

      <FormDialog />
    </Dialog>
  )
}
