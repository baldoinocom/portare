import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from './_components/header'
import { Sidebar } from './_components/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <ScrollArea className="h-screen w-full">
        <Header />

        <div>{children}</div>
      </ScrollArea>
    </div>
  )
}
