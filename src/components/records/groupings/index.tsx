import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { GroupingFormDialog } from '@/components/forms/form-dialogs/grouping-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { groupingColumns } from '@/components/tables/grouping-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const Groupings = async () => {
  const groupings = await action.grouping().findMany()

  return (
    <Dialog>
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          {!groupings.data.length && (
            <DialogTrigger asChild>
              <EmptyState href="#">
                <PlusIcon
                  strokeWidth={1.2}
                  size={52}
                  className="mx-auto text-muted-foreground"
                />

                <span className="mt-2 block text-sm font-semibold">
                  Registrar um agrupamento
                </span>
              </EmptyState>
            </DialogTrigger>
          )}

          {!!groupings.data.length && (
            <DataTable columns={groupingColumns} data={groupings.data} />
          )}
        </div>
      </main>

      <FormDialogContent>
        <GroupingFormDialog />
      </FormDialogContent>
    </Dialog>
  )
}
