import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { ImportButton } from './import-button'

export const Header = async () => {
  const count = {
    sc: await db.mDFe.count({ where: { branch: 'sc', closedAt: null } }),
    pr: await db.mDFe.count({ where: { branch: 'pr', closedAt: null } }),
  }

  return (
    <header>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-2xl font-bold sm:truncate sm:tracking-tight">
            Encerramentos de MDF-e
          </h2>

          {!!count.sc || !!count.pr ? (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-muted-foreground">
                Total em Abertos:
              </label>
              <Badge>Santa Catarina: {count.sc}</Badge>
              <Badge>Paraná: {count.pr}</Badge>
            </div>
          ) : (
            <label className="text-sm text-muted-foreground">
              Gerencie e acompanhe o encerramento dos MDF-e
            </label>
          )}
        </div>

        <div className="mt-3 flex space-x-2 sm:ml-4 sm:mt-0">
          <ImportButton />
        </div>
      </div>
    </header>
  )
}
