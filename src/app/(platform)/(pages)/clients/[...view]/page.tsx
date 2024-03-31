import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { ClientDetails } from '@/components/details/client-details'
import { ClientForm } from '@/components/forms/client-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { view: string[] } }) {
  const [companyId, edit] = params.view

  if (edit !== 'edit' && edit !== undefined) {
    return DataNotFound()
  }

  const client = await action
    .client({ overwriter: ['client.view', 'client.update'] })
    .find({ companyId: Number(companyId) })

  if (!client.data) {
    return DataNotFound()
  }

  if (!edit) {
    return (
      <Shield page permission="client.view">
        <PageContent>
          <Header />

          <main>
            <ClientDetails client={client.data} />
          </main>
        </PageContent>
      </Shield>
    )
  }

  return (
    <Shield page permission="client.update">
      <PageContent>
        <Header />

        <main>
          <ClientForm initialData={client.data} />
        </main>
      </PageContent>
    </Shield>
  )
}
