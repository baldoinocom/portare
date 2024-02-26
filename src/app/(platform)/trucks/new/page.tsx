import { action } from '@/actions'
import { TruckForm } from '@/components/forms/truck-form'
import { PageContent } from '@/components/page-content'
import { Header } from './_components/header'

export default async function Page() {
  const [brands, units, aggregates] = await Promise.all([
    action.brand().findMany(),
    action.unit().findMany(),
    action.aggregate().findMany(),
  ])

  return (
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
  )
}
