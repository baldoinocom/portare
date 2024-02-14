import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { DriverForm } from '@/components/forms/driver-form'
import { Header } from './_components/header'

export default async function Page({
  params,
}: {
  params: { personId: string }
}) {
  const driver = await action
    .driver()
    .find({ personId: Number(params.personId) })

  if (!driver.data) {
    return DataNotFound()
  }

  const [units, aggregates] = await Promise.all([
    action.unit().findMany(),
    action.aggregate().findMany(),
  ])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <main>
        <DriverForm
          initialData={driver.data}
          units={units.data}
          aggregates={aggregates.data}
        />
      </main>
    </div>
  )
}
