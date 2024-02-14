import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { AggregateForm } from '@/components/forms/aggregate-form'
import { Header } from './_components/header'

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
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <main>
        <AggregateForm initialData={aggregate.data} units={units.data} />
      </main>
    </div>
  )
}
