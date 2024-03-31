'use client'

import { action } from '@/actions'
import { CompanyResource, TripResource } from '@/actions/types'
import { CompanyDetailCard } from '@/components/forms/ui/company-detail-card'
import { GroupingPreviewCard } from '@/components/forms/ui/grouping-detail-card'
import { Shield } from '@/components/shield'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { formatTripStatus } from '@/lib/formatters'
import { checkPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { TripStatus } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowUpDown,
  Edit3Icon,
  Eye,
  MoreHorizontal,
  Trash2Icon,
} from 'lucide-react'
import Link from 'next/link'

const status = Object.values(TripStatus).map((status) => ({
  label: formatTripStatus(status),
  value: status,
}))

export const tripColumns: ColumnDef<TripResource>[] = [
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
    id: 'Motorista e Veículos',
    accessorFn: (row) => row,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div>
        {!!getValue() && (
          <GroupingPreviewCard
            grouping={{
              driver: getValue<TripResource>().driver,
              truck: getValue<TripResource>().truck,
              semiTrailer: getValue<TripResource>().semiTrailer,
            }}
          />
        )}
      </div>
    ),
  },

  {
    id: 'Origem',
    accessorFn: (row) => row.origin?.company,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div>
        {!!getValue() && (
          <CompanyDetailCard company={getValue<CompanyResource>()} />
        )}
      </div>
    ),
  },

  {
    id: 'Destino',
    accessorFn: (row) => row.destination?.company,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div>
        {!!getValue() && (
          <CompanyDetailCard company={getValue<CompanyResource>()} />
        )}
      </div>
    ),
  },

  {
    id: 'D/ Partida',
    accessorFn: (row) =>
      row.departedAt ? format(row.departedAt, 'PP', { locale: ptBR }) : '',
    header: ({ column }) => column.id,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },

  {
    id: 'D/ Chegada',
    accessorFn: (row) =>
      row.arrivedAt ? format(row.arrivedAt, 'PP', { locale: ptBR }) : '',
    header: ({ column }) => column.id,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },

  {
    id: 'Status',
    accessorFn: (row) => formatTripStatus(row.status),
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
    cell: ({ row }) => <CellUpdateStatus item={row.original} />,
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

const CellUpdateStatus = ({ item }: { item: TripResource }) => {
  const { permissions } = useShield()

  const { id } = item

  const { toast } = useToast()

  const { updateStatus } = action.trip()

  const { execute } = useAction(updateStatus, {
    onSuccess: () => {
      toast({
        title: 'Status atualizado com sucesso',
        description: 'O status foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o status',
        description: error,
      })
    },
  })

  const handleUpdateStatus = async (status: TripStatus) => {
    await execute({ id, status })
  }

  const check = checkPermission(
    { permission: 'trip.updateStatus', guard: 'component' },
    permissions,
  )

  return (
    <Select
      onValueChange={handleUpdateStatus}
      defaultValue={item.status}
      disabled={!check}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent align="end">
        {status.map(({ value, label }, index) => (
          <SelectItem key={index} title={label as string} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const CellActions = ({ item }: { item: TripResource }) => {
  const { id } = item

  const { toast } = useToast()

  const { delete: del } = action.trip()

  const { execute } = useAction(del, {
    onSuccess: () => {
      toast({
        title: 'Viagem deletada com sucesso',
        description: 'A viagem foi deletada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar a viagem',
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

        <Shield permission="trip.view">
          <DropdownMenuItem asChild>
            <Link href={'/trips/' + id}>
              <Eye className="mr-2 size-4" />
              Visualizar
            </Link>
          </DropdownMenuItem>
        </Shield>

        <Shield permission="trip.update">
          <DropdownMenuItem asChild>
            <Link href={'/trips/' + id + '/edit'}>
              <Edit3Icon className="mr-2 size-4" />
              Editar
            </Link>
          </DropdownMenuItem>
        </Shield>

        <Shield permission="trip.delete">
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2Icon className="mr-2 size-4" />
            Excluir
          </DropdownMenuItem>
        </Shield>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
