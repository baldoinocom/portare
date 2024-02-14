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
        <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
          Encerramentos de MDF-e
        </h2>

        <TabBar countMDFeSC={countMDFeSC} countMDFePR={countMDFePR} />
      </div>
    </header>
  )
}
