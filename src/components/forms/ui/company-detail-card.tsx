import { formatCNPJ } from '@/lib/formatters'
import { Company } from '@prisma/client'

export const CompanyDetailCard = ({ company }: { company: Company }) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span className="text-xs font-medium text-muted-foreground">
        {company?.tradeName}
      </span>
      <span>{company?.name}</span>
      <span className="text-xs">
        {company?.cnpj && formatCNPJ(company.cnpj)}
      </span>
    </div>
  )
}
