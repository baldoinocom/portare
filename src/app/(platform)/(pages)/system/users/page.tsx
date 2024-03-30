import { action } from '@/actions'
import { UserFormDialog } from '@/components/forms/form-dialogs/user-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { Main } from './main'

export default async function Page() {
  const [users, groups] = await Promise.all([
    action.user().findMany(),
    action.group({ overwriter: 'user.list' }).findMany(),
  ])

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

          <Main users={users.data} groups={groups.data} />
        </div>

        <FormDialogContent>
          <UserFormDialog />
        </FormDialogContent>
      </Dialog>
    </Shield>
  )
}
