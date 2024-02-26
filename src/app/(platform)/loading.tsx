import { PageContent } from '@/components/page-content'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <PageContent>
      <header>
        <Skeleton className="h-12 w-[250px]" />
        <div className="flex flex-col pt-1 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <Skeleton className="h-8 w-[120px]" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
      </header>

      <Separator />

      <main>
        <Skeleton className="h-80 w-full" />
      </main>
    </PageContent>
  )
}
