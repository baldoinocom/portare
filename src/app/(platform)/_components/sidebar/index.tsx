import { DesktopSidebar } from './desktop-sidebar'
import { MobileSidebar } from './mobile-sidebar'

export const Sidebar = () => {
  return (
    <>
      <MobileSidebar />

      <DesktopSidebar />
    </>
  )
}
