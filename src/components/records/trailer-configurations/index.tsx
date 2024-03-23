import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { TrailerConfigurationFormDialog } from '@/components/forms/form-dialogs/trailer-configuration-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { trailerConfigurationColumns } from '@/components/tables/trailer-configuration-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const TrailerConfigurations = async () => {
  const trailerConfigurations = await action.trailerConfiguration().findMany()

  return (
    <Shield page permission="trailerConfiguration.list">
      <Dialog>
        <Header />

        <Separator />

        <main>
          <div className="flex flex-col gap-y-8">
            {!trailerConfigurations.data?.length && (
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

            {!!trailerConfigurations.data?.length && (
              <DataTable
                columns={trailerConfigurationColumns}
                data={trailerConfigurations.data}
              />
            )}
          </div>
        </main>

        <FormDialogContent>
          <TrailerConfigurationFormDialog />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
