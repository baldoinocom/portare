'use client'

import { GroupingInclude } from '@/actions/types'
import { GroupingFormDialog } from '@/components/forms/form-dialogs/grouping-form-dialog'
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
import { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'

export const groupingColumns: ColumnDef<GroupingInclude>[] = [
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
            <GroupingFormDialog initialData={row.original} />
          </FormDialogContent>
        </Dialog>
      )
    },
    enableHiding: false,
  },
]
