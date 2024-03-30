import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { ClientForm } from '@/components/forms/client-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({
  params,
}: {
  params: { companyId: string }
}) {
  const client = await action
    .client({ overwriter: 'client.update' })
    .find({ companyId: Number(params.companyId) })

  if (!client.data) {
    return DataNotFound()
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
