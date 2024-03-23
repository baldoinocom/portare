import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { TripInformation } from '@/components/forms/fields/trip-information'
import { TripForm } from '@/components/forms/trip-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const trip = await action
    .trip({ overwriter: 'trip.update' })
    .find({ id: params.id })

  if (!trip.data) {
    return DataNotFound()
  }

  const edit = Object.keys(searchParams).includes('edit')

  const [
    origins,
    destinations,
    groupings,
    drivers,
    trucks,
    semiTrailers,
    cargos,
  ] = edit
    ? await Promise.all([
        action
          .client({ overwriter: 'trip.update' })
          .findMany({ type: 'origin' }),
        action
          .client({ overwriter: 'trip.update' })
          .findMany({ type: 'destination' }),
        action.grouping({ overwriter: 'trip.update' }).findMany(),
        action.driver({ overwriter: 'trip.update' }).findMany(),
        action.truck({ overwriter: 'trip.update' }).findMany(),
        action.semiTrailer({ overwriter: 'trip.update' }).findMany(),
        action.cargo({ overwriter: 'trip.update' }).findMany(),
      ])
    : []

  return (
    <Shield page permission="trip.update">
      <PageContent>
        <Header />

        <main>
          {edit && (
            <TripForm
              initialData={trip.data}
              origins={origins?.data}
              destinations={destinations?.data}
              groupings={groupings?.data}
              drivers={drivers?.data}
              trucks={trucks?.data}
              semiTrailers={semiTrailers?.data}
              cargos={cargos?.data}
            />
          )}

          {!edit && (
            <TripInformation
              status={trip.data.status}
              origin={trip.data.origin}
              destination={trip.data.destination}
              driver={trip.data.driver}
              truck={trip.data.truck}
              semiTrailer={trip.data.semiTrailer}
              cargo={trip.data.cargo}
              note={trip.data.note}
              departedAt={trip.data.departedAt}
              arrivedAt={trip.data.departedAt}
            />
          )}
        </main>
      </PageContent>
    </Shield>
  )
}
