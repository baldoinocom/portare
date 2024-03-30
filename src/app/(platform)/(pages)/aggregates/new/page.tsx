import { action } from '@/actions'
import { AggregateForm } from '@/components/forms/aggregate-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page() {
  const units = await action.unit({ overwriter: 'aggregate.create' }).findMany()

  return (
    <Shield page permission="aggregate.create">
      <PageContent>
        <Header />

        <main>
          <AggregateForm units={units.data} />
        </main>
      </PageContent>
    </Shield>
  )
}
