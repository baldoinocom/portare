import { Button } from '@/components/ui/button'
import { CheckIcon, ClipboardIcon, PlusIcon, RocketIcon } from 'lucide-react'
import Link from 'next/link'

export const Header = () => {
  return (
    <header>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
            Origens/Destinos
          </h2>

          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <ClipboardIcon className="mr-1.5" />0 Cadastros
            </div>

            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <CheckIcon className="mr-1.5" />0 Ambos
            </div>

            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <RocketIcon className="mr-1.5" />0 Origens
            </div>

            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <RocketIcon className="mr-1.5" />0 Destinos
            </div>
          </div>
        </div>

        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <Button asChild>
            <Link href="/clients/new">
              <PlusIcon className="mr-1.5" />
              Cadastrar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
