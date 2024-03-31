'use client'

import { action } from '@/actions'
import { DriverResource, PersonResource } from '@/actions/types'
import { CompanyDetailCard } from '@/components/forms/ui/company-detail-card'
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
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { formatCPF, formatPhoneNumber } from '@/lib/formatters'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  Edit3Icon,
  Eye,
  MoreHorizontal,
  Trash2Icon,
} from 'lucide-react'
import Link from 'next/link'

export const driverColumns: ColumnDef<DriverResource>[] = [
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
    accessorFn: (row) => row.personId,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="font-semibold">{getValue<number>()}</div>
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },

  {
    id: 'Nome Completo',
    accessorFn: (row) => row.person.name,
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
    id: 'Apelido',
    accessorFn: (row) => row.person.nickname,
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
    id: 'CPF',
    accessorFn: (row) => formatCPF(row.person.document),
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
    id: 'Telefone',
    accessorFn: (row) => formatPhoneNumber(row.person.phoneNumber),
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue<string>()}</div>
    ),
  },

  {
    id: 'Frota/Agregado',
    accessorFn: (row) => row.person,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => {
      const person = getValue<PersonResource>()

      return (
        <div>
          {person.unit && <CompanyDetailCard company={person.unit.company} />}
          {person.aggregate && (
            <CompanyDetailCard company={person.aggregate.company} />
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

const CellActions = ({ item }: { item: DriverResource }) => {
  const { personId } = item

  const { toast } = useToast()

  const { delete: del } = action.driver()

  const { execute } = useAction(del, {
    onSuccess: () => {
      toast({
        title: 'Motorista deletado com sucesso',
        description: 'O motorista foi deletado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar o motorista',
        description: error,
      })
    },
  })

  const handleDelete = () => {
    execute({ personId })
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

        <Shield permission="driver.view">
          <DropdownMenuItem asChild>
            <Link href={'/drivers/' + personId}>
              <Eye className="mr-2 size-4" />
              Visualizar
            </Link>
          </DropdownMenuItem>
        </Shield>

        <Shield permission="driver.update">
          <DropdownMenuItem asChild>
            <Link href={'/drivers/' + personId + '/edit'}>
              <Edit3Icon className="mr-2 size-4" />
              Editar
            </Link>
          </DropdownMenuItem>
        </Shield>

        <Shield permission="driver.delete">
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2Icon className="mr-2 size-4" />
            Excluir
          </DropdownMenuItem>
        </Shield>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
