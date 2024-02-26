import { DesktopSidebar } from './desktop-sidebar'
import { MobileSidebar } from './mobile-sidebar'

export const Sidebar = () => {
  return (
    <div>
      <MobileSidebar />

      <DesktopSidebar />
    </div>
  )
}
