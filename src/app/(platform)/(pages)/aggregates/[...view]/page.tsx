import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { AggregateDetails } from '@/components/details/aggregate-details'
import { AggregateForm } from '@/components/forms/aggregate-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { view: string[] } }) {
  const [companyId, edit] = params.view

  if (edit !== 'edit' && edit !== undefined) {
    return DataNotFound()
  }

  const aggregate = await action
    .aggregate({ overwriter: ['aggregate.view', 'aggregate.update'] })
    .find({ companyId: Number(companyId) })

  if (!aggregate.data) {
    return DataNotFound()
  }

  if (!edit) {
    return (
      <Shield page permission="aggregate.view">
        <PageContent>
          <Header />

          <main>
            <AggregateDetails aggregate={aggregate.data} />
          </main>
        </PageContent>
      </Shield>
    )
  }

  const units = await action.unit({ overwriter: 'aggregate.update' }).findMany()

  return (
    <Shield page permission="aggregate.update">
      <PageContent>
        <Header />

        <main>
          <AggregateForm initialData={aggregate.data} units={units.data} />
        </main>
      </PageContent>
    </Shield>
  )
}
