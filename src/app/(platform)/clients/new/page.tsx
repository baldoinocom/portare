import { ClientForm } from '@/components/forms/client-form'
import { Header } from './_components/header'

export default function Page() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <main>
        <ClientForm />
      </main>
    </div>
  )
}
