import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { UnitForm } from '@/components/forms/unit-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({
  params,
}: {
  params: { companyId: string }
}) {
  const unit = await action
    .unit({ overwriter: 'unit.update' })
    .find({ companyId: Number(params.companyId) })

  if (!unit.data) {
    return DataNotFound()
  }

  return (
    <Shield page permission="unit.update">
      <PageContent>
        <Header />

        <main>
          <UnitForm initialData={unit.data} />
        </main>
      </PageContent>
    </Shield>
  )
}
