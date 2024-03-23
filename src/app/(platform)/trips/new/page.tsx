import { action } from '@/actions'
import { TripForm } from '@/components/forms/trip-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page() {
  const [
    origins,
    destinations,
    groupings,
    drivers,
    trucks,
    semiTrailers,
    cargos,
  ] = await Promise.all([
    action.client({ overwriter: 'trip.create' }).findMany({ type: 'origin' }),
    action
      .client({ overwriter: 'trip.create' })
      .findMany({ type: 'destination' }),
    action.grouping({ overwriter: 'trip.create' }).findMany(),
    action.driver({ overwriter: 'trip.create' }).findMany(),
    action.truck({ overwriter: 'trip.create' }).findMany(),
    action.semiTrailer({ overwriter: 'trip.create' }).findMany(),
    action.cargo({ overwriter: 'trip.create' }).findMany(),
  ])

  return (
    <Shield page permission="trip.create">
      <PageContent>
        <Header />

        <main>
          <TripForm
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
