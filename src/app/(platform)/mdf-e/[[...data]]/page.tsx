import { DataNotFound } from '@/app/not-found'
import { db } from '@/lib/db'
import { PrismaPromise } from '@prisma/client'
import { MDFeResource } from '../_actions/type'
import { ButtonImport } from '../_components/button-import'
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
    }) as PrismaPromise<MDFeResource[]>,
    db.mDFe.count({ where: { branch: 'sc', closedAt: null } }),
    db.mDFe.count({ where: { branch: 'pr', closedAt: null } }),
  ])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header countMDFeSC={countMDFeSC} countMDFePR={countMDFePR} />

      <main>
        <div className="flex flex-col gap-y-8">
          <div className="border-b border-border pb-5 sm:pb-0">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold">Registros</h2>
              </div>

              <div className="mt-3 space-x-2 sm:ml-4 sm:mt-0">
                <ButtonImport />
              </div>
            </div>

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
    </div>
  )
}
