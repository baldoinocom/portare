import { CompanyResource } from '@/actions/types'

export const CompanyDetailCard = ({
  company,
}: {
  company: CompanyResource
}) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span>{company?.tradeName || company?.name}</span>
      <span className="text-xs">{company.address?.city}</span>
    </div>
  )
}
