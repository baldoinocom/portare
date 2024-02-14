import { TruckResource } from '@/actions/types'
import { formatLicensePlate } from '@/lib/formatters'

export const TruckDetailCard = ({ truck }: { truck: TruckResource }) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span>{formatLicensePlate(truck?.vehicle.licensePlate)}</span>
      <div className="space-x-2 text-xs font-medium text-muted-foreground">
        <span>{truck?.vehicle.brand?.name}</span>
        <span>{truck?.vehicle.model}</span>
      </div>
    </div>
  )
}
