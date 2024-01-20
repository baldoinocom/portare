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
import { useRouter } from 'next/navigation'
import { userNavigation } from '../data'

export const ProfileDropdown = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="size-10">
        {/* <AvatarImage src="https://github.com/shadcn.png" alt="avatar" /> */}
        <AvatarFallback>TO</AvatarFallback>
      </Avatar>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="text-sm font-semibold">TOM COOK</span>
            <ChevronDownIcon size={20} className="ml-1" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <p>Nome de usuário</p>
            <p className="font-medium">tomcook</p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {userNavigation.map((item, index) => (
            <DropdownMenuItem key={index}>
              <a href={item.href}>{item.name}</a>
            </DropdownMenuItem>
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
