import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from 'lucide-react'
import Link from 'next/link'

export type BreadcrumbProps = {
  name: string
  href?: string
}

export const Breadcrumb = ({ pages }: { pages: BreadcrumbProps[] }) => {
  return (
    <div>
      <nav className="sm:hidden">
        <a
          href={pages[pages.length - 2]?.href || '/'}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-accent-foreground"
        >
          <ChevronLeftIcon
            size={22}
            className="-ml-1 mr-1 flex-shrink-0 text-muted-foreground/90"
          />
          Voltar
        </a>
      </nav>

      <nav className="hidden sm:flex">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <a
                href="/"
                className="text-muted-foreground hover:text-accent-foreground"
              >
                <HomeIcon size={22} className="flex-shrink-0" />
                <span className="sr-only">Início</span>
              </a>
            </div>
          </li>

          {pages.map((page, index) => (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRightIcon className="flex-shrink-0 text-muted-foreground/90" />
                <Link
                  href={page.href ?? ''}
                  className="ml-4 text-sm font-medium text-muted-foreground hover:text-accent-foreground"
                >
                  {page.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
