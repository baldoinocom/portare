import { db } from '@/lib/db'
import { TabBar } from './tab-bar'

export const Header = async () => {
  const count = await db.trip.count({ where: { draft: true } })

  return (
    <header>
      <div className="flex flex-col gap-1 border-b border-border pb-5 sm:pb-0">
        <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
          Viagens
        </h2>

        <TabBar drafts={count} />
      </div>
    </header>
  )
}
