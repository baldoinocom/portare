import { action } from '@/actions'
import { ClientForm } from '@/components/forms/client-form'
import { PageContent } from '@/components/page-content'
import { DataNotFound } from '../../../not-found'
import { Header } from './_components/header'

export default async function Page({
  params,
}: {
  params: { companyId: string }
}) {
  const client = await action
    .client()
    .find({ companyId: Number(params.companyId) })

  if (!client.data) {
    return DataNotFound()
  }

  return (
    <PageContent>
      <Header />

      <main>
        <ClientForm initialData={client.data} />
      </main>
    </PageContent>
  )
}
