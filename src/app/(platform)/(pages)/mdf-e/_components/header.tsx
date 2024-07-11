import { ImportButton } from './import-button'

export const Header = () => {
  return (
    <header>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold sm:truncate sm:tracking-tight">
            Encerramentos de MDF-e
          </h2>

          <div className="text-sm text-muted-foreground">
            Gerencie e acompanhe o encerramento dos MDF-e
          </div>
        </div>

        <div className="mt-3 flex space-x-2 sm:ml-4 sm:mt-0">
          <ImportButton />
        </div>
      </div>
    </header>
  )
}
