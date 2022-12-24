// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Deve ter no mínimo 3 caracteres')
    .regex(/^([a-z\\-]+)$/i, 'Use apenas letras e hifens')
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, 'Deve ter no mínimo 3 caracteres'),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = registerSchema.parse(req.body)

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists)
    return res.status(400).json({ message: 'Username already taken' })

  const user = await prisma.user.create({
    data: {
      username,
      name,
    },
  })

  return res.status(201).json(user)
}
