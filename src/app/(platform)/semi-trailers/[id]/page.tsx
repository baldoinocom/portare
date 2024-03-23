import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { SemiTrailerForm } from '@/components/forms/semi-trailer-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { id: string } }) {
  const semiTrailer = await action
    .semiTrailer({ overwriter: 'semiTrailer.update' })
    .find({ id: Number(params.id) })

  if (!semiTrailer.data) {
    return DataNotFound()
  }

  const [brands, trailerTypes, cargos, trailerConfigurations, units] =
    await Promise.all([
      action.brand({ overwriter: 'semiTrailer.update' }).findMany(),
      action.trailerType({ overwriter: 'semiTrailer.update' }).findMany(),
      action.cargo({ overwriter: 'semiTrailer.update' }).findMany(),
      action
        .trailerConfiguration({ overwriter: 'semiTrailer.update' })
        .findMany(),
      action.unit({ overwriter: 'semiTrailer.update' }).findMany(),
    ])

  return (
    <Shield page permission="semiTrailer.update">
      <PageContent>
        <Header />

        <main>
          <SemiTrailerForm
            initialData={semiTrailer.data}
            brands={brands.data}
            trailerTypes={trailerTypes.data}
            cargos={cargos.data}
            trailerConfigurations={trailerConfigurations.data}
            units={units.data}
          />
        </main>
      </PageContent>
    </Shield>
  )
}
