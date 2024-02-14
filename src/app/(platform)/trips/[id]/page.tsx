import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { TripInformation } from '@/components/forms/fields/trip-information'
import { TripForm } from '@/components/forms/trip-form'
import { Header } from './_components/header'

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const trip = await action.trip().find({ id: params.id })

  if (!trip.data) {
    return DataNotFound()
  }

  const edit = Object.keys(searchParams).includes('edit')

  const [
    origins,
    destinations,
    groupings,
    drivers,
    trucks,
    semiTrailers,
    cargos,
  ] = edit
    ? await Promise.all([
        action.client().findMany({ type: 'origin' }),
        action.client().findMany({ type: 'destination' }),
        action.grouping().findMany(),
        action.driver().findMany(),
        action.truck().findMany(),
        action.semiTrailer().findMany(),
        action.cargo().findMany(),
      ])
    : []

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <main>
        {edit && (
          <TripForm
            initialData={trip.data}
            origins={origins?.data}
            destinations={destinations?.data}
            groupings={groupings?.data}
            drivers={drivers?.data}
            trucks={trucks?.data}
            semiTrailers={semiTrailers?.data}
            cargos={cargos?.data}
          />
        )}

        {!edit && (
          <TripInformation
            status={trip.data.status}
            origin={trip.data.origin}
            destination={trip.data.destination}
            driver={trip.data.driver}
            truck={trip.data.truck}
            semiTrailer={trip.data.semiTrailer}
            cargo={trip.data.cargo}
            note={trip.data.note}
            departedAt={trip.data.departedAt}
            arrivedAt={trip.data.departedAt}
          />
        )}
      </main>
    </div>
  )
}
