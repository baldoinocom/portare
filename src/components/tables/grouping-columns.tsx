'use client'

import { action } from '@/actions'
import {
  DriverResource,
  GroupingResource,
  SemiTrailerResource,
  TruckResource,
} from '@/actions/types'
import { GroupingFormDialog } from '@/components/forms/form-dialogs/grouping-form-dialog'
import { DriverDetailCard } from '@/components/forms/ui/driver-detail-card'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { SemiTrailerDetailCard } from '@/components/forms/ui/semi-trailer-detail-card'
import { TruckDetailCard } from '@/components/forms/ui/truck-detail-card'
import { Shield } from '@/components/shield'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
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
import { ColumnDef } from '@tanstack/react-table'
import { Edit3Icon, MoreHorizontal, Trash2Icon } from 'lucide-react'

export const groupingColumns = ({
  drivers,
  trucks,
  semiTrailers,
}: {
  drivers?: DriverResource[]
  trucks?: TruckResource[]
  semiTrailers?: SemiTrailerResource[]
}): ColumnDef<GroupingResource>[] => [
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
    id: 'Motorista',
    accessorFn: (row) => row.driver,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div>
        {!!getValue() && (
          <DriverDetailCard driver={getValue<DriverResource>()} />
        )}
      </div>
    ),
  },

  {
    id: 'Caminhão',
    accessorFn: (row) => row.truck,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div>
        {!!getValue() && <TruckDetailCard truck={getValue<TruckResource>()} />}
      </div>
    ),
  },

  {
    id: 'Semirreboque',
    accessorFn: (row) => row.semiTrailer,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div>
        {!!getValue() && (
          <SemiTrailerDetailCard
            semiTrailer={getValue<SemiTrailerResource>()}
          />
        )}
      </div>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <CellActions
        item={row.original}
        drivers={drivers}
        trucks={trucks}
        semiTrailers={semiTrailers}
      />
    ),
    enableHiding: false,
  },
]

const CellActions = ({
  item,
  drivers,
  trucks,
  semiTrailers,
}: {
  item: GroupingResource
  drivers?: DriverResource[]
  trucks?: TruckResource[]
  semiTrailers?: SemiTrailerResource[]
}) => {
  const { id } = item

  const { toast } = useToast()

  const { delete: del } = action.grouping()

  const { execute } = useAction(del, {
    onSuccess: () => {
      toast({
        title: 'Agrupamento deletado com sucesso',
        description: 'O agrupamento foi deletado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar o agrupamento',
        description: error,
      })
    },
  })

  const handleDelete = async () => {
    await execute({ id })
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

          <Shield permission="grouping.update">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Edit3Icon className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
          </Shield>

          <Shield permission="grouping.delete">
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2Icon className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          </Shield>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormDialogContent>
        <GroupingFormDialog
          initialData={item}
          drivers={drivers}
          trucks={trucks}
          semiTrailers={semiTrailers}
        />
      </FormDialogContent>
    </Dialog>
  )
}
