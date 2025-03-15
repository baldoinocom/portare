'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export const ModeToggle = () => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="size-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem className="text-xs" onClick={() => setTheme('light')}>
          Claro
        </DropdownMenuItem>

        <DropdownMenuItem className="text-xs" onClick={() => setTheme('dark')}>
          Escuro
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-xs"
          onClick={() => setTheme('system')}
        >
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
