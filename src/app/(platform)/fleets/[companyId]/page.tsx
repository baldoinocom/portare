import { action } from '@/actions'
import NotFound from '@/app/(platform)/not-found'
import { FleetForm } from '@/components/forms/fleet-form'
import { Separator } from '@/components/ui/separator'
import { Header } from './_components/header'

export default async function Page({
  params,
}: {
  params: { companyId: string }
}) {
  const fleet = await action
    .fleet()
    .find({ companyId: Number(params.companyId) })

  if (!fleet.data) {
    return NotFound()
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <FleetForm initialData={fleet.data} />
      </main>
    </div>
  )
}
