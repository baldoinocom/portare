'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export const SignOut = () => {
  const { signOut } = useClerk()

  const router = useRouter()

  const onSignOut = async () => {
    await signOut(() => router.push('/auth/sign-in'))
  }

  return <DropdownMenuItem onClick={onSignOut}>Sair</DropdownMenuItem>
}
