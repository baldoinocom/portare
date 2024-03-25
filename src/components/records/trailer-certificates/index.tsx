import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { TrailerCertificateFormDialog } from '@/components/forms/form-dialogs/trailer-certificate-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { trailerCertificateColumns } from '@/components/tables/trailer-certificate-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Header } from './header'

export const TrailerCertificates = async () => {
  const [trailerCertificates, trailers] = await Promise.all([
    action.trailerCertificate().findMany(),
    action.trailer({ overwriter: 'trailerCertificate.list' }).findMany(),
  ])

  return (
    <Shield page permission="trailerCertificate.list">
      <Dialog>
        <Header />

        <Separator />

        <main>
          <div className="flex flex-col gap-y-8">
            {!trailerCertificates.data?.length && (
              <DialogTrigger asChild>
                <EmptyState href="#">
                  <PlusIcon
                    strokeWidth={1.2}
                    size={52}
                    className="mx-auto text-muted-foreground"
                  />

                  <span className="mt-2 block text-sm font-semibold">
                    Registrar um novo laudo de reboque
                  </span>
                </EmptyState>
              </DialogTrigger>
            )}

            {!!trailerCertificates.data?.length && (
              <DataTable
                columns={trailerCertificateColumns}
                data={trailerCertificates.data}
              />
            )}
          </div>
        </main>

        <FormDialogContent>
          <TrailerCertificateFormDialog trailers={trailers.data} />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
