import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { currentUser } from '@/lib/auth-service'
import { ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'
import { userNavigation } from '../data'
import { SignOut } from './sign-out'

export const ProfileDropdown = async () => {
  const user = await currentUser()

  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="size-8">
        <AvatarFallback className="text-sm uppercase">
          {user?.username?.substring(0, 2)}
        </AvatarFallback>
      </Avatar>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <span className="text-sm font-semibold">{user?.username}</span>
            <ChevronDownIcon className="ml-1 size-[1rem]" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="text-xs">
            <p>Nome de usuário</p>
            <p className="font-medium">{user?.username}</p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {userNavigation.map((item, index) => (
            <Link key={index} href={item.href}>
              <DropdownMenuItem className="text-xs">
                {item.name}
              </DropdownMenuItem>
            </Link>
          ))}

          <DropdownMenuSeparator />

          <SignOut />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
