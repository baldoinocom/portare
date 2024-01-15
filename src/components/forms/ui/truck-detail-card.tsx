import { Truck } from '@/actions/types'
import { formatLicensePlate } from '@/lib/formatters'

export const TruckDetailCard = ({ truck }: { truck: Truck }) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span className="text-xs font-medium text-muted-foreground">
        {truck?.vehicle.brand?.name}
      </span>
      <span>{truck?.vehicle.model}</span>
      <span className="text-xs">
        {formatLicensePlate(truck?.vehicle.licensePlate)}
      </span>
    </div>
  )
}
