import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { TripForm } from '@/components/forms/trip-form'
import { Separator } from '@/components/ui/separator'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { id: string } }) {
  const trip = await action.trip().find({ id: params.id })

  if (!trip.data) {
    return DataNotFound()
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <TripForm initialData={trip.data} />
      </main>
    </div>
  )
}
