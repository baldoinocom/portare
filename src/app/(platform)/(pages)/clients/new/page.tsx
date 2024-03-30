import { ClientForm } from '@/components/forms/client-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default function Page() {
  return (
    <Shield page permission="client.create">
      <PageContent>
        <Header />

        <main>
          <ClientForm />
        </main>
      </PageContent>
    </Shield>
  )
}
