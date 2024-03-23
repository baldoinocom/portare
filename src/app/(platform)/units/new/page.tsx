import { UnitForm } from '@/components/forms/unit-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default function Page() {
  return (
    <Shield page permission="unit.create">
      <PageContent>
        <Header />

        <main>
          <UnitForm />
        </main>
      </PageContent>
    </Shield>
  )
}
