import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { AbsentDriverFormDialog } from '@/components/forms/form-dialogs/absent-driver-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { absentDriverColumns } from '@/components/tables/absent-driver-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const AbsentDrivers = async () => {
  const absentDrivers = await action.absentDriver().findMany()

  const drivers = await action.driver().findMany()

  return (
    <Dialog>
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!absentDrivers.data.length && (
            <DialogTrigger asChild>
              <EmptyState href="#">
                <PlusIcon
                  strokeWidth={1.2}
                  size={52}
                  className="mx-auto text-muted-foreground"
                />

                <span className="mt-2 block text-sm font-semibold">
                  Registrar uma nova ausência de motorista
                </span>
              </EmptyState>
            </DialogTrigger>
          )}

          {!!absentDrivers.data.length && (
            <DataTable
              columns={absentDriverColumns}
              data={absentDrivers.data}
            />
          )}
        </div>
      </main>

      <FormDialogContent>
        <AbsentDriverFormDialog drivers={drivers.data} />
      </FormDialogContent>
    </Dialog>
  )
}
