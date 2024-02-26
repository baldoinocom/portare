import { action } from '@/actions'
import { TripForm } from '@/components/forms/trip-form'
import { PageContent } from '@/components/page-content'
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
    action.client().findMany({ type: 'origin' }),
    action.client().findMany({ type: 'destination' }),
    action.grouping().findMany(),
    action.driver().findMany(),
    action.truck().findMany(),
    action.semiTrailer().findMany(),
    action.cargo().findMany(),
  ])

  return (
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
  )
}
