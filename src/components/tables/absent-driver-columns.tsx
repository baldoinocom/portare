'use client'

import { action } from '@/actions'
import { AbsentDriverResource } from '@/actions/types'
import { AbsentDriverFormDialog } from '@/components/forms/form-dialogs/absent-driver-form-dialog'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { formatCPF, formatDriverStatus } from '@/lib/formatters'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowUpDown,
  Edit3Icon,
  MoreHorizontal,
  Trash2Icon,
} from 'lucide-react'

export const absentDriverColumns: ColumnDef<AbsentDriverResource>[] = [
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
    id: 'CPF',
    accessorFn: (row) => formatCPF(row.driver.person.document),
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
    id: 'Data de Início',
    accessorFn: (row) => format(row.startedAt, 'PPP', { locale: ptBR }),
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
    id: 'Data de Fim',
    accessorFn: (row) => format(row.endedAt, 'PPP', { locale: ptBR }),
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
    id: 'Status do Motorista',
    accessorFn: (row) => formatDriverStatus(row.status),
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
    id: 'Observação',
    accessorFn: (row) => row.note,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

const CellActions = ({ item }: { item: AbsentDriverResource }) => {
  const { id, driverId } = item

  const { toast } = useToast()

  const { delete: del } = action.absentDriver()

  const { execute } = useAction(del, {
    onSuccess: () => {
      toast({
        title: 'Ausência de motorista deletada com sucesso',
        description: 'A ausência de motorista foi deletada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar a ausência de motorista',
        description: error,
      })
    },
  })

  const handleDelete = async () => {
    await execute({ id, driverId })
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

          <Shield permission="absentDriver.update">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Edit3Icon className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
          </Shield>

          <Shield permission="absentDriver.delete">
            <DropdownMenuItem onClick={handleDelete}>
              <Trash2Icon className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          </Shield>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormDialogContent>
        <AbsentDriverFormDialog initialData={item} />
      </FormDialogContent>
    </Dialog>
  )
}
