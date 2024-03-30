import { create } from 'zustand'

export type Width = 'flexible' | 'full'

interface PageWidthStore {
  width: Width | undefined
  setWidth: (value: Width) => void
}

export const usePageWidth = create<PageWidthStore>((set) => ({
  width: undefined,
  setWidth: (width) => set(() => ({ width })),
}))
