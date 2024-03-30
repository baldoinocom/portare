import { TabBar } from './tab-bar'

export const Header = () => {
  return (
    <header>
      <div className="flex flex-col gap-1 border-b border-border pb-5 sm:pb-0">
        <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
          Motoristas
        </h2>

        <TabBar />
      </div>
    </header>
  )
}
