import { Shield } from '@/components/shield'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'

export const Header = () => {
  return (
    <header>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold">Ausências de motorista</h2>

          <div className="mt-2 text-sm text-muted-foreground">
            Registre as ausências de motorista para identificar os períodos em
            que eles ficam ausentes
          </div>
        </div>

        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <Shield permission="absentDriver.create">
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-1.5" />
                Registrar
              </Button>
            </DialogTrigger>
          </Shield>
        </div>
      </div>
    </header>
  )
}
