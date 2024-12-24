import clsx from 'clsx'
import { Smiley, SmileyMeh, SmileySad } from 'phosphor-react'
import { useParams } from 'react-router-dom'

import * as classroomService from '../../services/classroom.service'
import { computeClassroomBehavior } from '../../utils/compute-behavior'
import { BehaviorChart } from './components/BehaviorChart'
import { StudentTable } from './components/StudentTable'
import { TopClassroomInfractionsList } from './components/TopClassroomInfractionsList'

type TimeRange = 'day' | 'week' | 'month'

export function ClassroomDashboard() {
  const { id } = useParams()
  const infractionsByClassroomId = classroomService.useGetAllInfractionsQuery()
  const classroomInfractions = infractionsByClassroomId[id as string]
  const getClassroomBehavior = (interval: TimeRange) =>
    classroomInfractions &&
    computeClassroomBehavior(
      interval,
      classroomInfractions.map(({ score, date }) => ({ date, score })),
    )
  const classroomDailyBehavior = getClassroomBehavior('day')
  const classroomWeeklyBehavior = getClassroomBehavior('week')
  const classroomMonthlyBehavior = getClassroomBehavior('month')

  const getSmileyColor = (behavior: number) =>
    behavior >= 75
      ? 'bg-green-500'
      : behavior >= 50
      ? 'bg-yellow-500'
      : 'bg-red-500'
  const getSmileyEmoji = (behavior: number) =>
    behavior >= 75 ? (
      <Smiley size={32} color="#ffffff" />
    ) : behavior >= 50 ? (
      <SmileyMeh size={32} color="#ffffff" />
    ) : (
      <SmileySad size={32} color="#ffffff" />
    )

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="bg-white w-full px-8 py-6 space-y-8 rounded-lg max-xl:col-span-3">
        <header className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-500">
              COMPORTAMENTO HOJE
            </h3>
            <strong className="text-xl font-extrabold">
              {classroomDailyBehavior?.at(-1)?.toFixed(1)}%
            </strong>
          </div>

          <div
            className={clsx(
              'w-12 h-12 aspect-square rounded-full flex items-center justify-center',
              getSmileyColor(Number(classroomDailyBehavior?.at(-1))),
            )}
          >
            {getSmileyEmoji(Number(classroomDailyBehavior?.at(-1)))}
          </div>
        </header>
        <p className="text-sm font-medium text-gray-600">
          Ontem {classroomDailyBehavior?.at(-2)?.toFixed(1)}%
        </p>
      </div>

      <div className="bg-white w-full px-8 py-6 space-y-8 rounded-lg max-xl:col-span-3">
        <header className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-500">ESSA SEMANA</h3>
            <strong className="text-xl font-extrabold">
              {classroomWeeklyBehavior?.at(-1)?.toFixed(1)}%
            </strong>
          </div>

          <div
            className={clsx(
              'w-12 h-12 aspect-square rounded-full flex items-center justify-center',
              getSmileyColor(Number(classroomWeeklyBehavior?.at(-1))),
            )}
          >
            {getSmileyEmoji(Number(classroomWeeklyBehavior?.at(-1)))}
          </div>
        </header>
        <p className="text-sm font-medium text-gray-600">
          Semana passada {classroomWeeklyBehavior?.at(-2)?.toFixed(1)}%
        </p>
      </div>

      <div className="bg-white w-full px-8 py-6 space-y-8 rounded-lg max-xl:col-span-3">
        <header className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-500">ESSE MÊS</h3>
            <strong className="text-xl font-extrabold">
              {classroomMonthlyBehavior?.at(-1)?.toFixed(1)}%
            </strong>
          </div>

          <div
            className={clsx(
              'w-12 h-12 aspect-square rounded-full flex items-center justify-center',
              getSmileyColor(Number(classroomMonthlyBehavior?.at(-1))),
            )}
          >
            {getSmileyEmoji(Number(classroomMonthlyBehavior?.at(-1)))}
          </div>
        </header>
        <p className="text-sm font-medium text-gray-600">
          Mês passado {classroomMonthlyBehavior?.at(-2)?.toFixed(1)}%
        </p>
      </div>

      <div className="w-full h-[512px] flex flex-col items-center gap-4 py-4 rounded-lg col-span-2 max-xl:col-span-3 bg-white ">
        <BehaviorChart />
      </div>

      <div className="w-full h-fit rounded-lg max-lg:col-span-3  max-xl:col-span-3 bg-white">
        <TopClassroomInfractionsList />
      </div>

      <div className="col-span-3">
        <StudentTable />
      </div>
    </div>
  )
}
