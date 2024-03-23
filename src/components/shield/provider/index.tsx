import { action } from '@/actions'
import { ShieldClientProvider } from './client'

export const ShieldProvider = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { data } = await action.permission().list()

  return (
    <ShieldClientProvider permissions={data}>{children}</ShieldClientProvider>
  )
}
