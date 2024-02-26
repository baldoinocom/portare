import { action } from '@/actions'
import { AggregateForm } from '@/components/forms/aggregate-form'
import { PageContent } from '@/components/page-content'
import { Header } from './_components/header'

export default async function Page() {
  const units = await action.unit().findMany()

  return (
    <PageContent>
      <Header />

      <main>
        <AggregateForm units={units.data} />
      </main>
    </PageContent>
  )
}
