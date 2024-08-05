'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { debounce } from '@/lib/utils'
import { MDFe } from '@prisma/client'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MixerHorizontalIcon,
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { FileCheck2Icon, FileX2Icon, Search } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import * as React from 'react'
import { updateMDFe } from '../_actions/update-mdfe'
import { searchParams } from '../_lib/search-params'
import { Filters } from './filters'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  count: number
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  count,
}: DataTableProps<TData, TValue>) => {
  const [isLoading, startTransition] = React.useTransition()
  const [{ search, page, limit, closed }, setSearchParams] = useQueryStates(
    searchParams,
    { startTransition, shallow: false },
  )

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    getRowId: (row) => String((row as MDFe)?.id),
    manualPagination: true,
  })

  const { toast } = useToast()

  const { execute } = useAction(updateMDFe, {
    onSuccess: () => {
      toast({
        title: `MDF-e alterado com sucesso`,
        description: `Os MDF-e foram ${
          closed ? 'reabertos' : 'encerrados'
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
    const values = table.getFilteredSelectedRowModel().rows.map((row) => ({
      id: (row.original as MDFe)?.id,
      closed: !(row.original as MDFe)?.closedAt,
    }))

    await execute(values)

    table.setRowSelection({})
  }

  const debouncedSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value || null, page: null })
  }, 500)

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              defaultValue={search}
              onInput={debouncedSearch}
              placeholder="Pesquisar..."
              className="pl-8"
            />
          </div>

          <Filters
            onValueChange={(searchParams) => {
              setSearchParams(searchParams)

              table.setRowSelection({})
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={handleUpdate}
            disabled={!Object.keys(rowSelection).length}
          >
            {closed ? (
              <>
                <FileCheck2Icon className="mr-2 size-4" />
                Reabrir
              </>
            ) : (
              <>
                <FileX2Icon className="mr-2 size-4" />
                Encerrar
              </>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="ml-auto">
                <MixerHorizontalIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2">
                  Visualizar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="py-2" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton className="h-6" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="whitespace-nowrap py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-6 lg:space-x-8">
        <div className="flex-1 text-sm text-muted-foreground">
          {Object.keys(rowSelection).length} de {count} linha(s) selecionado
        </div>

        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium">Mostrar</Label>
          <Select
            value={String(limit)}
            onValueChange={(value) =>
              setSearchParams({ limit: Number(value), page: null })
            }
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={String(limit)} />
            </SelectTrigger>
            <SelectContent className="min-w-[5rem]" side="top">
              {[10, 30, 50, 100].map((limit) => (
                <SelectItem key={limit} value={String(limit)}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {`${count && page * limit - limit + 1}-${Math.min(
            page * limit,
            count,
          )} de ${count}`}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setSearchParams({ page: null })}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setSearchParams({ page: page - 1 })}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setSearchParams({ page: page + 1 })}
            disabled={page >= Math.ceil(count / limit)}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setSearchParams({ page: Math.ceil(count / limit) })}
            disabled={page >= Math.ceil(count / limit)}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
