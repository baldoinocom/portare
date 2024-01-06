import { Fleet } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Fleet>[] = [
  {
    accessorKey: 'company.name',
    header: 'Razão Social',
  },
  {
    accessorKey: 'company.tradeName',
    header: 'Nome Fantasia',
  },
  {
    accessorKey: 'company.cnpj',
    header: 'CNPJ',
  },
  {
    accessorKey: 'company.state',
    header: 'UF',
  },
]
