import { Button } from '@/components/ui/button'
import {
  Building2Icon,
  ClipboardIcon,
  PlusIcon,
  Users2Icon,
} from 'lucide-react'
import Link from 'next/link'

export const Header = () => {
  return (
    <header>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
            Agregados
          </h2>

          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <ClipboardIcon className="mr-1.5" />0 Cadastros
            </div>

            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Users2Icon className="mr-1.5" />0 CPF
            </div>

            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Building2Icon className="mr-1.5" />0 CNPJ
            </div>
          </div>
        </div>

        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <Button asChild>
            <Link href="/aggregates/new">
              <PlusIcon className="mr-1.5" />
              Cadastrar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
