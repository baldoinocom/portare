import { action } from '@/actions'
import { useShield } from '@/store/use-shield'
import { ShieldClientProvider } from './client'

export const ShieldProvider = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  let data = useShield.getState().permissions

  if (!data?.length) {
    data = (await action.permission().list()).data

    useShield.setState({ permissions: data })
  }

  return (
    <ShieldClientProvider permissions={data}>{children}</ShieldClientProvider>
  )
}
