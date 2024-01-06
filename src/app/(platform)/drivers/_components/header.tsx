import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const tabs = [
  { name: 'Cadastros', href: '#', current: true },
  { name: 'Ausências', href: '#', current: false },
  { name: 'A.S.O', href: '#', current: false },
]

export const Header = () => {
  return (
    <header>
      <div className="flex flex-col gap-1 border-b border-border pb-5 sm:pb-0">
        <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
          Motoristas
        </h2>

        <div className="sm:hidden">
          <Select defaultValue={tabs.find((tab) => tab.current)?.name}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma guia" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tabs.map((tab, index) => (
                  <SelectItem key={index} value={tab.name}>
                    {tab.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab, index) => (
              <Button
                key={index}
                variant="ghost"
                asChild
                className={cn(
                  tab.current
                    ? 'border-primary text-primary hover:text-primary'
                    : 'border-transparent text-muted-foreground',
                  'whitespace-nowrap rounded-none border-b-2 px-1 pb-4 hover:bg-transparent',
                )}
              >
                <Link key={index} href={tab.href}>
                  {tab.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
