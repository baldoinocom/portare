import { DataNotFound } from '@/app/not-found'
import { PageContent } from '@/components/page-content'
import { db } from '@/lib/db'
import { PrismaPromise } from '@prisma/client'
import { MDFeResource } from '../_actions/type'
import { columns } from '../_components/columns'
import { DataTable } from '../_components/data-table'
import { Header } from '../_components/header'
import { SubTabBar } from '../_components/sub-tab-bar'

export default async function Page({
  params: { data },
}: {
  params: { data?: string[] }
}) {
  const routeInvalid =
    (data?.[0] !== 'sc' && data?.[0] !== 'pr') ||
    (data?.[1] !== undefined && data?.[1] !== 'closed')

  if (!data || routeInvalid) {
    return DataNotFound()
  }

  const [mdfe, countMDFeSC, countMDFePR] = await Promise.all([
    db.mDFe.findMany({
      where: {
        branch: data[0] === 'pr' ? 'pr' : 'sc',
        closedAt: data[1] === 'closed' ? { not: null } : { equals: null },
      },
      orderBy: { id: 'asc' },
    }) as PrismaPromise<MDFeResource[]>,
    db.mDFe.count({ where: { branch: 'sc', closedAt: null } }),
    db.mDFe.count({ where: { branch: 'pr', closedAt: null } }),
  ])

  return (
    <PageContent>
      <Header countMDFeSC={countMDFeSC} countMDFePR={countMDFePR} />

      <main>
        <div className="flex flex-col gap-y-8">
          <div className="border-b border-border sm:pb-0">
            <SubTabBar count={data[0] === 'pr' ? countMDFePR : countMDFeSC} />
          </div>

          {!mdfe.length && (
            <div className="flex justify-center">
              <span className="py-8 text-muted-foreground">Nenhum dados</span>
            </div>
          )}

          {!!mdfe.length && <DataTable columns={columns} data={mdfe} />}
        </div>
      </main>
    </PageContent>
  )
}
