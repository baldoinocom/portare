import { Permission } from '@prisma/client'
import { create } from 'zustand'

interface ShieldStore {
  permissions: Permission[]
  setPermissions: (permissions: Permission[]) => void
}

export const useShield = create<ShieldStore>((set) => ({
  permissions: [],
  setPermissions: (permissions) => set(() => ({ permissions })),
}))
