'use client'

import { useShield } from '@/store/use-shield'
import { Permission } from '@prisma/client'
import * as React from 'react'

export const ShieldClientProvider = ({
  permissions,
  children,
}: {
  permissions: Permission[]
  children: React.ReactNode
}) => {
  const { setPermissions } = useShield()

  React.useEffect(() => {
    setPermissions(permissions)
  }, [permissions, setPermissions])

  return children
}
