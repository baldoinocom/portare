import { ClientForm } from '@/components/forms/client-form'
import { PageContent } from '@/components/page-content'
import { Header } from './_components/header'

export default function Page() {
  return (
    <PageContent>
      <Header />

      <main>
        <ClientForm />
      </main>
    </PageContent>
  )
}
