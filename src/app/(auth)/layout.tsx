import { currentUser } from '@/lib/auth-service'
import { Authenticated } from './_components/authenticated'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (user) {
    return (
      <main>
        <Authenticated />
      </main>
    )
  }

  return <main>{children}</main>
}
