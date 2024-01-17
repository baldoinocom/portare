import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { CargoFormDialog } from '@/components/forms/form-dialogs/cargo-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { cargoColumns } from '@/components/tables/cargo-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const Cargos = async () => {
  const cargos = await action.cargo().findMany()

  return (
    <Dialog>
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!cargos.data.length && (
            <DialogTrigger asChild>
              <EmptyState href="#">
                <PlusIcon
                  strokeWidth={1.2}
                  size={52}
                  className="mx-auto text-muted-foreground"
                />

                <span className="mt-2 block text-sm font-semibold">
                  Registrar uma nova carga
                </span>
              </EmptyState>
            </DialogTrigger>
          )}

          {!!cargos.data.length && (
            <DataTable columns={cargoColumns} data={cargos.data} />
          )}
        </div>
      </main>

      <FormDialogContent>
        <CargoFormDialog />
      </FormDialogContent>
    </Dialog>
  )
}
