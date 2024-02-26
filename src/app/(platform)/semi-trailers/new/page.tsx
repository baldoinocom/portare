import { action } from '@/actions'
import { SemiTrailerForm } from '@/components/forms/semi-trailer-form'
import { PageContent } from '@/components/page-content'
import { Header } from './_components/header'

export default async function Page() {
  const [brands, trailerTypes, cargos, trailerConfigurations, units] =
    await Promise.all([
      action.brand().findMany(),
      action.trailerType().findMany(),
      action.cargo().findMany(),
      action.trailerConfiguration().findMany(),
      action.unit().findMany(),
    ])

  return (
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
  )
}
