'use client'

import { action } from '@/actions'
import { UserResource } from '@/actions/types'
import { UserFormDialog } from '@/components/forms/form-dialogs/user-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Trash2Icon } from 'lucide-react'

export const userColumns: ColumnDef<UserResource>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | 'indeterminate') =>
          row.toggleSelected(!!value)
        }
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'Nome de Usuário',
    accessorFn: (row) => row.username,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },

  {
    id: 'Grupo',
    accessorFn: (row) => row.groups.map((group) => group.name).join(', '),
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue<string>()}</div>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

export const CellActions = ({ item }: { item: UserResource }) => {
  const { externalUserId } = item

  const { toast } = useToast()

  const { delete: deleteAction } = action.user()

  const { execute } = useAction(deleteAction, {
    onSuccess: () => {
      toast({
        title: 'Usuário deletado com sucesso',
        description: 'O usuário foi deletado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar o usuário',
        description: error,
      })
    },
  })

  const handleDelete = async () => {
    await execute({ externalUserId })
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              Visualizar
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem onClick={handleDelete}>
            <Trash2Icon className="mr-2 size-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormDialogContent>
        <UserFormDialog initialData={item} />
      </FormDialogContent>
    </Dialog>
  )
}
