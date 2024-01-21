import { action } from '@/actions'
import { DataNotFound } from '@/app/not-found'
import { SemiTrailerForm } from '@/components/forms/semi-trailer-form'
import { Separator } from '@/components/ui/separator'
import { Header } from './_components/header'

export default async function Page({ params }: { params: { id: string } }) {
  const semiTrailer = await action.semiTrailer().find({ id: Number(params.id) })

  if (!semiTrailer.data) {
    return DataNotFound()
  }

  const [brands, trailerTypes, cargos, trailerConfigurations, units] =
    await Promise.all([
      action.brand().findMany(),
      action.trailerType().findMany(),
      action.cargo().findMany(),
      action.trailerConfiguration().findMany(),
      action.unit().findMany(),
    ])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

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
    </div>
  )
}
