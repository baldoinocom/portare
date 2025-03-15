import { TooltipProvider } from '@/components/ui/tooltip'
import { ShortFooterMenuItem } from './footer-menu-item'
import { ShortListMenuItem, ShortOtherListMenuItem } from './list-menu-item'
import { ToggleButton } from './toggle-button'

export const ShortMenu = () => {
  return (
    <div className="group flex grow flex-col gap-y-5 overflow-y-auto bg-background px-2 pb-4">
      <div className="flex h-14 shrink-0 items-center">
        <ToggleButton />
      </div>

      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ShortListMenuItem />
            </li>

            <li>
              <ShortOtherListMenuItem />
            </li>

            <li className="mt-auto">
              <ShortFooterMenuItem />
            </li>
          </ul>
        </nav>
      </TooltipProvider>
    </div>
  )
}
