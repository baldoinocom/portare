import { formatCPF } from '@/lib/formatters'
import { Person } from '@prisma/client'

export const PersonDetailCard = ({ person }: { person: Person }) => {
  return (
    <div className="flex flex-col items-start uppercase">
      <span className="text-xs font-medium text-muted-foreground">
        {person?.nickname}
      </span>
      <span>{person?.name}</span>
      <span className="text-xs">{formatCPF(person?.document)}</span>
    </div>
  )
}
