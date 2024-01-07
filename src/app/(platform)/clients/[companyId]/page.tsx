import { action } from '@/actions'
import { ClientForm } from '@/components/forms/client-form'
import { Separator } from '@/components/ui/separator'
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
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <ClientForm initialData={client.data} />
      </main>
    </div>
  )
}
