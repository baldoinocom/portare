'use client'

import { action } from '@/actions'
import { TrailerConfigurationFormDialog } from '@/components/forms/form-dialogs/trailer-configuration-form-dialog'
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
import { TrailerConfiguration } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  Edit3Icon,
  MoreHorizontal,
  Trash2Icon,
} from 'lucide-react'

export const trailerConfigurationColumns: ColumnDef<TrailerConfiguration>[] = [
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
    id: 'Número de Reboques',
    accessorFn: (row) => row.numberOfTrailers,
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
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

const CellActions = ({ item }: { item: TrailerConfiguration }) => {
  const { id } = item

  const { toast } = useToast()

  const { delete: del } = action.trailerConfiguration()

  const { execute } = useAction(del, {
    onSuccess: () => {
      toast({
        title: 'Configuração de reboque deletada com sucesso',
        description: 'A configuração de reboque foi deletada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar a configuração de reboque',
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

          <Shield permission="trailerConfiguration.update">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Edit3Icon className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
          </Shield>

          <Shield permission="trailerConfiguration.delete">
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

      <FormDialogContent>
        <TrailerConfigurationFormDialog initialData={item} />
      </FormDialogContent>
    </Dialog>
  )
}
