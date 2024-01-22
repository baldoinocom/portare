import { VehicleInclude } from '@/actions/types'
import { formatLicensePlate } from '@/lib/formatters'

export const VehicleDetailCard = ({ vehicle }: { vehicle: VehicleInclude }) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span className="text-xs font-medium text-muted-foreground">
        {vehicle.brand?.name}
      </span>
      <span>{formatLicensePlate(vehicle.licensePlate)}</span>
      <span className="text-xs">{vehicle.model}</span>
    </div>
  )
}
