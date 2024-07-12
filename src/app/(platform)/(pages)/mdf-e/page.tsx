import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { Unauthorized } from '@/app/unauthorized'
import { PageContent } from '@/components/page-content'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { MDFe } from '@prisma/client'
import { SearchParams } from 'nuqs/parsers'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { Header } from './_components/header'
import { searchParamsCache } from './_lib/search-params'

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  searchParamsCache.parse(searchParams)

  const { state, closed, search, page, limit } = searchParamsCache.all()

  const routeInvalid = state !== 'sc' && state !== 'pr'

  if (routeInvalid) {
    return DataNotFound()
  }

  const check = await action
    .permission()
    .checkUser({ permission: 'mdfe.view', guard: 'page' })

  if (!check) {
    return Unauthorized()
  }

  const count = await db.mDFe.count({
    where: {
      OR: [
        { manifest: { contains: search } },
        { licensePlate: { contains: search } },
        { destinatary: { contains: search } },
        { address: { contains: search } },
        { invoice: { contains: search } },
        { invoiceIssue: { contains: search } },
        { cte: { contains: search } },
        { cteIssue: { contains: search } },
        { note: { contains: search } },
      ],
      branch: state === 'pr' ? 'pr' : 'sc',
      closedAt: closed ? { not: null } : { equals: null },
    },
  })

  const take = limit > 100 ? 100 : limit
  const skip = (page - 1) * take

  const mdfe = (await db.mDFe.findMany({
    skip,
    take,
    where: {
      OR: [
        { manifest: { contains: search } },
        { licensePlate: { contains: search } },
        { destinatary: { contains: search } },
        { address: { contains: search } },
        { invoice: { contains: search } },
        { invoiceIssue: { contains: search } },
        { cte: { contains: search } },
        { cteIssue: { contains: search } },
        { note: { contains: search } },
      ],
      branch: state === 'pr' ? 'pr' : 'sc',
      closedAt: closed ? { not: null } : { equals: null },
    },
  })) as (MDFe & { semiTrailer?: string })[]

  if (!closed) {
    const vehicles = await db.grouping.findMany({
      where: {
        truck: {
          vehicle: {
            licensePlate: { in: mdfe.map(({ licensePlate }) => licensePlate) },
          },
        },
      },
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

    for (const item of mdfe) {
      const vehicle = vehicles.find(
        ({ truck }) => truck?.vehicle.licensePlate === item.licensePlate,
      )

      const licensePlates = vehicle?.semiTrailer?.trailers.map(
        ({ vehicle }) => vehicle.licensePlate,
      )

      item.semiTrailer = licensePlates?.join(' | ')
    }
  }

  return (
    <PageContent>
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col space-y-4">
          <DataTable columns={columns} data={mdfe} count={count} />
        </div>
      </main>
    </PageContent>
  )
}
