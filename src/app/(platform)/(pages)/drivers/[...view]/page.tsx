import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { DriverDetails } from '@/components/details/driver-details'
import { DriverForm } from '@/components/forms/driver-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { view: string[] } }) {
  const [personId, edit] = params.view

  if (edit !== 'edit' && edit !== undefined) {
    return DataNotFound()
  }

  const driver = await action
    .driver({ overwriter: ['driver.view', 'driver.update'] })
    .find({ personId: Number(personId) })

  if (!driver.data) {
    return DataNotFound()
  }

  if (!edit) {
    return (
      <Shield page permission="driver.view">
        <PageContent>
          <Header />

          <main>
            <DriverDetails driver={driver.data} />
          </main>
        </PageContent>
      </Shield>
    )
  }

  const [units, aggregates] = await Promise.all([
    action.unit({ overwriter: 'driver.update' }).findMany(),
    action.aggregate({ overwriter: 'driver.update' }).findMany(),
  ])

  return (
    <Shield page permission="driver.update">
      <PageContent>
        <Header />

        <main>
          <DriverForm
            initialData={driver.data}
            units={units.data}
            aggregates={aggregates.data}
          />
        </main>
      </PageContent>
    </Shield>
  )
}
