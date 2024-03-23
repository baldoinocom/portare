import { action } from '@/actions'
import { DriverForm } from '@/components/forms/driver-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page() {
  const [units, aggregates] = await Promise.all([
    action.unit({ overwriter: 'driver.create' }).findMany(),
    action.aggregate({ overwriter: 'driver.create' }).findMany(),
  ])

  return (
    <Shield page permission="driver.create">
      <PageContent>
        <Header />

        <main>
          <DriverForm units={units.data} aggregates={aggregates.data} />
        </main>
      </PageContent>
    </Shield>
  )
}
