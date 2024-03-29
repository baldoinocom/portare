import { Header } from './_components/header'
import { Sidebar } from './_components/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="w-full">
        <Header />

        <div>{children}</div>
      </div>
    </div>
  )
}
