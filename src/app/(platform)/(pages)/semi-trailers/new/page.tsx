import { action } from '@/actions'
import { SemiTrailerForm } from '@/components/forms/semi-trailer-form'
import { PageContent } from '@/components/page-content'
import { Shield } from '@/components/shield'
import { Header } from './_components/header'

export default async function Page() {
  const [brands, trailerTypes, cargos, trailerConfigurations, units] =
    await Promise.all([
      action.brand({ overwriter: 'semiTrailer.create' }).findMany(),
      action.trailerType({ overwriter: 'semiTrailer.create' }).findMany(),
      action.cargo({ overwriter: 'semiTrailer.create' }).findMany(),
      action
        .trailerConfiguration({ overwriter: 'semiTrailer.create' })
        .findMany(),
      action.unit({ overwriter: 'semiTrailer.create' }).findMany(),
    ])

  return (
    <Shield page permission="semiTrailer.create">
      <PageContent>
        <Header />

        <main>
          <SemiTrailerForm
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
