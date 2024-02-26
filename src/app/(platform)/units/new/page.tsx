import { UnitForm } from '@/components/forms/unit-form'
import { PageContent } from '@/components/page-content'
import { Header } from './_components/header'

export default function Page() {
  return (
    <PageContent>
      <Header />

      <main>
        <UnitForm />
      </main>
    </PageContent>
  )
}
