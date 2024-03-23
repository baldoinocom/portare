import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { TrailerTypeFormDialog } from '@/components/forms/form-dialogs/trailer-type-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { trailerTypeColumns } from '@/components/tables/trailer-type-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const TrailerTypes = async () => {
  const trailerTypes = await action.trailerType().findMany()

  return (
    <Shield page permission="trailerType.list">
      <Dialog>
        <Header />

        <Separator />

        <main>
          <div className="flex flex-col gap-y-8">
            {!trailerTypes.data?.length && (
              <DialogTrigger asChild>
                <EmptyState href="#">
                  <PlusIcon
                    strokeWidth={1.2}
                    size={52}
                    className="mx-auto text-muted-foreground"
                  />

                  <span className="mt-2 block text-sm font-semibold">
                    Registrar um novo tipo de reboque
                  </span>
                </EmptyState>
              </DialogTrigger>
            )}

            {!!trailerTypes.data?.length && (
              <DataTable
                columns={trailerTypeColumns}
                data={trailerTypes.data}
              />
            )}
          </div>
        </main>

        <FormDialogContent>
          <TrailerTypeFormDialog />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
