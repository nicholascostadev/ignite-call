import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { prisma } from '../../../lib/prisma'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number({
        required_error: 'Dia da semana é obrigatório',
        invalid_type_error: 'Dia da semana tem que ser do tipo `number`',
        description: 'Dado inválido',
      }),
      startTimeInMinutes: z.number({
        required_error: 'Tempo de início é obrigatório',
        invalid_type_error: 'Tempo de início tem que ser do tipo `number`',
        description: 'Dado inválido',
      }),
      endTimeInMinutes: z.number({
        required_error: 'Tempo de conclusão é obrigatório',
        invalid_type_error: 'Tempo de conclusão tem que ser do tipo `number`',
        description: 'Dado inválido',
      }),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  // since there are no methods as `createMany` in prisma when using
  // SQlite, we have to do it in another way
  await Promise.all(
    intervals.map((interval) =>
      prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      }),
    ),
  )

  return res.status(201).end()
}
