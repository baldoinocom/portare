import { Menu } from './menu'
import { MobileSidebar } from './mobile-sidebar'

export const Sidebar = () => {
  return (
    <div>
      <MobileSidebar />

      <div className="hidden border-r border-border lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Menu />
      </div>
    </div>
  )
}
