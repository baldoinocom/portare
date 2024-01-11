import { action } from '@/actions'
import { TruckForm } from '@/components/forms/truck-form'
import { Separator } from '@/components/ui/separator'
import { Header } from './_components/header'

export default async function Page() {
  const [brands, fleets, aggregates] = await Promise.all([
    action.brand().findMany(),
    action.fleet().findMany(),
    action.aggregate().findMany(),
  ])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <TruckForm
          brands={brands.data}
          fleets={fleets.data}
          aggregates={aggregates.data}
        />
      </main>
    </div>
  )
}
