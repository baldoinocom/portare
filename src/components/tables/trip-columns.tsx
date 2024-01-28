'use client'

import {
  DriverInclude,
  SemiTrailerInclude,
  TripInclude,
  TruckInclude,
} from '@/actions/types'
import { CompanyDetailCard } from '@/components/forms/ui/company-detail-card'
import { DriverDetailCard } from '@/components/forms/ui/driver-detail-card'
import { SemiTrailerDetailCard } from '@/components/forms/ui/semi-trailer-detail-card'
import { TruckDetailCard } from '@/components/forms/ui/truck-detail-card'
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
import { formatTripStatus } from '@/lib/formatters'
import { Company } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowUpDown, Eye, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

export const tripColumns: ColumnDef<TripInclude>[] = [
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
    cell: ({ getValue }) => (
      <Badge variant="secondary">{getValue<string>()}</Badge>
    ),
  },

  {
    id: 'Origem',
    accessorFn: (row) => row.origin?.company,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        {getValue && <CompanyDetailCard company={getValue<Company>()} />}
      </div>
    ),
  },

  {
    id: 'Destino',
    accessorFn: (row) => row.destination?.company,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        {getValue && <CompanyDetailCard company={getValue<Company>()} />}
      </div>
    ),
  },

  {
    id: 'Data de Partida',
    accessorFn: (row) =>
      row.departedAt ? format(row.departedAt, 'PPP', { locale: ptBR }) : '',
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Data de Chegada',
    accessorFn: (row) =>
      row.arrivedAt ? format(row.arrivedAt, 'PPP', { locale: ptBR }) : '',
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Motorista',
    accessorFn: (row) => row.driver,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        {getValue && <DriverDetailCard driver={getValue<DriverInclude>()} />}
      </div>
    ),
  },

  {
    id: 'Caminhão',
    accessorFn: (row) => row.truck,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        {getValue && <TruckDetailCard truck={getValue<TruckInclude>()} />}
      </div>
    ),
  },

  {
    id: 'Semirreboque',
    accessorFn: (row) => row.semiTrailer,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        {getValue && (
          <SemiTrailerDetailCard semiTrailer={getValue<SemiTrailerInclude>()} />
        )}
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
              <Link href={'trips/' + id}>
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
