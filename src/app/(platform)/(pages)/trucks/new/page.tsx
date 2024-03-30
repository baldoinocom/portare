import { action } from '@/actions'
import { TruckForm } from '@/components/forms/truck-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page() {
  const [brands, units, aggregates] = await Promise.all([
    action.brand({ overwriter: 'trip.create' }).findMany(),
    action.unit({ overwriter: 'trip.create' }).findMany(),
    action.aggregate({ overwriter: 'trip.create' }).findMany(),
  ])

  return (
    <Shield page permission="truck.create">
      <PageContent>
        <Header />

        <main>
          <TruckForm
            brands={brands.data}
            units={units.data}
            aggregates={aggregates.data}
          />
        </main>
      </PageContent>
    </Shield>
  )
}
