import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { TruckDetails } from '@/components/details/truck-details'
import { TruckForm } from '@/components/forms/truck-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { view: string[] } }) {
  const [id, edit] = params.view

  if (edit !== 'edit' && edit !== undefined) {
    return DataNotFound()
  }

  const truck = await action
    .truck({ overwriter: ['truck.view', 'truck.update'] })
    .find({ id: Number(id) })

  if (!truck.data) {
    return DataNotFound()
  }

  if (!edit) {
    return (
      <Shield page permission="truck.view">
        <PageContent>
          <Header />

          <main>
            <TruckDetails truck={truck.data} />
          </main>
        </PageContent>
      </Shield>
    )
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
