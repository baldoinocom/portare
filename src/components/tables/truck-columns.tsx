'use client'

import { action } from '@/actions'
import { TruckResource, VehicleResource } from '@/actions/types'
import { CompanyDetailCard } from '@/components/forms/ui/company-detail-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { formatLicensePlate } from '@/lib/formatters'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Eye, MoreHorizontal, Trash2Icon } from 'lucide-react'
import Link from 'next/link'

export const truckColumns: ColumnDef<TruckResource>[] = [
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
    id: 'ID',
    accessorFn: (row) => row.id,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="font-semibold">{getValue<number>()}</div>
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
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
    id: 'Marca',
    accessorFn: (row) => row.vehicle.brand?.name,
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
    id: 'Modelo',
    accessorFn: (row) => row.vehicle.model,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Ano',
    accessorFn: (row) => row.vehicle.year,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Eixo',
    accessorFn: (row) => row.vehicle.axle,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div>{getValue<number>() === 4 ? '4 Eixos' : 'Normal'}</div>
    ),
  },

  {
    id: 'Comprenssor',
    accessorFn: (row) => row.compressor,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => <div>{getValue<boolean>() ? 'Sim' : 'Não'}</div>,
  },

  {
    id: 'Frota/Agregado',
    accessorFn: (row) => row.vehicle,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => {
      const vehicle = getValue<VehicleResource>()

      return (
        <div>
          {vehicle.unit && <CompanyDetailCard company={vehicle.unit.company} />}
          {vehicle.aggregate && (
            <CompanyDetailCard company={vehicle.aggregate.company} />
          )}
        </div>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

const CellActions = ({ item }: { item: TruckResource }) => {
  const { id } = item

  const { toast } = useToast()

  const { delete: deleteAction } = action.truck()

  const { execute } = useAction(deleteAction, {
    onSuccess: () => {
      toast({
        title: 'Caminhão deletado com sucesso',
        description: 'O caminhão foi deletado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar o caminhão',
        description: error,
      })
    },
  })

  const handleDelete = async () => {
    await execute({ id })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link href={'/trucks/' + id}>
            <Eye className="mr-2 size-4" />
            Visualizar
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDelete}>
          <Trash2Icon className="mr-2 size-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
