import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { DriverForm } from '@/components/forms/driver-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({
  params,
}: {
  params: { personId: string }
}) {
  const driver = await action
    .driver({ overwriter: 'driver.update' })
    .find({ personId: Number(params.personId) })

  if (!driver.data) {
    return DataNotFound()
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
