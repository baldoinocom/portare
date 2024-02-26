import { PageContent } from '@/components/page-content'
import { Header } from './_components/header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageContent>
      <Header />

      {children}
    </PageContent>
  )
}
