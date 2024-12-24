import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import dayjs from 'dayjs'
import { MouseEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import * as classroomService from '../../../services/classroom.service'
import {
  computeClassroomBehavior,
  computeSchoolBehaviorAvarage,
} from '../../../utils/compute-behavior'
import { generateDatesFromYearBeginning } from '../../../utils/generate-dates-from-year-beginning'

export function BehaviorChart() {
  const [chartRange, setChartRange] = useState<'day' | 'week' | 'month'>('day')

  const { id } = useParams()

  const infractionsByClassroomId = classroomService.useGetAllInfractionsQuery()

  const classroomInfractions = infractionsByClassroomId[id as string] ?? []

  const dates = generateDatesFromYearBeginning(chartRange)

  // compute avarage without current classroom
  if (infractionsByClassroomId[id as string]) {
    delete infractionsByClassroomId[id as string]
  }

  const classroomBehavior =
    classroomInfractions.length > 0
      ? computeClassroomBehavior(
          chartRange,
          classroomInfractions.map(({ score, date }) => ({ date, score })),
        )
      : dates.map(() => 100)

  const avarageBehavior =
    Object.entries(infractionsByClassroomId).length > 0
      ? computeSchoolBehaviorAvarage(chartRange, infractionsByClassroomId)
      : dates.map(() => 100)

  const chartData = dates.map((date, index) => {
    return {
      date,
      value: classroomBehavior[index],
      avarage: avarageBehavior[index],
    }
  })

  function handleChartRange(
    _: MouseEvent<HTMLElement>,
    newChartRange: 'day' | 'week' | 'month' | null,
  ) {
    if (newChartRange !== null) {
      setChartRange(newChartRange)
    }
  }

  return (
    <>
      <ToggleButtonGroup
        value={chartRange}
        exclusive
        onChange={handleChartRange}
        aria-label="intervalo do gráfico"
      >
        <ToggleButton value="day" aria-label="diário">
          Dia
        </ToggleButton>
        <ToggleButton value="week" aria-label="semanal">
          Semana
        </ToggleButton>
        <ToggleButton value="month" aria-label="mensal">
          Mês
        </ToggleButton>
      </ToggleButtonGroup>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 60,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            minTickGap={32}
            tickMargin={10}
            tickFormatter={(date: string) => dayjs(date).format('D MMM')}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={16}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#312e81"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#color1)"
            name="Comportamento da Turma"
          />

          <Area
            type="monotone"
            dataKey="avarage"
            strokeWidth={3}
            stroke="#881337"
            fillOpacity={0}
            name="Comportamento da Escola"
          />

          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 space-y-1 text-xs rounded-lg border border-zinc-300 bg-white">
        <span className="block">
          Comportamento da turma: {payload[0].value.toFixed(1)}
        </span>
        <span className="block">
          Comportamento da escola: {payload[1].value.toFixed(1)}
        </span>
        <span className="block">{dayjs(label).format('D MMM YYYY')}</span>
      </div>
    )
  }
  return null
}
