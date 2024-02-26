import { ButtonImport } from './button-import'
import { TabBar } from './tab-bar'

export const Header = ({
  countMDFeSC,
  countMDFePR,
}: {
  countMDFeSC: number
  countMDFePR: number
}) => {
  return (
    <header>
      <div className="flex flex-col gap-1 border-b border-border pb-5 sm:pb-0">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
              Encerramentos de MDF-e
            </h2>
          </div>

          <div className="mt-3 space-x-2 sm:ml-4 sm:mt-0">
            <ButtonImport />
          </div>
        </div>

        <TabBar countMDFeSC={countMDFeSC} countMDFePR={countMDFePR} />
      </div>
    </header>
  )
}
