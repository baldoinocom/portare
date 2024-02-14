import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { UnitForm } from '@/components/forms/unit-form'
import { Header } from './_components/header'

export default async function Page({
  params,
}: {
  params: { companyId: string }
}) {
  const unit = await action.unit().find({ companyId: Number(params.companyId) })

  if (!unit.data) {
    return DataNotFound()
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <main>
        <UnitForm initialData={unit.data} />
      </main>
    </div>
  )
}
