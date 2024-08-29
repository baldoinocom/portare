'use client'

import { action } from '@/actions'
import { RoleResource } from '@/actions/types'
import { RoleFormDialog } from '@/components/forms/form-dialogs/role-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  Edit3Icon,
  MoreHorizontal,
  Trash2Icon,
} from 'lucide-react'

export const roleColumns: ColumnDef<RoleResource>[] = [
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
    id: 'Nome',
    accessorFn: (row) => row.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {column.id}
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Permissões',
    accessorFn: (row) => row.permissions.length,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => <div>{getValue<number>()}</div>,
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

const CellActions = ({ item }: { item: RoleResource }) => {
  const { id } = item

  const { toast } = useToast()

  const { delete: del } = action.role()

  const { execute } = useAction(del, {
    onSuccess: () => {
      toast({
        title: 'Função deletada com sucesso',
        description: 'A função foi deletada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar a função',
        description: error,
      })
    },
  })

  const handleDelete = async () => {
    await execute({ id })
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

          <Shield permission="role.update">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Edit3Icon className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
          </Shield>

          <Shield permission="role.delete">
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2Icon className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          </Shield>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormDialogContent className="sm:max-w-[600px]">
        <RoleFormDialog initialData={item} />
      </FormDialogContent>
    </Dialog>
  )
}
