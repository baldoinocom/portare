import { action } from '@/actions'
import { DriverForm } from '@/components/forms/driver-form'
import { Separator } from '@/components/ui/separator'
import { Header } from './_components/header'

export default async function Page() {
  const [fleets, aggregates] = await Promise.all([
    action.fleet.findMany(),
    action.aggregate.findMany(),
  ])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <DriverForm fleets={fleets.data} aggregates={aggregates.data} />
      </main>
    </div>
  )
}
