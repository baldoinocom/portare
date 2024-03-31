'use client'

import { action } from '@/actions'
import { TrailerCertificateResource } from '@/actions/types'
import { TrailerCertificateFormDialog } from '@/components/forms/form-dialogs/trailer-certificate-form-dialog'
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
import { formatExpirationType, formatLicensePlate } from '@/lib/formatters'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowUpDown,
  Edit3Icon,
  MoreHorizontal,
  Trash2Icon,
} from 'lucide-react'

export const trailerCertificateColumns: ColumnDef<TrailerCertificateResource>[] =
  [
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
      accessorFn: (row) => formatLicensePlate(row.trailer.vehicle.licensePlate),
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
      id: 'Nº de Frota',
      accessorFn: (row) => row.trailer.fleetNumber,
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
      id: 'Tipo de Expiração',
      accessorFn: (row) => formatExpirationType(row.expirationType),
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

const CellActions = ({ item }: { item: TrailerCertificateResource }) => {
  const { id, trailerId } = item

  const { toast } = useToast()

  const { delete: del } = action.trailerCertificate()

  const { execute } = useAction(del, {
    onSuccess: () => {
      toast({
        title: 'Laudo de reboque deletado com sucesso',
        description: 'O laudo de reboque foi deletado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar o laudo de reboque',
        description: error,
      })
    },
  })

  const handleDelete = async () => {
    await execute({ id, trailerId })
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

          <Shield permission="trailerCertificate.update">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Edit3Icon className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
          </Shield>

          <Shield permission="trailerCertificate.delete">
            <DropdownMenuItem onClick={handleDelete}>
              <Trash2Icon className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          </Shield>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormDialogContent>
        <TrailerCertificateFormDialog initialData={item} />
      </FormDialogContent>
    </Dialog>
  )
}
