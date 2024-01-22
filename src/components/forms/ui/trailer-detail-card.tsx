import { TrailerInclude } from '@/actions/types'
import { formatLicensePlate } from '@/lib/formatters'

export const TrailerDetailCard = ({ trailer }: { trailer: TrailerInclude }) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span className="text-xs font-medium text-muted-foreground">
        {trailer?.vehicle.brand?.name}
      </span>
      <span>{trailer?.vehicle.model}</span>
      <span className="text-xs">
        {formatLicensePlate(trailer?.vehicle.licensePlate)}
      </span>
    </div>
  )
}
