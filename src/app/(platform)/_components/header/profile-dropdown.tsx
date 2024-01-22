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
import { useClerk } from '@clerk/nextjs'
import { ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { userNavigation } from '../data'

export const ProfileDropdown = () => {
  const { user, signOut } = useClerk()
  const router = useRouter()

  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="size-10">
        <AvatarFallback className="uppercase">
          {user?.username?.substring(0, 2)}
        </AvatarFallback>
      </Avatar>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="text-sm font-semibold">{user?.username}</span>
            <ChevronDownIcon size={20} className="ml-1" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <p>Nome de usuário</p>
            <p className="font-medium">{user?.username}</p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {userNavigation.map((item, index) => (
            <Link key={index} href={item.href}>
              <DropdownMenuItem>{item.name}</DropdownMenuItem>
            </Link>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signOut(() => router.push('/auth/sign-in'))}
          >
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
