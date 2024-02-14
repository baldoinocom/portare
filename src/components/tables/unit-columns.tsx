'use client'

import { action } from '@/actions'
import { UnitResource } from '@/actions/types'
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
import { formatCNPJ } from '@/lib/formatters'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Eye, MoreHorizontal, Trash2Icon } from 'lucide-react'
import Link from 'next/link'

export const unitColumns: ColumnDef<UnitResource>[] = [
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
    id: 'Razão Social',
    accessorFn: (row) => row.company.name,
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
    id: 'Nome Fantasia',
    accessorFn: (row) => row.company.tradeName,
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
    id: 'CNPJ',
    accessorFn: (row) => formatCNPJ(row.company.document),
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
    id: 'Estado',
    accessorFn: (row) => row.company?.address?.state,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Cidade',
    accessorFn: (row) => row.company?.address?.city,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue<string>()}</div>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellActions item={row.original} />,
    enableHiding: false,
  },
]

const CellActions = ({ item }: { item: UnitResource }) => {
  const { companyId } = item

  const { toast } = useToast()

  const { delete: deleteAction } = action.unit()

  const { execute } = useAction(deleteAction, {
    onSuccess: () => {
      toast({
        title: 'Unidade deletada com sucesso',
        description: 'A unidade foi deletada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar a unidade',
        description: error,
      })
    },
  })

  const handleDelete = () => {
    execute({ companyId })
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
          <Link href={'/units/' + companyId}>
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
