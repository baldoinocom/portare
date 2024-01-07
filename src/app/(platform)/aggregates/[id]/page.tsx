import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { AggregateForm } from '@/components/forms/aggregate-form'
import { Separator } from '@/components/ui/separator'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { id: string } }) {
  const aggregate = await action.aggregate().find({ id: Number(params.id) })

  if (!aggregate.data) {
    return DataNotFound()
  }

  const fleets = await action.fleet().findMany()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <AggregateForm initialData={aggregate.data} fleets={fleets.data} />
      </main>
    </div>
  )
}
