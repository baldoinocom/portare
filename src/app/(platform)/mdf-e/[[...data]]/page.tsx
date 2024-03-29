import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { Unauthorized } from '@/app/unauthorized'
import { PageContent } from '@/components/page-content'
import { db } from '@/lib/db'
import { PrismaPromise } from '@prisma/client'
import { MDFeResource } from '../_actions/type'
import { columns } from '../_components/columns'
import { DataTable } from '../_components/data-table'
import { Header } from '../_components/header'
import { SubTabBar } from '../_components/sub-tab-bar'

export default async function Page({
  params: { data = [] },
}: {
  params: { data?: string[] }
}) {
  const [state, status] = data as Partial<['sc' | 'pr', 'closed']>

  const routeInvalid =
    (state !== 'sc' && state !== 'pr') ||
    (status !== undefined && status !== 'closed')

  if (!data?.length || routeInvalid) {
    return DataNotFound()
  }

  const check = await action.permission().checkUser({
    permission: 'mdfe.view',
    guard: 'page',
  })

  if (!check) {
    return Unauthorized()
  }

  const [mdfe, countMDFeSC, countMDFePR] = await Promise.all([
    db.mDFe.findMany({
      where: {
        branch: state === 'pr' ? 'pr' : 'sc',
        closedAt: status === 'closed' ? { not: null } : { equals: null },
      },
      orderBy: { id: 'asc' },
    }) as PrismaPromise<MDFeResource[]>,
    db.mDFe.count({ where: { branch: 'sc', closedAt: null } }),
    db.mDFe.count({ where: { branch: 'pr', closedAt: null } }),
  ])

  if (!status) {
    const licensePlates = mdfe.map(({ data }) => data.Caminhão)

    const vehicles = await db.grouping.findMany({
      where: { truck: { vehicle: { licensePlate: { in: licensePlates } } } },
      select: {
        truck: { select: { vehicle: { select: { licensePlate: true } } } },
        semiTrailer: {
          select: {
            trailers: {
              select: { vehicle: { select: { licensePlate: true } } },
            },
          },
        },
      },
    })

    for (const { data } of mdfe) {
      const vehicle = vehicles.find(
        ({ truck }) => truck?.vehicle.licensePlate === data.Caminhão,
      )

      const semiTrailer = vehicle?.semiTrailer?.trailers.map(
        ({ vehicle }) => vehicle.licensePlate,
      )

      data.Reboque = semiTrailer?.join(' | ')
    }
  }

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
