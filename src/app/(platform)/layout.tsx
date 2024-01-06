import { Header } from './_components/header'
import { Sidebar } from './_components/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />

      <div className="lg:pl-72">
        <Header />

        <div className="py-10">{children}</div>
      </div>
    </>
  )
}
