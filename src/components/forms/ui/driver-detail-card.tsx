import { Driver } from '@/actions/types'
import { formatCPF } from '@/lib/formatters'

export const DriverDetailCard = ({ driver }: { driver: Driver }) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span className="text-xs font-medium text-muted-foreground">
        {driver.person?.nickname}
      </span>
      <span>{driver.person?.name}</span>
      <span className="text-xs">{formatCPF(driver.person?.cpf)}</span>
    </div>
  )
}
