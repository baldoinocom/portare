'use client'

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
import { MDFe } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import {
  FileCheck2Icon,
  FileX2Icon,
  MessageSquarePlus,
  MoreHorizontal,
} from 'lucide-react'
import { updateMDFe } from '../_actions/update-mdfe'
import { FormDialog } from './form-dialog'

export const columns: ColumnDef<MDFe & { semiTrailer?: string }>[] = [
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
    header: ({ column }) => column.id,
    cell: ({ row: { original } }) => (
      <div className="uppercase">{original.manifest}</div>
    ),
  },

  {
    id: 'Placa',
    accessorFn: (row) => row.licensePlate,
    header: ({ column }) => column.id,
    cell: ({ getValue, row: { original } }) => (
      <div className="flex flex-col items-start uppercase">
        <span>{getValue<string>()}</span>
        <span className="text-xs">{original.semiTrailer}</span>
      </div>
    ),
  },

  {
    id: 'Destinatário',
    accessorFn: (row) => row.destinatary,
    header: ({ column }) => column.id,
    cell: ({ getValue, row: { original } }) => (
      <div className="flex flex-col items-start uppercase">
        <span>{getValue<string>()}</span>
        <span className="text-xs">{original.address}</span>
      </div>
    ),
  },

  {
    id: 'Nota Fiscal',
    accessorFn: (row) => row.invoice,
    header: ({ column }) => column.id,
    cell: ({ getValue, row: { original } }) => (
      <div className="flex flex-col items-start uppercase">
        <span>{getValue<string>()}</span>
        <span className="text-xs">{original.invoiceIssue}</span>
      </div>
    ),
  },

  {
    id: 'CT-e',
    accessorFn: (row) => row.cte,
    header: ({ column }) => column.id,
    cell: ({ getValue, row: { original } }) => (
      <div className="flex flex-col items-start uppercase">
        <span>{getValue<string>()}</span>
        <span className="text-xs">{original.cteIssue}</span>
      </div>
    ),
  },

  {
    id: 'Observação',
    accessorFn: (row) => row.note,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="flex flex-col items-start">
        <span className="text-xs">{getValue<string>()}</span>
      </div>
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
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="float-end size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DialogTrigger asChild>
            <DropdownMenuItem>
              <MessageSquarePlus className="mr-2 size-4" />
              Observação
            </DropdownMenuItem>
          </DialogTrigger>

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

        <FormDialogContent>
          <FormDialog initialData={item} />
        </FormDialogContent>
      </DropdownMenu>
    </Dialog>
  )
}
