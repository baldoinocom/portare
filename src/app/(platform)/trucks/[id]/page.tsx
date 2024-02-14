import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { TruckForm } from '@/components/forms/truck-form'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { id: string } }) {
  const truck = await action.truck().find({ id: Number(params.id) })

  if (!truck.data) {
    return DataNotFound()
  }

  const [brands, units, aggregates] = await Promise.all([
    action.brand().findMany(),
    action.unit().findMany(),
    action.aggregate().findMany(),
  ])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <main>
        <TruckForm
          initialData={truck.data}
          brands={brands.data}
          units={units.data}
          aggregates={aggregates.data}
        />
      </main>
    </div>
  )
}
