'use client'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/store/use-sidebar'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { Menu } from './menu'

export const MobileSidebar = () => {
  const { collapsed, onExpand } = useSidebar()
  return (
    <Transition.Root show={collapsed} as={React.Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onExpand}>
        <Transition.Child
          as={React.Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-foreground/60" />
        </Transition.Child>
        <div className="fixed inset-0 flex">
          <Transition.Child
            as={React.Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={React.Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <Button
                    variant="ghost"
                    className="-m-2.5 bg-background p-2.5 text-foreground"
                    onClick={onExpand}
                  >
                    <XIcon />
                    <span className="sr-only">Open sidebar</span>
                  </Button>
                </div>
              </Transition.Child>
              <Menu />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
