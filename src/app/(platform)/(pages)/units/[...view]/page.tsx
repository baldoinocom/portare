import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { UnitDetails } from '@/components/details/unit-details'
import { UnitForm } from '@/components/forms/unit-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { view: string[] } }) {
  const [companyId, edit] = params.view

  if (edit !== 'edit' && edit !== undefined) {
    return DataNotFound()
  }

  const unit = await action
    .unit({ overwriter: ['unit.view', 'unit.update'] })
    .find({ companyId: Number(companyId) })

  if (!unit.data) {
    return DataNotFound()
  }

  if (!edit) {
    return (
      <Shield page permission="unit.view">
        <PageContent>
          <Header />

          <main>
            <UnitDetails unit={unit.data} />
          </main>
        </PageContent>
      </Shield>
    )
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
