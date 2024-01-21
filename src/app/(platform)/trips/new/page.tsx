import { Separator } from '@/components/ui/separator'
import { Header } from './_components/header'
import { TripForm } from '@/components/forms/trip-form'

export default function Page() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <TripForm />
      </main>
    </div>
  )
}
