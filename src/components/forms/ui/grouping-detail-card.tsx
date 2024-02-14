import {
  DriverResource,
  GroupingResource,
  SemiTrailerResource,
  TruckResource,
} from '@/actions/types'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatLicensePlate } from '@/lib/formatters'
import { DriverDetailCard } from './driver-detail-card'
import { SemiTrailerDetailCard } from './semi-trailer-detail-card'
import { TruckDetailCard } from './truck-detail-card'

export const GroupingDetailCard = ({
  grouping,
}: {
  grouping: GroupingResource
}) => {
  return (
    <div className="flex w-full flex-col items-start space-y-3 text-start uppercase">
      <div className="flex w-full space-x-6">
        <div className="flex-1">
          <div className="text-xs font-bold capitalize">Motorista</div>

          {grouping.driver ? (
            <DriverDetailCard driver={grouping.driver as DriverResource} />
          ) : (
            <Skeleton className="h-14 w-2/3 group-hover:bg-background" />
          )}
        </div>
      </div>

      <Separator />

      <div className="flex w-full space-x-6">
        <div className="flex-1">
          <div className="text-xs font-bold capitalize">Caminhão</div>
          {grouping.truck ? (
            <TruckDetailCard truck={grouping.truck as TruckResource} />
          ) : (
            <Skeleton className="h-14 w-2/3 group-hover:bg-background" />
          )}
        </div>

        <Separator className="h-auto" orientation="vertical" />

        <div className="flex-1">
          <div className="text-xs font-bold capitalize">Semirreboque</div>

          {grouping.semiTrailer ? (
            <SemiTrailerDetailCard
              semiTrailer={grouping.semiTrailer as SemiTrailerResource}
            />
          ) : (
            <Skeleton className="h-14 w-2/3 group-hover:bg-background" />
          )}
        </div>
      </div>
    </div>
  )
}

export const GroupingPreviewCard = ({
  grouping,
}: {
  grouping: Partial<GroupingResource>
}) => {
  return (
    <div className="flex w-full flex-col items-start text-start uppercase">
      <div className="flex w-full flex-col">
        {grouping.driver && (
          <div>
            <div className="flex space-x-4">
              <span className="flex-1 font-medium">
                {grouping.driver.person?.name}
              </span>
              <span className="text-right text-muted-foreground">
                {grouping.driver.person?.nickname}
              </span>
            </div>
          </div>
        )}

        <div>
          <div className="flex space-x-4">
            <span className="flex-1 font-medium">
              {formatLicensePlate(grouping.truck?.vehicle.licensePlate)}
            </span>
            <span className="text-right font-medium">
              {grouping?.semiTrailer?.trailers
                .map(({ vehicle }) => formatLicensePlate(vehicle.licensePlate))
                .join(' | ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
