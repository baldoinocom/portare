import { create } from 'zustand'

interface SidebarStore {
  opened: boolean
  onOpen: () => void
  onClose: () => void

  collapsed: boolean
  onExpand: () => void
  onCollapse: () => void
}

export const useSidebar = create<SidebarStore>((set) => ({
  opened: false,
  onOpen: () => set(() => ({ opened: true })),
  onClose: () => set(() => ({ opened: false })),

  collapsed: false,
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
}))
