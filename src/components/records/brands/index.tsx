import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { BrandFormDialog } from '@/components/forms/form-dialogs/brand-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { brandColumns } from '@/components/tables/brand-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const Brands = async () => {
  const brands = await action.brand().findMany()

  return (
    <Shield page permission="brand.list">
      <Dialog>
        <Header />

        <Separator />

        <main>
          <div className="flex flex-col gap-y-8">
            {!brands.data?.length && (
              <DialogTrigger asChild>
                <EmptyState href="#">
                  <PlusIcon
                    strokeWidth={1.2}
                    size={52}
                    className="mx-auto text-muted-foreground"
                  />

                  <span className="mt-2 block text-sm font-semibold">
                    Registrar uma nova marca
                  </span>
                </EmptyState>
              </DialogTrigger>
            )}

            {!!brands.data?.length && (
              <DataTable columns={brandColumns} data={brands.data} />
            )}
          </div>
        </main>

        <FormDialogContent>
          <BrandFormDialog />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
