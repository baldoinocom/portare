import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { id: string } }) {
  const trip = await action.trip().find({ id: params.id })

  if (!trip.data) {
    return DataNotFound()
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">
              Em desenvolvimento
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Manutenção
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Em breve esta página estará disponível
            </p>
            <div className="mt-6">
              <Button variant="ghost">
                <Link
                  href="/trips"
                  className="text-base font-medium text-primary"
                >
                  Voltar para viagens
                  <span> &rarr;</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
