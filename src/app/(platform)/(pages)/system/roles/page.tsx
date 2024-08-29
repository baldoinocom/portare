import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { RoleFormDialog } from '@/components/forms/form-dialogs/role-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { roleColumns } from '@/components/tables/role-columns'
import { DataTable } from '@/components/tables/ui/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'

export default async function Page() {
  const roles = await action.role().findMany()

  return (
    <Shield page permission="role.list">
      <Dialog>
        <div className="space-y-6">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium">Funções</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie as funções do sistema
              </p>
            </div>

            <div className="mt-5 flex lg:ml-4 lg:mt-0">
              <Shield permission="role.create">
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-1.5" />
                    Cadastrar
                  </Button>
                </DialogTrigger>
              </Shield>
            </div>
          </div>

          <Separator />

          <main>
            {!roles.data?.length && (
              <DialogTrigger asChild>
                <EmptyState href="#">
                  <PlusIcon
                    strokeWidth={1.2}
                    size={52}
                    className="mx-auto text-muted-foreground"
                  />

                  <span className="mt-2 block text-sm font-semibold">
                    Cadastrar uma nova função
                  </span>
                </EmptyState>
              </DialogTrigger>
            )}

            {!!roles.data?.length && (
              <DataTable columns={roleColumns} data={roles.data} />
            )}
          </main>
        </div>

        <FormDialogContent className="sm:max-w-[600px]">
          <RoleFormDialog />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
