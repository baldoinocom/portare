import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { StoppedVehicleFormDialog } from '@/components/forms/form-dialogs/stopped-vehicle-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { stoppedVehicleColumns } from '@/components/tables/stopped-vehicle-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const StoppedVehicles = async () => {
  const [stoppedVehicles, vehicles] = await Promise.all([
    action.stoppedVehicle().findMany(),
    action.vehicle({ overwriter: 'stoppedVehicle.list' }).findMany(),
  ])

  return (
    <Shield page permission="stoppedVehicle.list">
      <Dialog>
        <Header />

        <Separator />

        <main>
          <div className="flex flex-col gap-y-8">
            {!stoppedVehicles.data?.length && (
              <DialogTrigger asChild>
                <EmptyState href="#">
                  <PlusIcon
                    strokeWidth={1.2}
                    size={52}
                    className="mx-auto text-muted-foreground"
                  />

                  <span className="mt-2 block text-sm font-semibold">
                    Registrar uma nova parada de veículo
                  </span>
                </EmptyState>
              </DialogTrigger>
            )}

            {!!stoppedVehicles.data?.length && (
              <DataTable
                columns={stoppedVehicleColumns}
                data={stoppedVehicles.data}
              />
            )}
          </div>
        </main>

        <FormDialogContent>
          <StoppedVehicleFormDialog vehicles={vehicles.data} />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
