import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { AggregateForm } from '@/components/forms/aggregate-form'
import { Header } from './_components/header'
import { PageContent } from '@/components/page-content'

export default async function Page({
  params,
}: {
  params: { companyId: string }
}) {
  const aggregate = await action
    .aggregate()
    .find({ companyId: Number(params.companyId) })

  if (!aggregate.data) {
    return DataNotFound()
  }

  const units = await action.unit().findMany()

  return (
    <PageContent>
      <Header />

      <main>
        <AggregateForm initialData={aggregate.data} units={units.data} />
      </main>
    </PageContent>
  )
}
