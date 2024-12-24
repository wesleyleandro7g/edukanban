import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import clsx from 'clsx'
import { CaretDown } from 'phosphor-react'
import { useParams } from 'react-router-dom'

import { infractions } from '../../../data'
import * as classroomService from '../../../services/classroom.service'
import * as studentService from '../../../services/student.service'
import { computeTopClassroomInfractions } from '../../../utils/compute-top-classroom-infractions'

export function TopClassroomInfractionsList() {
  const { id } = useParams()

  const { data: students } = studentService.useGetAllStudentsQuery()

  const infractionsByClassId = classroomService.useGetAllInfractionsQuery()

  const classroomInfractions = infractionsByClassId[id as string] ?? []

  const topClassroomInfractions = computeTopClassroomInfractions(
    classroomInfractions,
    5,
  )

  return (
    <div>
      <div className="px-6 py-4 font-bold">
        <h2>Principais Problemas</h2>
      </div>

      {Object.entries(topClassroomInfractions).map(
        ([infractionCode, { students: topStudents }]) => (
          <Accordion key={infractionCode} disableGutters elevation={0}>
            <AccordionSummary expandIcon={<CaretDown />}>
              <div className="flex items-center gap-2 px-2">
                <div
                  className={clsx(
                    'w-10 h-10 aspect-square flex justify-center items-center border rounded-full text-white',
                    {
                      'bg-yellow-500': infractionCode.includes('A'),
                      'bg-orange-500': infractionCode.includes('M'),
                      'bg-red-600': infractionCode.includes('G'),
                    },
                  )}
                >
                  {infractionCode}
                </div>
                <span className="text-sm font-medium">
                  {
                    infractions.find(({ value }) => value === infractionCode)
                      ?.label
                  }
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {topStudents.map(({ id, percentage }) => (
                <div
                  key={id}
                  className="flex justify-between items-center pl-4 text-sm"
                >
                  {students?.find((student) => student.id === id)?.name}{' '}
                  <span className="text-xs font-black">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ),
      )}
    </div>
  )
}
