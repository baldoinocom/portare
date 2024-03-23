import { ShieldProvider } from '@/components/shield/provider'

export default async function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return <ShieldProvider>{children}</ShieldProvider>
}
