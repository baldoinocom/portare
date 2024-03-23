import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { TruckForm } from '@/components/forms/truck-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { id: string } }) {
  const truck = await action
    .truck({ overwriter: 'trip.update' })
    .find({ id: Number(params.id) })

  if (!truck.data) {
    return DataNotFound()
  }

  const [brands, units, aggregates] = await Promise.all([
    action.brand({ overwriter: 'trip.update' }).findMany(),
    action.unit({ overwriter: 'trip.update' }).findMany(),
    action.aggregate({ overwriter: 'trip.update' }).findMany(),
  ])

  return (
    <Shield page permission="truck.update">
      <PageContent>
        <Header />

        <main>
          <TruckForm
            initialData={truck.data}
            brands={brands.data}
            units={units.data}
            aggregates={aggregates.data}
          />
        </main>
      </PageContent>
    </Shield>
  )
}
