import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { ASOFormDialog } from '@/components/forms/form-dialogs/aso-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { ASOColumns } from '@/components/tables/aso-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const ASO = async () => {
  const [aso, drivers] = await Promise.all([
    action.aso().findMany(),
    action.driver({ overwriter: 'aso.list' }).findMany(),
  ])

  return (
    <Shield page permission="aso.list">
      <Dialog>
        <Header />

        <Separator />

        <main>
          <div className="flex flex-col gap-y-8">
            {!aso.data?.length && (
              <DialogTrigger asChild>
                <EmptyState href="#">
                  <PlusIcon
                    strokeWidth={1.2}
                    size={52}
                    className="mx-auto text-muted-foreground"
                  />

                  <span className="mt-2 block text-sm font-semibold">
                    Registrar um novo A.S.O
                  </span>
                </EmptyState>
              </DialogTrigger>
            )}

            {!!aso.data?.length && (
              <DataTable columns={ASOColumns} data={aso.data} />
            )}
          </div>
        </main>

        <FormDialogContent>
          <ASOFormDialog drivers={drivers.data} />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
