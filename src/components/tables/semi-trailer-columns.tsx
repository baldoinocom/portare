'use client'

import { SemiTrailer } from '@/actions/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatRenavam } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Eye, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

export const semiTrailerColumns: ColumnDef<SemiTrailer>[] = [
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
    id: 'Modelo',
    accessorFn: (row) => row.trailers?.at(0)?.vehicle.model,
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
        {getValue<SemiTrailer['cargos']>().map(({ name }, index) => (
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
      row.trailers?.map(({ vehicle }) => vehicle.licensePlate),
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
    id: 'Renavam',
    accessorFn: (row) =>
      row.trailers?.map(({ vehicle }) => formatRenavam(vehicle.renavam)),
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
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original

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
              <Link href={'semi-trailers/' + id}>
                <Eye className="mr-2 size-4" />
                Visualizar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: false,
  },
]
