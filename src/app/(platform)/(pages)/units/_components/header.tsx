import { Shield } from '@/components/shield'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { ClipboardIcon, PlusIcon, RocketIcon } from 'lucide-react'
import Link from 'next/link'
import { ImportButton } from './import-button'

export const Header = async () => {
  const [registrations, inOperation] = await Promise.all([
    db.unit.count(),
    db.unit.count({
      where: {
        trips: {
          some: {
            status: { in: ['loaded', 'departure', 'terminal', 'unloaded'] },
          },
        },
      },
    }),
  ])

  return (
    <header>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
            Unidades
          </h2>

          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <ClipboardIcon className="mr-1.5" />
              {registrations} Cadastros
            </div>

            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <RocketIcon className="mr-1.5" />
              {inOperation} Em operação
            </div>
          </div>
        </div>

        <div className="mt-5 flex space-x-2 lg:ml-4 lg:mt-0">
          <ImportButton />

          <Shield permission="unit.create">
            <Button asChild>
              <Link href="/units/new">
                <PlusIcon className="mr-1.5" />
                Cadastrar
              </Link>
            </Button>
          </Shield>
        </div>
      </div>
    </header>
  )
}
