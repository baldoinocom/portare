import { SemiTrailerInclude } from '@/actions/types'
import { formatLicensePlate } from '@/lib/formatters'

export const SemiTrailerDetailCard = ({
  semiTrailer,
}: {
  semiTrailer: SemiTrailerInclude
}) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span className="text-xs font-medium text-muted-foreground">
        {semiTrailer?.trailers?.at(0)?.vehicle.brand?.name}
      </span>
      <span>{semiTrailer?.trailers?.at(0)?.vehicle.model}</span>
      <span className="text-xs">
        {semiTrailer?.trailers
          .map(({ vehicle }) => formatLicensePlate(vehicle.licensePlate))
          .join(' - ')}
      </span>
    </div>
  )
}
