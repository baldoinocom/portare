'use client'

import { action } from '@/actions'
import { CompanyResource, SemiTrailerResource } from '@/actions/types'
import { CompanyDetailCard } from '@/components/forms/ui/company-detail-card'
import { Shield } from '@/components/shield'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { formatLicensePlate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  Edit3Icon,
  Eye,
  MoreHorizontal,
  Trash2Icon,
} from 'lucide-react'
import Link from 'next/link'

export const semiTrailerColumns: ColumnDef<SemiTrailerResource>[] = [
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
    id: 'Marca',
    accessorFn: (row) => row.trailers?.at(0)?.vehicle.brand?.name,
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
    id: 'Tipo',
    accessorFn: (row) => row.type?.name,
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
    id: 'Tipo de Carga',
    accessorFn: (row) => row.cargos,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="flex flex-wrap gap-2">
        {getValue<SemiTrailerResource['cargos']>().map(({ name }, index) => (
          <Badge
            key={index}
            variant="outline"
            className="font-medium uppercase"
          >
            {name}
          </Badge>
        ))}
      </div>
    ),
  },

  {
    id: 'Configuração',
    accessorFn: (row) => row.configuration?.name,
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
    id: 'Placa',
    accessorFn: (row) =>
      row.trailers?.map(({ vehicle }) =>
        formatLicensePlate(vehicle.licensePlate),
      ),
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="flex flex-col gap-2">
        {getValue<string[]>().map((value, index) => (
          <Badge
            key={index}
            variant="outline"
            className={cn(
              'justify-center font-medium uppercase',
              !value && 'border-muted bg-muted',
            )}
          >
            <span className={cn('w-max', !value && 'opacity-0')}>
              {String(value)}
            </span>
          </Badge>
        ))}
      </div>
    ),
  },

  {
    id: 'Nº de Frota',
    accessorFn: (row) => row.trailers?.map(({ fleetNumber }) => fleetNumber),
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="flex shrink-0 flex-col gap-2">
        {getValue<string[]>().map((value, index) => (
          <Badge
            key={index}
            variant="outline"
            className={cn(
              'justify-center font-medium uppercase',
              !value && 'border-muted bg-muted',
            )}
          >
            <span className={cn('w-max', !value && 'opacity-0')}>
              {String(value)}
            </span>
          </Badge>
        ))}
      </div>
    ),
  },

  {
    id: 'Unidade',
    accessorFn: (row) => row.trailers?.at(0)?.vehicle.unit?.company,
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
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

const CellActions = ({ item }: { item: SemiTrailerResource }) => {
  const { id } = item

  const { toast } = useToast()

  const { delete: del } = action.semiTrailer()

  const { execute } = useAction(del, {
    onSuccess: () => {
      toast({
        title: 'Semirreboque deletado com sucesso',
        description: 'O semirreboque foi deletado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar o semirreboque',
        description: error,
      })
    },
  })

  const handleDelete = () => {
    execute({ id })
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

        <Shield permission="semiTrailer.view">
          <DropdownMenuItem asChild>
            <Link href={'/semi-trailers/' + id}>
              <Eye className="mr-2 size-4" />
              Visualizar
            </Link>
          </DropdownMenuItem>
        </Shield>

        <Shield permission="semiTrailer.update">
          <DropdownMenuItem asChild>
            <Link href={'/semi-trailers/' + id + '/edit'}>
              <Edit3Icon className="mr-2 size-4" />
              Editar
            </Link>
          </DropdownMenuItem>
        </Shield>

        <Shield permission="semiTrailer.delete">
          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
            <Trash2Icon className="mr-2 size-4" />
            Excluir
          </DropdownMenuItem>
        </Shield>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
