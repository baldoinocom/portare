'use client'

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type OverviewProps = {
  weekday: string
  Saídas: number
  Entregas: number
}[]

export const Overview = ({ data }: { data: OverviewProps }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        <XAxis dataKey="weekday" fontSize={12} className="capitalize" />
        <YAxis fontSize={12} />

        <Legend
          content={
            <div className="flex flex-row justify-center space-x-4">
              <div className="flex flex-row items-center space-x-1">
                <div className="size-3 rounded-sm bg-foreground/90" />
                <div className="text-xs text-foreground">Saídas</div>
              </div>

              <div className="flex flex-row items-center space-x-1">
                <div className="size-3 rounded-sm bg-foreground/50" />
                <div className="text-xs text-foreground">Entregas</div>
              </div>
            </div>
          }
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Saídas
                      </span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Entregas
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[1].value}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
          }}
        />

        <Line
          dataKey="Saídas"
          strokeWidth={2}
          activeDot={{ r: 8, className: 'fill-foreground/90' }}
          stroke=""
          className="stroke-foreground/90"
        />
        <Line
          dataKey="Entregas"
          strokeWidth={2}
          activeDot={{ r: 6, className: 'fill-foreground/50' }}
          stroke=""
          className="stroke-foreground/50"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
