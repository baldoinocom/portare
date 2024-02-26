import { action } from '@/actions'
import { DriverForm } from '@/components/forms/driver-form'
import { PageContent } from '@/components/page-content'
import { Header } from './_components/header'

export default async function Page() {
  const [units, aggregates] = await Promise.all([
    action.unit().findMany(),
    action.aggregate().findMany(),
  ])

  return (
    <PageContent>
      <Header />

      <main>
        <DriverForm units={units.data} aggregates={aggregates.data} />
      </main>
    </PageContent>
  )
}
