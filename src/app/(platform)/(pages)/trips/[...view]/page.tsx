import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { TripDetails } from '@/components/details/trip-details'
import { TripForm } from '@/components/forms/trip-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { view: string[] } }) {
  const [id, edit] = params.view

  if (edit !== 'edit' && edit !== undefined) {
    return DataNotFound()
  }

  const trip = await action
    .trip({ overwriter: ['trip.view', 'trip.update'] })
    .find({ id })

  if (!trip.data) {
    return DataNotFound()
  }

  if (!edit) {
    return (
      <Shield page permission="trip.view">
        <PageContent>
          <Header />

          <main>
            <TripDetails
              status={trip.data.status}
              origin={trip.data.origin}
              destination={trip.data.destination}
              driver={trip.data.driver}
              truck={trip.data.truck}
              semiTrailer={trip.data.semiTrailer}
              cargo={trip.data.cargo}
              note={trip.data.note}
              departedAt={trip.data.departedAt}
              arrivedAt={trip.data.arrivedAt}
            />
          </main>
        </PageContent>
      </Shield>
    )
  }

  const [
    origins,
    destinations,
    groupings,
    drivers,
    trucks,
    semiTrailers,
    cargos,
  ] = await Promise.all([
    action.client({ overwriter: 'trip.update' }).findMany({ type: 'origin' }),
    action
      .client({ overwriter: 'trip.update' })
      .findMany({ type: 'destination' }),
    action.grouping({ overwriter: 'trip.update' }).findMany(),
    action.driver({ overwriter: 'trip.update' }).findMany(),
    action.truck({ overwriter: 'trip.update' }).findMany(),
    action.semiTrailer({ overwriter: 'trip.update' }).findMany(),
    action.cargo({ overwriter: 'trip.update' }).findMany(),
  ])

  return (
    <Shield page permission="trip.update">
      <PageContent>
        <Header />

        <main>
          <TripForm
            initialData={trip.data}
            origins={origins.data}
            destinations={destinations.data}
            groupings={groupings.data}
            drivers={drivers.data}
            trucks={trucks.data}
            semiTrailers={semiTrailers.data}
            cargos={cargos.data}
          />
        </main>
      </PageContent>
    </Shield>
  )
}
