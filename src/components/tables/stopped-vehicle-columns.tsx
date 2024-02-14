'use client'

import { action } from '@/actions'
import { StoppedVehicleResource } from '@/actions/types'
import { StoppedVehicleFormDialog } from '@/components/forms/form-dialogs/stopped-vehicle-form-dialog'
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
import { formatLicensePlate, formatVehicleStatus } from '@/lib/formatters'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowUpDown, Eye, MoreHorizontal, Trash2Icon } from 'lucide-react'

export const stoppedVehicleColumns: ColumnDef<StoppedVehicleResource>[] = [
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
    id: 'Placa',
    accessorFn: (row) => formatLicensePlate(row.vehicle.licensePlate),
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
    id: 'Status do Veículo',
    accessorFn: (row) => formatVehicleStatus(row.status),
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

const CellActions = ({ item }: { item: StoppedVehicleResource }) => {
  const { id, vehicleId } = item

  const { toast } = useToast()

  const { delete: deleteAction } = action.stoppedVehicle()

  const { execute } = useAction(deleteAction, {
    onSuccess: () => {
      toast({
        title: 'Parada de veículo deletada com sucesso',
        description: 'A parada de veículo foi deletada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar a parada de veículo',
        description: error,
      })
    },
  })

  const handleDelete = async () => {
    await execute({ id, vehicleId })
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
        <StoppedVehicleFormDialog initialData={item} />
      </FormDialogContent>
    </Dialog>
  )
}
