'use client'

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
import { MDFe } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  FileCheck2Icon,
  FileX2Icon,
  MoreHorizontal,
} from 'lucide-react'
import { MDFeResource } from '../_actions/type'
import { updateMDFe } from '../_actions/update_mdfe'

export const columns: ColumnDef<MDFeResource>[] = [
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
    id: 'Manifesto',
    accessorFn: (row) => row.id,
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
      <div className="flex justify-center uppercase">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Placa Veicul',
    accessorFn: (row) => row.data['Placa Veicul'],
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Dt. Emissao',
    accessorFn: (row) => row.data['Dt. Emissao'],
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Nome Destina',
    accessorFn: (row) => row.data['Nome Destina'],
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Local Entreg',
    accessorFn: (row) => row.data['Local Entreg'],
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'NF CLIENTE',
    accessorFn: (row) => row.data['NF CLIENTE'],
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Numero CTRC',
    accessorFn: (row) => row.data['Numero CTRC'],
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Emis Nf Cli',
    accessorFn: (row) => row.data['Emis Nf Cli'],
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{getValue<string>()}</div>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

const CellActions = ({ item }: { item: MDFe }) => {
  const { id, closedAt } = item

  const { toast } = useToast()

  const { execute } = useAction(updateMDFe, {
    onSuccess: () => {
      toast({
        title: `MDF-e alterado com sucesso`,
        description: `Os MDF-e foram ${
          closedAt ? 'reabertos' : 'encerrados'
        } com sucesso! 🎉`,
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterado MDF-e',
        description: error,
      })
    },
  })

  const handleUpdate = async () => {
    await execute([{ id, closed: !closedAt }])
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
        <DropdownMenuItem asChild onClick={handleUpdate}>
          {closedAt ? (
            <div>
              <FileCheck2Icon className="mr-2 size-4" />
              Reabrir
            </div>
          ) : (
            <div>
              <FileX2Icon className="mr-2 size-4" />
              Encerrar
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
