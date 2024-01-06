import { action } from '@/actions'
import { AggregateForm } from '@/components/forms/aggregate-form'
import { Separator } from '@/components/ui/separator'
import { Header } from './_components/header'

export default async function Page() {
  const fleets = await action.fleet().findMany()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <AggregateForm fleets={fleets.data} />
      </main>
    </div>
  )
}
