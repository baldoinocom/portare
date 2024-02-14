import { SemiTrailerResource } from '@/actions/types'
import { formatLicensePlate } from '@/lib/formatters'

export const SemiTrailerDetailCard = ({
  semiTrailer,
}: {
  semiTrailer: SemiTrailerResource
}) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span>
        {semiTrailer?.trailers
          .map(({ vehicle }) => formatLicensePlate(vehicle.licensePlate))
          .join(' | ')}
      </span>

      <div className="space-x-2 text-xs font-medium text-muted-foreground">
        <span>{semiTrailer?.trailers?.at(0)?.vehicle.brand?.name}</span>
        <span>{semiTrailer?.trailers?.at(0)?.vehicle.model}</span>
      </div>
    </div>
  )
}
