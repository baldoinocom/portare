import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { AggregateForm } from '@/components/forms/aggregate-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({
  params,
}: {
  params: { companyId: string }
}) {
  const aggregate = await action
    .aggregate({ overwriter: 'aggregate.update' })
    .find({ companyId: Number(params.companyId) })

  if (!aggregate.data) {
    return DataNotFound()
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
