import { Body } from './_components/body'
import { Header } from './_components/header'
import { Sidebar } from './_components/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <Body>
        <Header />

        <div>{children}</div>
      </Body>
    </div>
  )
}
