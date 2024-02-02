'use client'

import {
  DriverInclude,
  GroupingInclude,
  SemiTrailerInclude,
  TruckInclude,
} from '@/actions/types'
import { GroupingFormDialog } from '@/components/forms/form-dialogs/grouping-form-dialog'
import { DriverDetailCard } from '@/components/forms/ui/driver-detail-card'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { SemiTrailerDetailCard } from '@/components/forms/ui/semi-trailer-detail-card'
import { TruckDetailCard } from '@/components/forms/ui/truck-detail-card'
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
import { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'

export const groupingColumns = ({
  drivers,
  trucks,
  semiTrailers,
}: {
  drivers?: DriverInclude[]
  trucks?: TruckInclude[]
  semiTrailers?: SemiTrailerInclude[]
}): ColumnDef<GroupingInclude>[] => [
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
      <div className="whitespace-nowrap">
        {!!getValue() && (
          <DriverDetailCard driver={getValue<DriverInclude>()} />
        )}
      </div>
    ),
  },

  {
    id: 'Caminhão',
    accessorFn: (row) => row.truck,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        {!!getValue() && <TruckDetailCard truck={getValue<TruckInclude>()} />}
      </div>
    ),
  },

  {
    id: 'Semirreboque',
    accessorFn: (row) => row.semiTrailer,
    header: ({ column }) => column.id,
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        {!!getValue() && (
          <SemiTrailerDetailCard semiTrailer={getValue<SemiTrailerInclude>()} />
        )}
      </div>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => {
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
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Eye className="mr-2 size-4" />
                  Visualizar
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <FormDialogContent>
            <GroupingFormDialog
              initialData={row.original}
              drivers={drivers}
              trucks={trucks}
              semiTrailers={semiTrailers}
            />
          </FormDialogContent>
        </Dialog>
      )
    },
    enableHiding: false,
  },
]
