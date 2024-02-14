import { DriverResource } from '@/actions/types'
import { formatCPF } from '@/lib/formatters'

export const DriverDetailCard = ({ driver }: { driver: DriverResource }) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span>{driver.person?.name}</span>

      <div className="space-x-2 text-xs font-medium text-muted-foreground">
        <span>{formatCPF(driver.person?.document)}</span>
        <span>{driver.person?.nickname}</span>
      </div>
    </div>
  )
}
