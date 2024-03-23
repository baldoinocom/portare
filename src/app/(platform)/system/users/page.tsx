import { action } from '@/actions'
import { EmptyState } from '@/components/empty-state'
import { UserFormDialog } from '@/components/forms/form-dialogs/user-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { DataTable } from '@/components/tables/ui/data-table'
import { userColumns } from '@/components/tables/user-columns'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'

export default async function Page() {
  const users = await action.user().findMany()

  return (
    <Shield page permission="user.list">
      <Dialog>
        <div className="space-y-6">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium">Usuários</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie os usuários do sistema
              </p>
            </div>

            <div className="mt-5 flex lg:ml-4 lg:mt-0">
              <Shield permission="user.create">
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
            {!users.data?.length && (
              <DialogTrigger asChild>
                <EmptyState href="#">
                  <PlusIcon
                    strokeWidth={1.2}
                    size={52}
                    className="mx-auto text-muted-foreground"
                  />

                  <span className="mt-2 block text-sm font-semibold">
                    Cadastrar um novo usuário
                  </span>
                </EmptyState>
              </DialogTrigger>
            )}

            {!!users.data?.length && (
              <DataTable columns={userColumns} data={users.data} />
            )}
          </main>
        </div>

        <FormDialogContent>
          <UserFormDialog />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
